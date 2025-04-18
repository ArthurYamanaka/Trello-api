export default async function handler(req, res) {
  const { message, due, labels } = req.body;

  const TRELLO_KEY = process.env.TRELLO_KEY;
  const TRELLO_TOKEN = process.env.TRELLO_TOKEN;
  const LIST_ID = process.env.LIST_ID;

  if (!message) {
    return res.status(400).json({ success: false, error: "Mensagem obrigatória." });
  }

  try {
    // Buscar IDs das etiquetas, se houver
    let labelIds = [];
    if (labels && labels.length > 0) {
      const boardRes = await fetch(`https://api.trello.com/1/lists/${LIST_ID}?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`);
      const boardData = await boardRes.json();
      const boardId = boardData.idBoard;

      const labelRes = await fetch(`https://api.trello.com/1/boards/${boardId}/labels?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`);
      const allLabels = await labelRes.json();

      labelIds = labels.map(labelName => {
        const found = allLabels.find(l => l.name.toLowerCase() === labelName.toLowerCase());
        return found ? found.id : null;
      }).filter(id => id); // remove nulls
    }

    const url = `https://api.trello.com/1/cards?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}&idList=${LIST_ID}&name=${encodeURIComponent(message)}${
      due ? `&due=${encodeURIComponent(due)}` : ''
    }${
      labelIds.length > 0 ? `&idLabels=${labelIds.join(',')}` : ''
    }`;

    const response = await fetch(url, { method: 'POST' });
    const data = await response.json();

    res.status(200).json({ success: true, card: data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
