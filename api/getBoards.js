export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const TRELLO_KEY = process.env.TRELLO_KEY;
    const TRELLO_TOKEN = process.env.TRELLO_TOKEN;

    const response = await fetch(
      `https://api.trello.com/1/members/me/boards?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`
    );

    const boards = await response.json();

    const simplifiedBoards = boards.map((board) => ({
      id: board.id,
      name: board.name,
      url: board.url,
    }));

    return res.status(200).json({ boards: simplifiedBoards });
  } catch (error) {
    console.error("Erro ao obter boards:", error);
    return res.status(500).json({ error: "Erro interno ao buscar boards" });
  }
}
