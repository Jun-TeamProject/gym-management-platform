import api from "./api";

const PaymentApi = {
  // API 1: 결제 준비
  preparePayment: async (productId) => {
    // 벡엔드 POST /api/payments/prepare 호출
    return api.post("/api/payments/prepare", { productId });
  },

  //API 2: 결제 승인
  confirmPayment: async (paymentData) => {
    // 벡엔드 POST /api/payments/confirm 호출
    return api.post("/api/payments/confirm", paymentData);
  },
};

export default PaymentApi;
