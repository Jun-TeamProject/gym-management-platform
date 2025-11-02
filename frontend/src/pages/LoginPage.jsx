import useAuthStore from "../stores/authStore";
import { useState } from "react";

function LoginPage() {
  const { login, loading, error} = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name] : e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const result = await login(formData);
    }catch(err){
      console.error("login error caught in LoginPage: ", err);
    }
  }
  return (
    <div className="flex flex-col items-center justify-self-auto min-h-screen">
      <div className="bg-blue-500 p-12 rounded-2xl shadow-2xl w-full max-w-md">
      
      <h1 className="text-center">login</h1>
      <br></br>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="이메일 입력" required />
          <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="패스워드 입력" required />

          <button 
            type="submit"
            >{loading ? "로그인 중..." : "로그인"}</button>
        </div>
      </form>
      
    </div>
    <a href="/" >Home</a>
    <br></br>
    <a href="/register">register</a>
    </div>
  );
}
export default LoginPage;