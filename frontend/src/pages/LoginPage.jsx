import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";

function LockIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 1a5 5 0 00-5 5v3H6a2 2 0 00-2 2v9a2 2 0 002 2h12a2 2 0 002-2v-9a2 2 0 00-2-2h-1V6a5 5 0 00-5-5zm3 8H9V6a3 3 0 116 0v3z" />
    </svg>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loading, error } = useAuthStore();

  const [formData, setFormData] = useState({ loginId: "", password: "" });

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const ok = await login(formData);
      if (ok !== false) {
        navigate("/");
      }
    } catch (err) {
      console.error("login error caught in LoginPage:", err);
    }
  };
  const handleSocialLogin = (provider) => {
    window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900">로그인</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border p-6">
          <p className="text-lg font-semibold text-gray-700 text-center mb-6">
            Gym Projector
            <br className="hidden sm:block" />
          </p>

          {error ? (
            <div className="mb-4 rounded-lg bg-red-50 text-red-700 text-sm px-3 py-2 border border-red-100">
              {String(error)}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이메일 or username
              </label>
              <input
                type="text"
                name="loginId"
                value={formData.loginId}
                onChange={handleChange}
                placeholder="enter your email or username"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
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
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />

              <div className="flex justify-end mt-1">
                <Link
                  to="/forgot-password"
                  className="text-xs text-gray-500 hover:text-blue-600 hover:underline"
                >
                  비밀번호를 잊으셨나요?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold py-3 transition"
            >
              {loading ? "로그인 중..." : "로그인"}
            </button>
          </form>
          <div>
            <button onClick={() => handleSocialLogin("google")} className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold py-3 transition mt-1">
              <div>
                구글로 로그인
              </div>
            </button>
          </div>
          <div className="my-6 h-px bg-gray-100" />

          <div className="flex items-center justify-between text-sm">
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-900 underline-offset-2 hover:underline"
            >
              홈으로
            </Link>
            <div className="flex items-center gap-3">
              <Link
                to="/register"
                className="text-blue-700 hover:text-blue-900 underline-offset-2 hover:underline"
              >
                회원가입
              </Link>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-4">
          계정이 없으신가요?{" "}
          <Link to="/register" className="text-blue-700 hover:text-blue-900 underline-offset-2 hover:underline">
            지금 가입하기
          </Link>
        </p>
      </div>
    </div>
  );
}
