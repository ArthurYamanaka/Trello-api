export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, due, labels } = req.body;

  const TRELLO_KEY = process.env.TRELLO_KEY;
  const TRELLO_TOKEN = process.env.TRELLO_TOKEN;
  const TRELLO_LIST_ID = process.env.LIST_ID;

  if (!TRELLO_KEY || !TRELLO_TOKEN || !TRELLO_LIST_ID) {
    return res.status(500).json({ error: "Missing Trello credentials" });
  }

  const url = `https://api.trello.com/1/cards?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`;

  const body = {
    name: message,
    idList: TRELLO_LIST_ID,
    ...(due && { due }),
    ...(labels && { idLabels: labels }),
  };

  const trelloRes = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await trelloRes.json();

  if (!trelloRes.ok) {
    return res.status(trelloRes.status).json({ error: data.message || "Erro ao criar o card no Trello" });
  }

  res.status(200).json({ success: true, card: data });
}
