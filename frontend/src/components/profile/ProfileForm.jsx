import React, { useEffect, useState } from "react";
import profileService from "../../services/profileService";
import { useNavigate } from "react-router-dom";

export default function ProfileForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  }

  useEffect(() => {
    profileService
      .getMyProfile()
      .then((data) => setForm((prev) => ({ ...prev, ...data })))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await profileService.updateMyProfile(form);
      alert("저장되었습니다!");
    } catch (error) {
      alert("저장 실패: " + error.message);
    }
  };

  if (loading) return <p className="text-center">불러오는 중...</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-gray-700 font-medium mb-1">이름</label>
        <input
          name="name"
          value={form.name || ""}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          placeholder="홍길동"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-1">이메일</label>
        <input
          type="email"
          name="email"
          value={form.email || ""}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          placeholder="example@email.com"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-1">전화번호</label>
        <input
          name="phone"
          value={form.phone || ""}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          placeholder="010-1234-5678"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-1">주소</label>
        <input
          name="address"
          value={form.address || ""}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          placeholder="서울특별시 ..."
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition duration-200"
      >
        저장하기
      </button>

      <button
        type="button"
        onClick={handleGoHome}
        className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg transition duration-200"
      >
        뒤로가기
      </button>
    </form>
  );
}
