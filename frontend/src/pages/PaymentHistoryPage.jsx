import React, { useEffect, useState } from 'react';
import PaymentApi from '../services/PaymentApi'; 

const PaymentHistoryPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await PaymentApi.getMyPayments();
        setPayments(response.data);
      } catch (err) {
        console.error("결제 내역 조회 실패:", err);
        setError("결제 내역을 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return <div className="text-center p-10">결제 내역 로딩 중...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-600">{error}</div>;
  }

  return (
    <div className="payment-history bg-white p-6 rounded-2xl shadow border">
      <h2 className="text-2xl font-extrabold text-gray-900 mb-6">💳 나의 결제 내역</h2>

      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">승인일시</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">상품명</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">주문번호</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">결제금액</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">영수증</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  결제 내역이 없습니다.
                </td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr key={payment.orderId} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {payment.approvedAt ? new Date(payment.approvedAt).toLocaleString('ko-KR') : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{payment.orderName}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{payment.orderId}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{payment.amount.toLocaleString()}원</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      payment.status === 'DONE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {payment.status === 'DONE' ? '결제완료' : payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {payment.receiptUrl ? (
                      <a 
                        href={payment.receiptUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        보기
                      </a>
                    ) : '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistoryPage;