import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import PaymentApi from "../services/PaymentApi";

const PaymentSuccessPage = () => {
  //   const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("결제 승인 중입니다..");
  const [isSuccess, setIsSuccess] = useState(null);

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
        setIsSuccess(true);
      } catch (err) {
        console.error("결제 승인 실패: ", err);
        setMessage(
          `결제 승인에 실패했습니다: ${
            err.response?.data?.message || err.message
          }`
        );
        setIsSuccess(false);
      } 
    };

    confirm();
  }, [searchParams]);

  const renderIcon = () => {
    if (isSuccess === true) {
      return <div className="text-6xl mb-4">☑️</div>;
    }
    if (isSuccess === false) {
      return <div className="text-6xl mb-4">✖️</div>;
    }
    return <div className="text-6xl mb-4 animate-spin">⌛</div>;
  };
  const renderTitle = () => {
    if (isSuccess === true) {
      return "결제 완료";
    }
    if (isSuccess === false) {
      return "결제 승인 실패";
    }
    return "결제 승인 중";
  };
  return (
    <div className="payment-result-page bg-white p-8 rounded-2xl shadow-lg border max-w-2xl mx-auto text-center">
      {renderIcon()}
      <h2
        className={`text-2xl font-extrabold ${
          isSuccess === true ? "text-gray-900" : ""
        } ${isSuccess === false ? "text-red-600" : ""} ${
          isSuccess === null ? "text-blue-600" : ""
        } mb-4`}
      >
        {renderTitle()}
      </h2>

      <p className="text-lg text-gray-700 mb-8">{message}</p>

      {isSuccess !== null && (
        <Link
          to={isSuccess ? "/myprofile" : "/products"}
          className="w-full mt-4 px-6 py3 rounded-lg text-lg font-semibold transition text-white bg-blue-600 hover:bg-blue-700"
        >
          {isSuccess ? "내 정보로 이동" : "상품 목록으로 돌아가기"}
        </Link>
      )}
    </div>
  );
};

export default PaymentSuccessPage;
