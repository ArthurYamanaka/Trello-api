export default async function handler(req, res) {
  const { message, due, labels = [], listName, boardName } = req.body;

  if (!message || !listName || !boardName) {
    return res.status(400).json({ error: "message, listName e boardName são obrigatórios." });
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
    const list = lists.find(l => l.name.toLowerCase() === listName.toLowerCase());
    if (!list) return res.status(404).json({ error: `Lista '${listName}' não encontrada no quadro '${boardName}'.` });

    // Passo 3: Buscar todas as etiquetas do board
    const labelsRes = await fetch(`https://api.trello.com/1/boards/${board.id}/labels?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`);
    const labelList = await labelsRes.json();
    const labelIds = labelList.filter(l => labels.includes(l.name)).map(l => l.id);

    // Passo 4: Criar o card
    const url = `https://api.trello.com/1/cards?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`;
    const body = new URLSearchParams({
      idList: list.id,
      name: message,
      ...(due && { due }),
      ...(labelIds.length > 0 && { idLabels: labelIds.join(",") })
    });

    const response = await fetch(url, {
      method: "POST",
      body
    });

    const data = await response.json();
    return res.status(200).json({ success: true, card: data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
