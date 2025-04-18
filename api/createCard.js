export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, due, idLabels } = req.body;

  const TRELLO_KEY = process.env.TRELLO_KEY;
  const TRELLO_TOKEN = process.env.TRELLO_TOKEN;
  const LIST_ID = process.env.LIST_ID;

  // Busca todas as etiquetas do board
  const labelsResponse = await fetch(`https://api.trello.com/1/boards/${process.env.BOARD_ID}/labels?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`);
  const allLabels = await labelsResponse.json();

  // Converte os nomes amigáveis para IDs
  const labelIds = idLabels
    ? allLabels
        .filter(label => idLabels.includes(label.name.toLowerCase()))
        .map(label => label.id)
    : [];

  // Cria o card com os IDs reais
  const response = await fetch(`https://api.trello.com/1/cards?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: message,
      idList: LIST_ID,
      due,
      idLabels: labelIds
    })
  });

  const data = await response.json();
  res.status(response.status).json(data);
}
