export default async function handler(req, res) {
  const pathArray = req.query.path || [];
  const query = req.url.split("?")[1] || "";
  const BACKEND = process.env.BACKEND_URL; // Vercel 환경변수에 설정

  const target = `${BACKEND}/${pathArray.join("/")}${query ? `?${query}` : ""}`;

  const headers = { ...req.headers };
  delete headers.host;

  const fetchOptions = {
    method: req.method,
    headers,
    body: ["GET", "HEAD"].includes(req.method)
      ? undefined
      : JSON.stringify(req.body),
  };

  try {
    const response = await fetch(target, fetchOptions);
    res.status(response.status);
    response.headers.forEach((v, k) => {
      if (!["transfer-encoding", "connection"].includes(k)) res.setHeader(k, v);
    });
    const buf = Buffer.from(await response.arrayBuffer());
    res.send(buf);
  } catch (err) {
    res.status(502).json({ error: "Bad Gateway", details: err.message });
  }
}
