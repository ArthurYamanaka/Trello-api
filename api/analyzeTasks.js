// api/analyzeTasks.js

const axios = require("axios");

module.exports = async (req, res) => {
  try {
    // 1. Buscar dados do TickTick
    const ticktickRes = await axios.get(
      `${process.env.VERCEL_URL}/api/ticktick/getTasks`
    );
    const ticktickTasks = ticktickRes.data || [];

    // 2. Buscar dados do Trello
    const trelloRes = await axios.get(
      `${process.env.VERCEL_URL}/api/getCards`
    );
    const trelloCards = trelloRes.data || [];

    // 3. Extrair filtros da mensagem do usuário (via req.query.input ou req.body.input)
    const input = req.query.input || req.body?.input || "";
    const normalized = input.toLowerCase();
    const today = new Date().toISOString().split("T")[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

    const wantsToday = normalized.includes("hoje");
    const wantsTomorrow = normalized.includes("amanha") || normalized.includes("amanhã");
    const wantsHighPriority = normalized.includes("prioridade alta");
    const listFilter = normalized.includes("ver agendar") ? "Ver Agendar" : null;
    const boardFilter = normalized.includes("ayra") ? "Ayra" : null;

    // 4. Filtrar TickTick
    const filteredTickTasks = ticktickTasks.filter((task) => {
      const date = task.dueDate?.split("T")[0];
      const matchesDate = (wantsToday && date === today) || (wantsTomorrow && date === tomorrow);
      const matchesPriority = wantsHighPriority ? task.priority === 3 : true;
      return matchesDate && matchesPriority;
    });

    // 5. Filtrar Trello
    const filteredTrello = trelloCards.filter((card) => {
      const cardDue = card.due?.split("T")[0];
      const matchesDate = (wantsToday && cardDue === today) || (wantsTomorrow && cardDue === tomorrow);
      const matchesPriority = wantsHighPriority ? card.labels?.some((l) => l.name.toLowerCase().includes("prioridade alta")) : true;
      const matchesList = listFilter ? card.listName === listFilter : true;
      const matchesBoard = boardFilter ? card.boardName === boardFilter : true;
      return matchesDate && matchesPriority && matchesList && matchesBoard;
    });

    // 6. Resposta inteligente
    const total = filteredTickTasks.length + filteredTrello.length;
    let resposta = `\nVocê tem ${total} tarefas filtradas:\n\n`;

    if (filteredTrello.length > 0) {
      resposta += "🟦 **Trello**\n";
      filteredTrello.forEach((t) => {
        resposta += `- ${t.name} (${t.listName})\n`;
      });
    }

    if (filteredTickTasks.length > 0) {
      resposta += "\n🟨 **TickTick**\n";
      filteredTickTasks.forEach((t) => {
        resposta += `- ${t.title} (Prioridade ${t.priority})\n`;
      });
    }

    // 7. Análise rápida
    if (total === 0) {
      resposta += "\n✅ Nenhuma atividade urgente encontrada.";
    } else if (total > 6) {
      resposta += "\n⚠️ Você está sobrecarregado. Considere delegar ou adiar.";
    } else {
      resposta += "\n🧠 Recomendo começar pelas tarefas de maior impacto.";
    }

    return res.status(200).send({ summary: resposta.trim(), trello: filteredTrello, ticktick: filteredTickTasks });
  } catch (error) {
    console.error("Erro na análise:", error);
    return res.status(500).send({ error: "Falha ao analisar tarefas." });
  }
};
