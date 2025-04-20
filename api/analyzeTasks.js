const getCards = require('./lib/getCards');
const getTasks = require('./lib/getTasks');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { prompt } = req.body;
    const cards = await getCards();
    const tasks = await getTasks();

    const hoje = new Date();
    const amanha = new Date();
    amanha.setDate(hoje.getDate() + 1);

    const normalizeDate = date => new Date(date).toISOString().split('T')[0];
    const hojeStr = normalizeDate(hoje);
    const amanhaStr = normalizeDate(amanha);

    const prioridadeAlta = t => t.priority === 3 || t.labels?.includes('Prioridade Alta');

    const cardsFiltrados = cards.filter(card => {
      if (!card.due) return false;
      const dueStr = normalizeDate(card.due);
      return (
        (prompt.includes('hoje') && dueStr === hojeStr) ||
        (prompt.includes('amanha') && dueStr === amanhaStr)
      ) && prioridadeAlta(card);
    });

    const tasksFiltradas = tasks.filter(task => {
      const dueStr = normalizeDate(task.dueDate);
      return (
        (prompt.includes('hoje') && dueStr === hojeStr) ||
        (prompt.includes('amanha') && dueStr === amanhaStr)
      );
    });

    const todasTarefas = [...cardsFiltrados, ...tasksFiltradas];
    todasTarefas.sort((a, b) => new Date(a.dueDate || a.due) - new Date(b.dueDate || b.due));

    let recomendacao = "";
    if (todasTarefas.length === 0) {
      recomendacao = "Nenhuma tarefa encontrada para o período e prioridade indicados.";
    } else if (todasTarefas.length > 6) {
      recomendacao = "Agenda cheia. Priorize por impacto e prazos.";
    } else {
      recomendacao = "Você pode concluir essas tarefas com foco e organização.";
    }

    res.status(200).json({
      total: todasTarefas.length,
      tarefas: todasTarefas.map(t => ({
        titulo: t.title || t.name,
        data: normalizeDate(t.dueDate || t.due),
        prioridade: t.priority || (t.labels?.includes('Prioridade Alta') ? 'Alta' : '---')
      })),
      recomendacao
    });
  } catch (e) {
    console.error("Erro ao analisar tarefas:", e);
    return res.status(500).json({ error: "Falha ao analisar tarefas." });
  }
};
