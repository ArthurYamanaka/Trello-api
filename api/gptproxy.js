export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const proxyRes = await fetch(`${process.env.BASE_URL}/api/createCard`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const data = await proxyRes.json();

    if (!proxyRes.ok) {
      return res.status(proxyRes.status).json({ error: data.error || "Erro no Trello" });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: "Erro interno", details: err.message });
  }
}
