export default async function handler(req, res) {
  const BACKEND = process.env.BACKEND_URL;
  if (!BACKEND)
    return res.status(500).json({ error: "BACKEND_URL not configured" });

  // query string (전체)
  const queryString = req.url.split("?")[1] || "";

  // 안전하게 path 추출: /api/ 뒤를 그대로 backend로 전달
  // 예: req.url = '/api/branches?page=1' -> pathOnly = 'branches'
  let pathOnly = req.url.replace(/^\/api\/?/, "").split("?")[0];
  // strip any leading slash
  pathOnly = pathOnly.replace(/^\/+/, "");

  const target = `${BACKEND}/${pathOnly}${
    queryString ? `?${queryString}` : ""
  }`;

  console.log(`[Proxy] ${req.method} -> ${target}`);
  // 로깅: 요청 헤더(디버그용; 토큰 노출 주의)
  console.log("[Proxy] Incoming headers:", req.headers);

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

    // SSE/streaming 처리 필요시 별도 분기(생략)
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
