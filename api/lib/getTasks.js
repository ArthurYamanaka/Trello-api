const axios = require('axios');

const getTasks = async () => {
  const sessionToken = process.env.TICKTICK_TOKEN;

  const headers = {
    "Content-Type": "application/json",
    "Cookie": `t=${sessionToken}`,
    "x-device": '{"platform":"web","os":"Windows","device":"Chrome","name":"","version":6250,"id":"api","channel":"website"}'
  };

  const response = await axios.get('https://api.ticktick.com/api/v2/batch/check/0', { headers });
  const allTasks = response.data.syncTaskBean.update;

  return allTasks
    .filter(t => !t.deleted && t.status === 0 && t.dueDate)
    .map(t => ({
      title: t.title,
      dueDate: t.dueDate,
      priority: t.priority,
      projectId: t.projectId
    }));
};

module.exports = getTasks;
