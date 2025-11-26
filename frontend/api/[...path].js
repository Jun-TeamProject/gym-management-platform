// pages/api/[...path].js (임시 수정)
export default function handler(req, res) {
  console.log("FUNCTION REACHED: Test POST request received.");

  // 프록시 로직 대신 즉시 200 응답 반환
  // 이 테스트 코드로 403이 발생하면 Vercel 방화벽 문제입니다.
  // 이 테스트 코드로 200이 뜨면 기존 프록시 로직에 문제가 있습니다.
  res.status(200).json({ message: "Test success before proxy" });
}
