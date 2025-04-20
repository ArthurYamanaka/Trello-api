const axios = require('axios');

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const sessionToken = process.env.TICKTICK_TOKEN;

  const headers = {
    "Content-Type": "application/json",
    "Cookie": `t=${sessionToken}`,
    "x-device": '{"platform":"web","os":"Windows","device":"Chrome","name":"","version":6250,"id":"api","channel":"website"}'
  };

  try {
    const response = await axios.get('https://api.ticktick.com/api/v2/batch/check/0', { headers });
    const allTasks = response.data.syncTaskBean.update;

    const tarefas = allTasks
      .filter(t => !t.deleted && t.status === 0 && t.dueDate)
      .map(t => ({
        title: t.title,
        dueDate: t.dueDate,
        priority: t.priority,
        projectId: t.projectId
      }));

    res.status(200).json(tarefas);
  } catch (error) {
    console.error("Erro ao buscar tarefas:", error.response?.data || error);
    res.status(500).json({ error: "Erro ao buscar tarefas" });
  }
};
