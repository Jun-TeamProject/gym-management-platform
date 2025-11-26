import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AdminApi } from "../services/AdminApi";

const UserPaymentDetailPage = () => {
  const { userId } = useParams();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await AdminApi.getUserPaymentDetail(userId);
      setDetail(res.data);
      setError(null);
    } catch (err) {
      console.error("유저 결제/이용권 상세 조회 실패:", err);
      setError("해당 사용자의 정보를 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [userId]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!detail) return <div>데이터가 없습니다.</div>;

  const { username, email, role, activeMemberships, payments } = detail;

  const totalAmount = (payments ?? []).reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="bg-white p-6 rounded-2xl shadow border space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold text-gray-900">
          사용자 상세 정보 (ID: {detail.userId})
        </h2>
        <Link
          to="/admin/users"
          className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200"
        >
          ← 사용자 목록으로
        </Link>
      </div>

      {/* 1. 사용자 기본 정보 카드 */}
      <section className="p-4 border rounded-xl bg-gray-50">
        <h3 className="text-lg font-bold mb-2">👤 기본 정보</h3>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
          <div>
            <dt className="text-gray-500">이름(닉네임)</dt>
            <dd className="font-medium text-gray-900">{username}</dd>
          </div>
          <div>
            <dt className="text-gray-500">이메일</dt>
            <dd className="font-medium text-gray-900">{email}</dd>
          </div>
          <div>
            <dt className="text-gray-500">역할</dt>
            <dd className="font-medium text-gray-900">{role}</dd>
          </div>
        </dl>
      </section>

      {/* 2. 현재 진행중인 이용권 정보 */}
      <section className="p-4 border rounded-xl bg-gray-50">
        <h3 className="text-lg font-bold mb-2">🏋️ 현재 진행중인 이용권</h3>
        {activeMemberships && activeMemberships.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border bg-white">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    상품명
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    유형
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    시작일
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    종료일
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    남은 PT 횟수
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    상태
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {activeMemberships.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{m.productName}</td>
                    <td className="px-4 py-2">{m.productType}</td>
                    <td className="px-4 py-2">{m.startDate}</td>
                    <td className="px-4 py-2">{m.endDate}</td>
                    <td className="px-4 py-2">{m.ptCountRemaining}</td>
                    <td className="px-4 py-2">{m.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            현재 진행중인 이용권이 없습니다.
          </p>
        )}
      </section>

      {/* 3. 결제 내역 */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">💳 결제 내역</h3>
          <span className="text-sm text-gray-600">
            총 결제액:{" "}
            <span className="font-semibold text-blue-600">
              {totalAmount.toLocaleString()}원
            </span>
          </span>
        </div>

        <div className="overflow-x-auto rounded-lg border bg-white">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  승인일시
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  상품명
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  주문번호
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  결제금액
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  상태
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(!payments || payments.length === 0) ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-4 py-4 text-center text-gray-500"
                  >
                    결제 내역이 없습니다.
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.orderId} className="hover:bg-gray-50">
                    <td className="px-4 py-2">
                      {p.approvedAt
                        ? new Date(p.approvedAt).toLocaleString("ko-KR")
                        : "-"}
                    </td>
                    <td className="px-4 py-2 font-medium">{p.orderName}</td>
                    <td className="px-4 py-2">{p.orderId}</td>
                    <td className="px-4 py-2 font-semibold">
                      {p.amount.toLocaleString()}원
                    </td>
                    <td className="px-4 py-2">{p.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default UserPaymentDetailPage;
