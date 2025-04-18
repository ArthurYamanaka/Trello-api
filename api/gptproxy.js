export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const proxyRes = await fetch(`${process.env.BASE_URL}/api/createCard`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req.body),
  });

  const data = await proxyRes.json();
  res.status(200).json(data);
}
