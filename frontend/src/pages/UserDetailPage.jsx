// src/pages/UserDetailPage.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminApi } from "../services/AdminApi";

const ProfileDetailView = ({ user }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border">
          {user.profileImageUrl ? (
            <img
              src={
                user.profileImageUrl.startsWith("http")
                  ? user.profileImageUrl
                  : `http://localhost:8080${user.profileImageUrl}`
              }
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              No Image
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500">
            이름
          </label>
          <p className="text-lg text-gray-900 p-2">
            {user.username || "미입력"}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500">
            이메일
          </label>
          <p className="text-lg text-gray-900 p-2">{user.email}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500">
            주소
          </label>
          <p className="text-lg text-gray-900 p-2">
            {user.fullName || "미입력"}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500">
            전화번호
          </label>
          <p className="text-lg text-gray-900 p-2">
            {user.phoneNumber || "미입력"}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500">
            생년월일
          </label>
          <p className="text-lg text-gray-900 p-2">
            {user.birthdate || "미입력"}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500">
            성별
          </label>
          <p className="text-lg text-gray-900 p-2">
            {user.gender || "미입력"}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500">
            지점
          </label>
          <p className="text-lg text-gray-900 p-2">
            {user.branchName || "미입력"}
          </p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-500">
          자기소개
        </label>
        <p className="text-lg text-gray-900 p-2 whitespace-pre-line">
          {user.bio || "내용없음"}
        </p>
      </div>
    </div>
  );
};

function UserDetailPage() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setErrorMsg(null);

        // 👇 유저 기본정보 + 결제 내역을 동시에 가져오기
        const [userRes, paymentRes] = await Promise.all([
          AdminApi.getUserById(userId),
          AdminApi.getUserPayments(userId),
        ]);

        setProfile(userRes.data);
        setPayments(paymentRes.data || []);
      } catch (err) {
        console.error("관리자 유저 상세 조회 실패:", err);
        setErrorMsg("사용자 정보 또는 결제 내역을 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleGoBack = () => {
    navigate(-1);
  };

  // 🔹 활성 이용권만 필터링 (profile.memberships 기준)
  const activeMemberships =
    profile?.memberships?.filter((m) => m.status === "ACTIVE") ?? [];

  return (
    <div className="bg-white w-full max-w-5xl mx-auto rounded-2xl shadow-md p-8">
      {/* 상단 타이틀 + 뒤로가기 */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          {profile ? `${profile.username} 님 상세 정보` : "사용자 상세"}
        </h1>

        <button
          className="px-5 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
          onClick={handleGoBack}
        >
          ← 돌아가기
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-600">불러오는 중입니다...</p>
      ) : errorMsg ? (
        <p className="text-center text-red-600">{errorMsg}</p>
      ) : profile ? (
        <div className="space-y-8">
          {/* 1) 기본 프로필 정보 */}
          <section className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              기본 정보
            </h3>
            <ProfileDetailView user={profile} />
          </section>

          {/* 2) 현재 활성 이용권 정보 */}
          <section className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              현재 활성 이용권
            </h3>

            {activeMemberships.length === 0 ? (
              <p className="text-gray-600 text-sm">
                활성 상태의 이용권이 없습니다.
              </p>
            ) : (
              <div className="overflow-x-auto rounded-lg border bg-white">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-500">
                        상품명
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-gray-500">
                        유형
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-gray-500">
                        시작일
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-gray-500">
                        종료일
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-gray-500">
                        남은 PT 횟수
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-gray-500">
                        상태
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {activeMemberships.map((m) => (
                      <tr key={m.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2">
                          {m.productName || "-"}
                        </td>
                        <td className="px-4 py-2">
                          {m.productType || "-"}
                        </td>
                        <td className="px-4 py-2">
                          {m.startDate || "-"}
                        </td>
                        <td className="px-4 py-2">
                          {m.endDate || "-"}
                        </td>
                        <td className="px-4 py-2 text-center">
                          {typeof m.ptCountRemaining === "number"
                            ? m.ptCountRemaining
                            : "-"}
                        </td>
                        <td className="px-4 py-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                            {m.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* 3) 결제 내역 */}
          <section className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              결제 내역
            </h3>

            {payments.length === 0 ? (
              <p className="text-gray-600 text-sm">
                결제 내역이 없습니다.
              </p>
            ) : (
              <div className="overflow-x-auto rounded-lg border bg-white">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-500">
                        승인 일시
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-gray-500">
                        상품명
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-gray-500">
                        주문번호
                      </th>
                      <th className="px-4 py-2 text-right font-medium text-gray-500">
                        금액
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-gray-500">
                        상태
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {payments.map((p) => (
                      <tr key={p.orderId} className="hover:bg-gray-50">
                        <td className="px-4 py-2">
                          {p.approvedAt
                            ? new Date(p.approvedAt).toLocaleString("ko-KR")
                            : "-"}
                        </td>
                        <td className="px-4 py-2">{p.orderName}</td>
                        <td className="px-4 py-2">{p.orderId}</td>
                        <td className="px-4 py-2 text-right">
                          {p.amount?.toLocaleString()}원
                        </td>
                        <td className="px-4 py-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      ) : (
        <p className="text-center text-red-600">
          사용자 정보를 찾을 수 없습니다.
        </p>
      )}
    </div>
  );
}

export default UserDetailPage;
