export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, due, labels } = req.body;

  const labelMap = {
    "prioridade-baixa": "662061b410c59e51939d9fd1",
    "prioridade-alta": "662061bc10c59e51939d9fd7",
    "urgente": "SEU_ID_URGENTE",
    "importante": "SEU_ID_IMPORTANTE"
  };

  const labelIds = (labels || []).map(label => labelMap[label] || label);

  try {
    const response = await fetch(`https://api.trello.com/1/cards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: message,
        due,
        idLabels: labelIds,
        idList: process.env.LIST_ID,
        key: process.env.TRELLO_KEY,
        token: process.env.TRELLO_TOKEN
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    return res.status(200).json({ success: true, card: data });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
