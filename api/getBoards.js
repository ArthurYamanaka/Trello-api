export default async function handler(req, res) {
  const TRELLO_KEY = process.env.TRELLO_KEY;
  const TRELLO_TOKEN = process.env.TRELLO_TOKEN;

  try {
    const response = await fetch(`https://api.trello.com/1/members/me/boards?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`);
    const data = await response.json();

    // Retornar só os dados úteis
    const boards = data.map(board => ({
      id: board.id,
      name: board.name,
      url: board.url
    }));

    res.status(200).json({ boards });
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar quadros do Trello." });
  }
}
