export default async function handler(req, res) {
  // catch-all: req.query.path 는 배열
  const pathArray = req.query.path || [];
  const BACKEND = process.env.BACKEND_URL;

  if (!BACKEND) {
    return res.status(500).json({ error: "BACKEND_URL not configured" });
  }

  // 원본 요청 URL에서 쿼리 스트링 추출
  const queryString = req.url.split("?")[1] || "";
  const target = `${BACKEND}/${pathArray.join("/")}${
    queryString ? `?${queryString}` : ""
  }`;

  console.log(`[Proxy] ${req.method} ${target}`);

  const headers = { ...req.headers };
  delete headers.host;
  delete headers["x-forwarded-host"];

  const fetchOptions = {
    method: req.method,
    headers,
    body: ["GET", "HEAD"].includes(req.method)
      ? undefined
      : typeof req.body === "string"
      ? req.body
      : JSON.stringify(req.body),
    redirect: "follow",
  };

  try {
    const response = await fetch(target, fetchOptions);
    res.status(response.status);

    // 응답 헤더 전달
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
