const fetch = require('node-fetch');

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { listId } = req.body;

  if (!listId) {
    return res.status(400).json({ error: "Missing listId" });
  }

  const TRELLO_KEY = process.env.TRELLO_KEY;
  const TRELLO_TOKEN = process.env.TRELLO_TOKEN;

  try {
    const response = await fetch(
      `https://api.trello.com/1/lists/${listId}/cards?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch cards from Trello");
    }

    const data = await response.json();

    const formatted = data.map((card) => ({
      id: card.id,
      name: card.name,
      due: card.due,
      labels: card.labels.map((label) => label.name),
    }));

    res.status(200).json({ cards: formatted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
