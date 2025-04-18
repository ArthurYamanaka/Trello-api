export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, due, labels } = req.body;

  const key = process.env.TRELLO_KEY;
  const token = process.env.TRELLO_TOKEN;
  const listId = process.env.TRELLO_LIST_ID;

  if (!key || !token || !listId) {
    return res.status(500).json({ error: "Missing Trello credentials" });
  }

  try {
    const response = await fetch(`https://api.trello.com/1/cards?key=${key}&token=${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: message,
        idList: listId,
        due: due || null,
        idLabels: labels || []
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.message || "Erro ao criar o card" });
    }

    return res.status(200).json({ success: true, card: data });
  } catch (error) {
    return res.status(500).json({ error: "Erro interno", details: error.message });
  }
}
