// Atualizado com suporte a imagem em cards do Trelloo

const axios = require('axios');

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    message,
    due,
    labels = [],
    listName,
    boardName,
    imageUrl // <- Novo campo opcional
  } = req.body;

  const TRELLO_KEY = process.env.TRELLO_KEY;
  const TRELLO_TOKEN = process.env.TRELLO_TOKEN;

  if (!message || !listName || !boardName) {
    return res.status(400).json({ error: "Campos obrigatórios faltando" });
  }

  try {
    // Buscar todos os boards
    const boardsRes = await axios.get(
      `https://api.trello.com/1/members/me/boards?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`
    );
    const board = boardsRes.data.find(b => b.name.toLowerCase() === boardName.toLowerCase());
    if (!board) return res.status(404).json({ error: "Board não encontrado" });

    // Buscar listas do board
    const listsRes = await axios.get(
      `https://api.trello.com/1/boards/${board.id}/lists?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`
    );
    const list = listsRes.data.find(l => l.name.toLowerCase() === listName.toLowerCase());
    if (!list) return res.status(404).json({ error: "Lista não encontrada" });

    // Criar o card
    const cardRes = await axios.post(
      `https://api.trello.com/1/cards?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`,
      {
        name: message,
        idList: list.id,
        due,
        idLabels: [], // IDs das etiquetas serão preenchidos abaixo
      }
    );

    const cardId = cardRes.data.id;

    // Adicionar etiquetas
    if (labels.length > 0) {
      const labelRes = await axios.get(
        `https://api.trello.com/1/boards/${board.id}/labels?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`
      );
      for (let labelName of labels) {
        const label = labelRes.data.find(l => l.name.toLowerCase() === labelName.toLowerCase());
        if (label) {
          await axios.post(
            `https://api.trello.com/1/cards/${cardId}/idLabels?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`,
            { value: label.id }
          );
        }
      }
    }

    // Adicionar imagem, se houver
    if (imageUrl) {
      await axios.post(
        `https://api.trello.com/1/cards/${cardId}/attachments?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`,
        { url: imageUrl }
      );
    }

    return res.status(200).json({ message: "Card criado com sucesso", cardId });
  } catch (error) {
    console.error("Erro ao criar card:", error.response?.data || error.message);
    return res.status(500).json({ error: "Erro ao criar card" });
  }
};
