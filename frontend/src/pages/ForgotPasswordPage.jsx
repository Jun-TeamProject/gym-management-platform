import React, { useState } from "react";
import authService from "../services/auth";
import { Link } from "react-router-dom";

function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        try {
            const response = await authService.requestPasswordReset(email);
            setMessage(response);
        } catch (err) {
            const error = err.response?.data || "이메일 전송 중 오류가 발생했습니다.";
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="flex items-center justify-center gap-3 mb-6">
                    <h1 className="text-2xl font-extrabold text-gray-900">
                        비밀번호 재설정
                    </h1>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border p-6">
                    <p className="text-sm text-gray-600 text-center mb-6">
                        가입하신 이메일을 입력하시면<br />
                        비밀번호 재설정 링크를 보내드립니다.
                    </p>

                    {message && (
                        <div className="mb-4 rounded-lg bg-green-50 text-green-700 text-sm px-3 py-2 border border-green-100">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="mb-4 rounded-lg bg-red-50 text-red-700 text-sm px-3 py-2 border border-red-100">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                이메일
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="example.email.com"
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold py-3 transition"
                        >
                            {loading ? "전송 중..." : "재설정 링크 전송"}
                        </button>
                    </form>

                    <div className="my-6 h-px bg-gray-100" />

                    <div className="text-center text-sm">
                        <Link
                            to="/login"
                            className="text-gray-600 hover:text-gray-900 underline-offset-2 hover:underline"
                        >
                            로그인으로 돌아가기
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;