import { useParams } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import { useEffect, useRef, useState } from "react";
import PaymentApi from "../services/PaymentApi";
import { loadPaymentWidget } from "@tosspayments/payment-widget-sdk";

const CheckoutPage = () => {
//   const navigate = useNavigate();
  const { productId } = useParams(); // URL로부터 productId 가져오기
  const { user } = useAuthStore(); // 현재 로그인한 사용자

  // Toss 위젯 관련 state
  const paymentWidgetRef = useRef(null);
  const paymentMethodsWidgetRef = useRef(null);

  // 결제 정보 state
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1. 컴포넌트 마운트 시, 백엔드에 결제 준비 요청
    const fetchPaymentInfo = async () => {
      try {
        // API 1: 결제 준비 호출
        const response = await PaymentApi.preparePayment(productId);
        const data = response.data; // { orderId, orderName, amount, clientKey }

        setPaymentInfo(data);

        // 2. Toss 위젯 SDK 로드
        const paymentWidget = await loadPaymentWidget(
          data.clientKey,
          "@ANONYMOUS"
        ); // 비회원 익명

        // 3. 위젯 렌더링
        const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
          "#payment-widget",
          { value: data.amount }, // 'value'로 금액 전달
          { variantKey: "DEFAULT" }
        );

        paymentWidget.renderAgreement("#agreement-widget", {
          variantKey: "DEFAULT",
        });

        paymentWidgetRef.current = paymentWidget;
        paymentMethodsWidgetRef.current = paymentMethodsWidget;
        setLoading(false);
      } catch (err) {
        console.error("결제 준비 실패:", err);
        setError("결제 정보를 불러오는 데 실패했습니다.");
        setLoading(false);
      }
    };

    fetchPaymentInfo();
  }, [productId]);

  // "결제하기" 버튼 클릭 시
  const handlePaymentRequest = async () => {
    if (!paymentWidgetRef.current || !paymentInfo || !user) {
      alert("결제 정보가 로드되지 않았거나 로그인 상태가 아닙니다.");
      return;
    }

    try {
      // 4. Toss 결제 요청 (Toss 결제창 띄우기)
      await paymentWidgetRef.current.requestPayment({
        orderId: paymentInfo.orderId,
        orderName: paymentInfo.orderName,
        successUrl: `${window.location.origin}/payment/success`, // 성공 시 리디렉션 URL
        failUrl: `${window.location.origin}/payment/fail`, // 실패 시 리디렉션 URL
        customerName: user.username, // 사용자 이름
        customerEmail: user.email, // 사용자 이메일
      });
    } catch (err) {
      console.error("결제 요청 실패:", err);
      setError("결제 요청에 실패했습니다.");
    }
  };

  if (loading)
    return (
      <div className="bg-white p-6 rounded-2xl shadow border text-center">
        <p className="text-lg font-medium text-gray-700">
          결제 정보를 불러오는 중...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="bg-white p-6 rounded-2xl shadow border text-center">
        <p className="text-lg font-medium text-red-600">{error}</p>
      </div>
    );

  return (
    <div className="checkout-page bg-white p-8 rounded-2xl shadow-lg border max-w-2xl mx-auto">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6 pb-4 border-b">
        결제하기
      </h2>

      {paymentInfo && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
          <p className="text-sm text-gray-600">
            <strong>상품명:</strong> {paymentInfo.orderName}
          </p>
          <p className="text-sm text-gray-600">
            <strong>주문번호:</strong> {paymentInfo.orderId}
          </p>
          <p className="text-xl font-bold text-gray-900 mt-2">
            <strong>결제 금액:</strong> {paymentInfo.amount.toLocaleString()}원
          </p>
        </div>
      )}

      {/* Toss 결제 위젯이 렌더링될 DOM */}
      <div id="payment-widget" className="w-full mb-4" />
      <div id="agreement-widget" className="w-full mb-4" />

      <button
        onClick={handlePaymentRequest}
        disabled={loading}
        className="w-full mt-2 px-4 py-3 rounded-lg text-lg font-semibold transition text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
      >
        {paymentInfo
          ? `${paymentInfo.amount.toLocaleString()}원 결제하기`
          : "결제하기"}
      </button>
    </div>
  );
};

export default CheckoutPage;
