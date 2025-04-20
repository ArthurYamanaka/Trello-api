const axios = require('axios');

const sessionToken = 'SEU_TOKEN_AQUI'; // Substitua por variável de ambiente depois

const headers = {
  "Content-Type": "application/json",
  "Cookie": `t=${sessionToken}`,
  "x-device": '{"platform":"web","os":"Windows","device":"Chrome","name":"","version":6250,"id":"api","channel":"website"}'
};

const criarTarefaPrincipal = async () => {
  const tarefa = {
    title: "Tarefa com subtasks internas",
    priority: 3,
    dueDate: new Date(Date.now() + 86400000).toISOString()
  };

  const response = await axios.post('https://api.ticktick.com/api/v2/batch/task', {
    add: [tarefa],
    update: [],
    delete: [],
    addAttachments: [],
    updateAttachments: [],
    deleteAttachments: []
  }, { headers });

  const tarefaCriada = response.data.id2etag;
  return Object.keys(tarefaCriada)[0];
};

const criarSubtasks = async (parentId, subtasks) => {
  const tasks = subtasks.map(({ title, priority }) => ({
    title,
    parentId,
    priority
  }));

  const response = await axios.post('https://api.ticktick.com/api/v2/batch/task', {
    add: tasks,
    update: [],
    delete: [],
    addAttachments: [],
    updateAttachments: [],
    deleteAttachments: []
  }, { headers });

  return Object.keys(response.data.id2etag);
};

const vincularSubtasks = async (parentId, projectId, subtasksIds) => {
  const payload = subtasksIds.map(taskId => ({
    taskId,
    parentId,
    projectId
  }));

  await axios.post('https://api.ticktick.com/api/v2/batch/taskParent', payload, { headers });
};

// ESTE BLOCO FINAL É O MAIS IMPORTANTE PARA FUNCIONAR NA VERCEL
module.exports = async (req, res) => {
  try {
    const parentId = await criarTarefaPrincipal();

    if (!parentId) {
      return res.status(500).json({ error: 'Erro ao criar tarefa principal' });
    }

    const subtasks = [
      { title: "Comprar coca", priority: 1 },
      { title: "Pegar cerveja", priority: 2 },
      { title: "Levar corona", priority: 3 }
    ];

    const subtaskIds = await criarSubtasks(parentId, subtasks);
    await vincularSubtasks(parentId, 'inbox126993382', subtaskIds);

    return res.status(200).json({
      message: "Tarefa criada com subtasks vinculadas",
      parentId,
      subtaskIds
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro geral', detalhes: error.message });
  }
};
