import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import { BranchApi } from "../services/BranchApi";

function UserPlusIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M15 12a5 5 0 1 0-6 0 9 9 0 0 0-6 8v2h18v-2a9 9 0 0 0-6-8zM9 7a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm11 5v3h2v2h-2v3h-2v-3h-2v-2h2v-3h2z" />
    </svg>
  );
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, loading, error } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    // phone: "",
    // role: "",
    branchId: "",
  });

  const [branches, setBranches] = useState([]);
  const [branchLoading, setBranchLoading] = useState(true);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await BranchApi.getAllBranches();
        setBranches(response.data);
      } catch (err) {
        console.error("지점 목록 조회 실패:", err);
        alert("지점 목록을 불러오는 데 실패했습니다.");
      } finally {
        setBranchLoading(false);
      }
    };
    fetchBranches();
  }, []);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.branchId) {
      alert("지점을 선택해주세요.");
      return;
    }

    try {
      await register(formData);
      alert("회원가입이 완료되었습니다!");
      navigate("/login");
    } catch (err) {
      console.error("Register error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900">회원가입</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border p-6">
          <p className="text-lg font-semibold text-gray-700 text-center mb-6">
            Gym Projector <br />
          </p>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 text-red-700 text-sm px-3 py-2 border border-red-100">
              {String(error)}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이메일
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@email.com"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                비밀번호
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="비밀번호 입력"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이름
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="홍길동"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                전화번호
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="010-1234-5678"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div> */}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  지점
                </label>
                <select
                  id="branch-select"
                  name="branchId"
                  value={formData.branchId}
                  onChange={handleChange}
                  required
                  disabled={branchLoading}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value=""> -- 지점 선택 -- </option>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.branchName}
                    </option>
                  ))}
                </select>
              </div>     
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  등급
                </label>
                <select
                  id="role-select"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="MEMBER">회원</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || branchLoading}
              className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "회원가입 중..." : "회원가입"}
            </button>
          </form>

          <div className="my-6 h-px bg-gray-100" />

          <div className="flex justify-between text-sm text-gray-600">
            <Link
              to="/"
              className="hover:text-gray-900 underline-offset-2 hover:underline"
            >
              홈으로
            </Link>
            <Link
              to="/login"
              className="text-blue-700 hover:text-blue-900 underline-offset-2 hover:underline"
            >
              로그인
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-4">
          이미 계정이 있으신가요?{" "}
          <Link
            to="/login"
            className="text-blue-700 hover:text-blue-900 underline-offset-2 hover:underline"
          >
            로그인하기
          </Link>
        </p>
      </div>
    </div>
  );
}
