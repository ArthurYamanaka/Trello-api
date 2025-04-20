const axios = require('axios');

const sessionToken = process.env.TICKTICK_TOKEN;

const headers = {
  "Content-Type": "application/json",
  "Cookie": `t=${sessionToken}`,
  "x-device": '{"platform":"web","os":"Windows","device":"Chrome","name":"","version":6250,"id":"api","channel":"website"}'
};

const criarTarefaPrincipal = async () => {
  const tarefa = {
    title: "Tarefa com subtasks internas",
    priority: 3, // Alta prioridade
    dueDate: new Date(Date.now() + 86400000).toISOString() // Amanhã
  };

  try {
    const response = await axios.post('https://api.ticktick.com/api/v2/batch/task', {
      add: [tarefa],
      update: [],
      delete: [],
      addAttachments: [],
      updateAttachments: [],
      deleteAttachments: []
    }, { headers });

    const tarefaCriada = response.data.id2etag;
    const parentId = Object.keys(tarefaCriada)[0];

    console.log("Tarefa principal criada com sucesso:", parentId);
    return parentId;
  } catch (error) {
    console.error("Erro ao criar tarefa principal:", error.response?.data || error);
    return null;
  }
};

const criarSubtasks = async (parentId, subtasks) => {
  const tasks = subtasks.map(({ title, priority }) => ({
    title,
    parentId,
    priority
  }));

  try {
    const response = await axios.post('https://api.ticktick.com/api/v2/batch/task', {
      add: tasks,
      update: [],
      delete: [],
      addAttachments: [],
      updateAttachments: [],
      deleteAttachments: []
    }, { headers });

    const ids = Object.keys(response.data.id2etag);
    console.log("Subtasks criadas com sucesso:", ids);
    return ids;
  } catch (error) {
    console.error("Erro ao criar subtasks:", error.response?.data || error);
    return [];
  }
};

const vincularSubtasks = async (parentId, projectId, subtasksIds) => {
  const payload = subtasksIds.map(taskId => ({
    taskId,
    parentId,
    projectId
  }));

  try {
    await axios.post('https://api.ticktick.com/api/v2/batch/taskParent', payload, { headers });
    console.log("Subtasks vinculadas corretamente à task principal.");
  } catch (error) {
    console.error("Erro ao vincular subtasks:", error.response?.data || error);
  }
};

module.exports = async (req, res) => {
  const parentId = await criarTarefaPrincipal();

  if (parentId) {
    const subtasks = [
      { title: "Comprar coca", priority: 1 },
      { title: "Pegar cerveja", priority: 2 },
      { title: "Levar corona", priority: 3 }
    ];

    const subtaskIds = await criarSubtasks(parentId, subtasks);
    await vincularSubtasks(parentId, 'inbox126993382', subtaskIds);
    res.status(200).json({ message: "Tarefa com subtasks criada com sucesso." });
  } else {
    res.status(500).json({ error: "Erro ao criar tarefa principal." });
  }
};
