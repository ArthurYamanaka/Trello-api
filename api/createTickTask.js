export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { title, dueDate, priority } = req.body;

  if (!title || !dueDate || !priority) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const response = await fetch("https://api.ticktick.com/open/v1/task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.TICKTICK_TOKEN}`,
      },
      body: JSON.stringify({
        title,
        dueDate,
        priority,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    return res.status(200).json({ success: true, task: data });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}
