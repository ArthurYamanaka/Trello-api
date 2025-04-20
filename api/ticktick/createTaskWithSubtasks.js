const axios = require('axios');

const sessionToken = process.env.TICKTICK_TOKEN;

const headers = {
  "Content-Type": "application/json",
  "Cookie": `t=${sessionToken}`,
  "x-device": '{"platform":"web","os":"Windows","device":"Chrome","name":"","version":6250,"id":"api","channel":"website"}'
};

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { title, priority = 3, dueDate, subtasks = [] } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'O campo "title" é obrigatório' });
  }

  const tarefa = {
    title,
    priority,
    dueDate: dueDate || new Date(Date.now() + 86400000).toISOString()
  };

  try {
    // Cria tarefa principal
    const response = await axios.post('https://api.ticktick.com/api/v2/batch/task', {
      add: [tarefa],
      update: [],
      delete: [],
      addAttachments: [],
      updateAttachments: [],
      deleteAttachments: []
    }, { headers });

    const id2etag = response.data.id2etag;
    const parentId = Object.keys(id2etag)[0];

    // Se não houver subtarefas, retorna só a principal
    if (!subtasks.length) {
      return res.status(200).json({ message: "Tarefa criada sem subtarefas.", parentId });
    }

    // Subtasks (recebidas no body)
    const subtaskPayload = subtasks.map(({ title: subTitle, priority: subPriority = priority }) => ({
      title: subTitle,
      priority: subPriority,
      parentId
    }));

    const subtaskResp = await axios.post('https://api.ticktick.com/api/v2/batch/task', {
      add: subtaskPayload,
      update: [],
      delete: [],
      addAttachments: [],
      updateAttachments: [],
      deleteAttachments: []
    }, { headers });

    const subtaskIds = Object.keys(subtaskResp.data.id2etag);

    const projectId = "inbox126993382"; // ✅ substitua aqui se quiser enviar para outra pasta

    const vincularPayload = subtaskIds.map(taskId => ({
      taskId,
      parentId,
      projectId
    }));

    await axios.post('https://api.ticktick.com/api/v2/batch/taskParent', vincularPayload, { headers });

    res.status(200).json({
      message: "Tarefa com subtasks criadas com sucesso!",
      parentId,
      subtaskIds
    });
  } catch (error) {
    console.error("Erro:", error.response?.data || error.message);
    res.status(500).json({ error: "Erro ao criar tarefas", details: error.response?.data || error.message });
  }
};
