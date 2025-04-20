const fetch = require('node-fetch');

const getCards = async () => {
  const TRELLO_KEY = process.env.TRELLO_KEY;
  const TRELLO_TOKEN = process.env.TRELLO_TOKEN;
  const LIST_ID = process.env.TRELLO_LIST_ID; // você precisa colocar isso nas variáveis da Vercel

  const url = `https://api.trello.com/1/lists/${LIST_ID}/cards?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error('Erro ao buscar cards');

  const data = await response.json();

  return data.map(card => ({
    id: card.id,
    name: card.name,
    due: card.due,
    labels: card.labels.map(label => label.name),
  }));
};

module.exports = getCards;
