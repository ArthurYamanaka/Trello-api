const axios = require('axios');

const sessionToken = 'SEU_TOKEN_AQUI'; // seu token t=...
const headers = {
  "Content-Type": "application/json",
  "Cookie": `t=${sessionToken}`,
  "x-device": '{"platform":"web","os":"Windows","device":"Chrome","name":"","version":6250,"id":"api","channel":"website"}'
};

module.exports = async (req, res) => {
  try {
    const response = await axios.get('https://api.ticktick.com/api/v2/batch/check/0', { headers });
    const allTasks = response.data.syncTaskBean.update;

    const tarefas = allTasks
      .filter(t => !t.deleted && t.status === 0 && t.dueDate) // apenas ativas e com data
      .map(t => ({
        title: t.title,
        priority: t.priority,
        dueDate: t.dueDate,
        projectId: t.projectId,
        parentId: t.parentId || null,
        items: t.items || []
      }));

    res.status(200).json({ tarefas });
  } catch (error) {
    console.error("Erro ao obter tarefas:", error.response?.data || error);
    res.status(500).json({ erro: "Erro ao buscar tarefas" });
  }
};
