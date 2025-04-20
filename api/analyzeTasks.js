const getCards = require('../lib/getCards');
const getTasks = require('../lib/getTasks');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { prompt } = req.body;

    const cards = await getCards();
    const tasks = await getTasks();

    const hoje = new Date().toDateString();

    const cardsHojeAlta = cards.filter(card =>
      card.due && new Date(card.due).toDateString() === hoje &&
      card.labels.includes('Prioridade Alta')
    );

    const tarefasHoje = tasks.filter(t =>
      new Date(t.dueDate).toDateString() === hoje
    );

    const resumo = {
      cardsAltaHoje: cardsHojeAlta.length,
      tarefasHoje: tarefasHoje.length,
      recomendacao: ""
    };

    if (resumo.cardsAltaHoje + resumo.tarefasHoje === 0) {
      resumo.recomendacao = "Hoje está tranquilo. Aproveite para se organizar.";
    } else if (resumo.tarefasHoje >= 5) {
      resumo.recomendacao = "Muitas tarefas hoje. Foque nas mais importantes.";
    } else {
      resumo.recomendacao = "Você tem tarefas relevantes hoje. Mantenha o foco.";
    }

    return res.status(200).json(resumo);
  } catch (e) {
    return res.status(500).json({ error: "Falha ao analisar tarefas." });
  }
};
