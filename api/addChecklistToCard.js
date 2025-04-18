export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { cardName, listName, boardName, checklistName, items } = req.body;

  if (!cardName || !listName || !boardName || !checklistName || !items || !Array.isArray(items)) {
    return res.status(400).json({ error: "cardName, listName, boardName, checklistName e items (array) são obrigatórios." });
  }

  const TRELLO_KEY = process.env.TRELLO_KEY;
  const TRELLO_TOKEN = process.env.TRELLO_TOKEN;

  try {
    // 1. Buscar board
    const boardsRes = await fetch(`https://api.trello.com/1/members/me/boards?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`);
    const boards = await boardsRes.json();
    const board = boards.find(b => b.name.toLowerCase() === boardName.toLowerCase());
    if (!board) return res.status(404).json({ error: `Quadro '${boardName}' não encontrado.` });

    // 2. Buscar listas
    const listsRes = await fetch(`https://api.trello.com/1/boards/${board.id}/lists?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`);
    const lists = await listsRes.json();
    const list = lists.find(l => l.name.toLowerCase() === listName.toLowerCase());
    if (!list) return res.status(404).json({ error: `Lista '${listName}' não encontrada no quadro '${boardName}'.` });

    // 3. Buscar cards
    const cardsRes = await fetch(`https://api.trello.com/1/lists/${list.id}/cards?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`);
    const cards = await cardsRes.json();
    const card = cards.find(c => c.name.toLowerCase() === cardName.toLowerCase());
    if (!card) return res.status(404).json({ error: `Card '${cardName}' não encontrado na lista '${listName}'.` });

    // 4. Criar checklist
    const checklistRes = await fetch(`https://api.trello.com/1/cards/${card.id}/checklists?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}&name=${encodeURIComponent(checklistName)}`, {
      method: "POST"
    });
    const checklist = await checklistRes.json();

    // 5. Adicionar itens
    for (const item of items) {
      await fetch(`https://api.trello.com/1/checklists/${checklist.id}/checkItems?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}&name=${encodeURIComponent(item)}`, {
        method: "POST"
      });
    }

    return res.status(200).json({ success: true, checklist });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
