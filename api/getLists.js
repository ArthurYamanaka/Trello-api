export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { boardId } = req.body;

  if (!boardId) {
    return res.status(400).json({ error: "Missing boardId" });
  }

  const TRELLO_KEY = process.env.TRELLO_KEY;
  const TRELLO_TOKEN = process.env.TRELLO_TOKEN;

  try {
    const response = await fetch(
      `https://api.trello.com/1/boards/${boardId}/lists?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`
    );

    if (!response.ok) {
      throw new Error(`Trello API error: ${response.statusText}`);
    }

    const lists = await response.json();

    const formattedLists = lists.map((list) => ({
      id: list.id,
      name: list.name,
      closed: list.closed,
      pos: list.pos,
    }));

    res.status(200).json({ lists: formattedLists });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
