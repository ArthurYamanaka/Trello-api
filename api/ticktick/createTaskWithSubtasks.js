const axios = require('axios');

const sessionToken = '154BB8FE914467833344C66821ABCBD0916CEDEA65DDC12DD668166DD29E1D1354DDA0DF15636D00119801F4D87D7BFAC9962465C8A1A5CF1CA5A43983C43F096EF38D9D95F6FCF3F4CA2CEC9F2DE05AF336BE3358DCA9E1737B9EDFA8624DEE82BEE463B1431075BC4DD36207DCA5A8F336BE3358DCA9E1D64E2D2CD19AF6022BB8BB67B572BDA342581C63FE29D8A4C095F6809D58690368144EDDDF7DE7A1E758EE688C2CE33E39311D05FCBE9955'; // substitua se ainda não estiver no ambiente seguro

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
  const parentId = Object.keys(tarefaCriada)[0];

  return parentId;
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
