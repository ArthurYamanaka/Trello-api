import axios from 'axios';

const sessionToken = 'SEU_TOKEN_AQUI'; // coloque seu token
const headers = {
  "Content-Type": "application/json",
  "Cookie": `t=${sessionToken}`,
  "x-device": '{"platform":"web","os":"Windows","device":"Chrome","name":"","version":6250,"id":"api","channel":"website"}'
};

export default async function handler(req, res) {
  try {
    const response = await axios.get('https://api.ticktick.com/api/v2/batch/check/0', { headers });
    const allTasks = response.data.syncTaskBean.update;

    const tarefas = allTasks
      .filter(t => !t.deleted && t.status === 0 && t.dueDate) // ativas e com data
      .map(t => ({
        title: t.title,
        dueDate: t.dueDate,
        priority: t.priority,
        projectId: t.projectId,
      }));

    res.status(200).json(tarefas);
  } catch (error) {
    console.error("Erro ao obter tarefas:", error.response?.data || error.message);
    res.status(500).json({ error: "Erro ao buscar tarefas" });
  }
}
