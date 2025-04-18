export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, due, idLabels } = req.body;

  try {
    const response = await fetch(`https://api.trello.com/1/cards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: message,
        due,
        idList: process.env.LIST_ID,
        idLabels,
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
