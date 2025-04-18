export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { title, dueDate, priority, tags } = req.body;

  if (!title) {
    return res.status(400).json({ error: "O título é obrigatório." });
  }

  return res.status(200).json({
    message: "Simulação de criação de tarefa no TickTick",
    data: { title, dueDate, priority, tags }
  });
}
