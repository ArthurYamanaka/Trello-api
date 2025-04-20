const getCards = require('./trello/getCards');
const getTasks = require('./ticktick/getTasks');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { prompt } = req.body;

    // Obtem dados reais
    const trelloCards = await getCards({ method: 'GET' }, { json: data => data });
    const ticktickTasks = await getTasks({ method: 'GET' }, { json: data => data });

    // Simples análise com base no texto do prompt
    const cardsHojeAlta = trelloCards.filter(c => 
      c.due && new Date(c.due).toDateString() === new Date().toDateString() &&
      c.labels.includes('Prioridade Alta')
    );

    const tarefasHoje = ticktickTasks.filter(t => 
      t.dueDate && new Date(t.dueDate).toDateString() === new Date().toDateString()
    );

    // Resumo inteligente
    const resumo = {
      cardsTrelloAltaHoje: cardsHojeAlta.length,
      tarefasTickTickHoje: tarefasHoje.length,
      analise: ""
    };

    if (resumo.cardsTrelloAltaHoje + resumo.tarefasTickTickHoje === 0) {
      resumo.analise = "Você está livre hoje. Aproveite para descansar ou se organizar.";
    } else if (resumo.tarefasTickTickHoje >= 5) {
      resumo.analise = "Hoje está sobrecarregado. Considere priorizar ou delegar.";
    } else {
      resumo.analise = "Você tem atividades importantes para hoje. Foque nas tarefas com maior impacto.";
    }

    return res.status(200).json(resumo);
  } catch (e) {
    return res.status(500).json({ error: "Falha ao analisar tarefas." });
  }
};
