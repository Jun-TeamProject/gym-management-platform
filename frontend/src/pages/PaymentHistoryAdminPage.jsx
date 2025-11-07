import React, { useState, useEffect } from "react";
import { AdminApi } from "../services/AdminApi";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";

const buttonClass = "px-4 py-2 rounded-lg text-sm font-semibold transition";
const primaryButtonClass = `${buttonClass} text-white bg-blue-600 hover:bg-blue-700`;
const secondaryButtonClass = `${buttonClass} text-gray-700 bg-gray-100 hover:bg-gray-200`;

const PaymentHistoryAdminPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [period, setPeriod] = useState("WEEK"); // DAY, WEEK, MONTH
  const [viewMode, setViewMode] = useState("LIST"); // LIST, CALENDAR

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await AdminApi.getPaymentHistory(period);
      setPayments(response.data);
      setError(null);
    } catch (err) {
      console.error("결제 내역 조회 실패:", err);
      setError("결제 내역을 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [period]);

  const calendarEvents = payments.map((p) => ({
    id: p.orderId,
    title: `${p.orderName} (${p.amount.toLocaleString()}원)`,
    start: p.approvedAt,
    extendedProps: { ...p },
  }));

  const totalSales = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="payment-history-admin bg-white p-6 rounded-2xl shadow border space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h2 className="text-2xl font-extrabold text-gray-900">
          💳 전체 결제 / 매출 관리
        </h2>

        {/* ---  --- */}
        <div className="flex gap-2">
          <button
            onClick={() =>
              setViewMode(viewMode === "LIST" ? "CALENDAR" : "LIST")
            }
            className={secondaryButtonClass}
          >
            {viewMode === "LIST" ? "📋 목록 보기" : "📅 캘린더 보기"}
          </button>
        </div>
        <div>
          {["DAY", "WEEK", "MONTH"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={
                period === p ? primaryButtonClass : secondaryButtonClass
              }
            >
              {p === "DAY" ? "일별" : p === "WEEK" ? "주별" : "월별"}
            </button>
          ))}
        </div>
      </div>

      {/* ---  --- */}
      <div className="p-4 bg-gray-50 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-800">
          {period === "DAY" ? "일간" : period === "WEEK" ? "주간" : "월간"} 총
          매출 :
          <span className="text-blue-600 ml-2">
            {totalSales.toLocaleString()}원
          </span>
        </h3>
      </div>

      {loading && <p>로딩 중...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {/* ---  --- */}
      {viewMode === "LIST" ? (
        <PaymentTable payments={payments} />
      ) : (
        <FullCalendar
          plugins={[dayGridPlugin, listPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,listDay",
          }}
          events={calendarEvents}
          locale="ko"
          eventClick={(info) => {
            const props = info.event.extendedProps;
            alert(
              `[결제 상세]\n - 상품명: ${
                props.orderName
              }\n - 금액: ${props.amount.toLocaleString()}원\n - 주문번호: ${
                props.orderId
              }`
            );
          }}
        />
      )}
    </div>
  );
};

const PaymentTable = ({ payments }) => (
  <div className="overflow-x-auto rounded-lg border">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            승인일시
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            상품명
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            주문번호
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            결제금액
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {payments.length === 0 ? (
          <tr>
            <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
              결제 내역이 없습니다.
            </td>
          </tr>
        ) : (
          payments.map((p) => (
            <tr key={p.orderId} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm">
                {new Date(p.approvedAt).toLocaleString("ko-KR")}
              </td>
              <td className="px-6 py-4 text-sm font-medium">{p.orderName}</td>
              <td className="px-6 py-4 text-sm">{p.orderId}</td>
              <td className="px-6 py-4 text-sm font-semibold">
                {p.amount.toLocaleString()}원
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default PaymentHistoryAdminPage;
