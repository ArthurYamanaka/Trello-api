const axios = require('axios');

const sessionToken = process.env.TICKTICK_TOKEN;

const headers = {
  "Content-Type": "application/json",
  "Cookie": `t=${sessionToken}`,
  "x-device": '{"platform":"web","os":"Windows","device":"Chrome","name":"","version":6250,"id":"api","channel":"website"}'
};

module.exports = async (req, res) => {
  const tarefa = {
    title: "Tarefa com subtasks internas",
    priority: 3,
    dueDate: new Date(Date.now() + 86400000).toISOString()
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

    const id2etag = response.data.id2etag;
    const parentId = Object.keys(id2etag)[0];

    // Subtasks
    const subtasks = [
      { title: "Subtarefa 1", priority: 1 },
      { title: "Subtarefa 2", priority: 2 },
      { title: "Subtarefa 3", priority: 3 }
    ];

    const subtaskPayload = subtasks.map(({ title, priority }) => ({
      title,
      priority,
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

    // Vincular subtasks ao parent
    const projectId = "inbox126993382"; // ou substitua se for diferente

    const vincularPayload = subtaskIds.map(taskId => ({
      taskId,
      parentId,
      projectId
    }));

    await axios.post('https://api.ticktick.com/api/v2/batch/taskParent', vincularPayload, { headers });

    res.status(200).json({ message: "Tarefa e subtasks criadas com sucesso!", parentId, subtaskIds });
  } catch (error) {
    console.error("Erro:", error.response?.data || error.message);
    res.status(500).json({ error: "Erro ao criar tarefas", details: error.response?.data || error.message });
  }
};
