import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import PaymentApi from "../services/PaymentApi";

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("결제 승인 중입니다..");

  //중복 실행 방지 Ref
  const isConfirmedRef = useRef(false);

  useEffect(() => {
    //중복 승인 방지
    if (isConfirmedRef.current) return;
    isConfirmedRef.current = true;

    // 1. URL 쿼리 파라미터에서 Toss가 전달 한 값 추출
    const paymentKey = searchParams.get("paymentKey");
    const orderId = searchParams.get("orderId");
    const amount = parseInt(searchParams.get("amount"), 10);

    if (!paymentKey || !orderId || !amount) {
      setMessage("잘못된 접근 입니다. 결제정보가 누락되었습니다.");
      return;
    }

    // 2. 백엔드에 결제 승인  API 호출
    const confirm = async () => {
      try {
        // API 2: 결제 승인 호출
        const response = await PaymentApi.confirmPayment({
          paymentKey,
          orderId,
          amount,
        });

        // 3. 성공처리
        setMessage(
          `결제가 성공적으로 완료되었습니다! (주문번호: ${response.data.orderId}) 회원권이 정상 결제되었습니다.`
        );
      } catch (err) {
        console.error("결제 승인 실패: ", err);
        setMessage(
          `결제 승인에 실패했습니다: ${
            err.response?.data?.message || err.message
          }`
        );
      }
    };

    confirm();
  }, [searchParams]);

  return (
    <div className="payment-result-page">
      <h2> 결제 결과</h2>
      <p>{message}</p>
      <Link to="/myprofile">내 정보로 이동 (맴버쉽 확인)</Link>
    </div>
  );
};

export default PaymentSuccessPage;
