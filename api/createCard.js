export default async function handler(req, res) {
  const { message } = req.body;

  const TRELLO_KEY = process.env.TRELLO_KEY;
  const TRELLO_TOKEN = process.env.TRELLO_TOKEN;
  const LIST_ID = process.env.LIST_ID;

  const url = `https://api.trello.com/1/cards?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}&idList=${LIST_ID}&name=${encodeURIComponent(message)}`;

  const response = await fetch(url, { method: 'POST' });
  const data = await response.json();

  res.status(200).json({ success: true, card: data });
}
