const axios = require('axios');

async function anexarImagemAoCard(cardId, imagemUrl) {
  const key = process.env.TRELLO_KEY;
  const token = process.env.TRELLO_TOKEN;

  try {
    const response = await axios.post(`https://api.trello.com/1/cards/${cardId}/attachments`, null, {
      params: {
        key,
        token,
        url: imagemUrl
      }
    });

    console.log("Imagem anexada com sucesso:", response.data);
    return response.data;
  } catch (error) {
    console.error("Erro ao anexar imagem:", error.response?.data || error.message);
    throw error;
  }
}
