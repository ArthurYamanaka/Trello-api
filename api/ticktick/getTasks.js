const axios = require('axios');

const sessionToken = '154BB8FE914467833344C66821ABCBD0916CEDEA65DDC12DD668166DD29E1D1354DDA0DF15636D00119801F4D87D7BFAC9962465C8A1A5CF1CA5A43983C43F096EF38D9D95F6FCF3F4CA2CEC9F2DE05AF336BE3358DCA9E1737B9EDFA8624DEE82BEE463B1431075BC4DD36207DCA5A8F336BE3358DCA9E1D64E2D2CD19AF6022BB8BB67B572BDA342581C63FE29D8A4C095F6809D58690368144EDDDF7DE7A1E758EE688C2CE33E39311D05FCBE9955'; // substitua aqui
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
      .filter(t => !t.deleted && t.status === 0 && t.dueDate)
      .map(t => ({
        title: t.title,
        dueDate: t.dueDate,
        priority: t.priority
      }));

    res.status(200).json(tarefas);
  } catch (error) {
    console.error("Erro ao obter tarefas:", error.response?.data || error.message);
    res.status(500).json({ erro: "Falha ao obter tarefas", detalhe: error.message });
  }
}
