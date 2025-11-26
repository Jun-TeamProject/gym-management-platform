export default async function handler(req, res) {
  const BACKEND = process.env.BACKEND_URL;
  if (!BACKEND) {
    return res.status(500).json({ error: "BACKEND_URL not configured" });
  }

  // req.url 예: '/api/branches?page=1' 또는 '/api/auth/login'
  const [pathWithApi, queryString] = req.url.split("?");

  // '/api/' 제거하고 백엔드에 전달
  // const pathOnly = pathWithApi.replace(/^\/api\/?/, "");
  const pathOnly = pathWithApi;

  const target = `${BACKEND}/${pathOnly}${
    queryString ? `?${queryString}` : ""
  }`;

  console.log(`[Proxy] ${req.method} -> ${target}`);
  console.log(`[Proxy] Authorization: ${req.headers.authorization || "NONE"}`);

  const headers = { ...req.headers };
  delete headers.host;
  delete headers["x-forwarded-host"];
  delete headers["x-forwarded-proto"];

  // 바디 준비
  let body = undefined;
  if (!["GET", "HEAD"].includes(req.method)) {
    if (typeof req.body === "string") {
      body = req.body;
    } else if (req.body && typeof req.body === "object") {
      body = JSON.stringify(req.body);
      headers["content-type"] = headers["content-type"] || "application/json";
    }
  }

  const fetchOptions = {
    method: req.method,
    headers,
    body,
    redirect: "follow",
  };

  try {
    const response = await fetch(target, fetchOptions);
    console.log(`[Proxy] Response status: ${response.status}`);
    res.status(response.status);

    response.headers.forEach((v, k) => {
      if (
        !["transfer-encoding", "connection", "content-encoding"].includes(k)
      ) {
        res.setHeader(k, v);
      }
    });

    const buf = Buffer.from(await response.arrayBuffer());
    res.send(buf);
  } catch (err) {
    console.error("[Proxy Error]", err);
    res.status(502).json({ error: "Bad Gateway", details: err?.message });
  }
}
