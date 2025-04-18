export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { cardName, fromListName, toListName, boardName } = req.body;

  if (!cardName || !fromListName || !toListName || !boardName) {
    return res.status(400).json({ error: "cardName, fromListName, toListName e boardName são obrigatórios." });
  }

  const TRELLO_KEY = process.env.TRELLO_KEY;
  const TRELLO_TOKEN = process.env.TRELLO_TOKEN;

  try {
    // Passo 1: Buscar todos os boards
    const boardsRes = await fetch(`https://api.trello.com/1/members/me/boards?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`);
    const boards = await boardsRes.json();
    const board = boards.find(b => b.name.toLowerCase() === boardName.toLowerCase());
    if (!board) return res.status(404).json({ error: `Quadro '${boardName}' não encontrado.` });

    // Passo 2: Buscar todas as listas do board
    const listsRes = await fetch(`https://api.trello.com/1/boards/${board.id}/lists?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`);
    const lists = await listsRes.json();
    const fromList = lists.find(l => l.name.toLowerCase() === fromListName.toLowerCase());
    const toList = lists.find(l => l.name.toLowerCase() === toListName.toLowerCase());
    if (!fromList || !toList) {
      return res.status(404).json({ error: "Lista de origem ou destino não encontrada." });
    }

    // Passo 3: Buscar todos os cards da lista de origem
    const cardsRes = await fetch(`https://api.trello.com/1/lists/${fromList.id}/cards?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`);
    const cards = await cardsRes.json();
    const card = cards.find(c => c.name.toLowerCase() === cardName.toLowerCase());
    if (!card) return res.status(404).json({ error: `Card '${cardName}' não encontrado em '${fromListName}'.` });

    // Passo 4: Atualizar o card para nova lista
    const moveRes = await fetch(`https://api.trello.com/1/cards/${card.id}?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}&idList=${toList.id}`, {
      method: "PUT"
    });

    const updated = await moveRes.json();
    return res.status(200).json({ success: true, card: updated });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
