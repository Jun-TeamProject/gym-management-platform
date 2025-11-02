import {useState} from "react";
import useAuthStore from "../stores/authStore";

function RegisterPage() {
    const {register, loading, error} = useAuthStore();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        name: "",
        phone: "",
        role: "",
        branch_id: "",
    });

    const handleChange = (e) => {
        setFormData({
        ...formData,
        [e.target.name]: e.target.value,
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            await register(formData);
            Navigate("/login");
        }catch(err){
            console.error(err);
        }
    };

    return(
        <div className="flex flex-col items-center justify-self-auto min-h-screen">
            <div className="bg-blue-500 p-12 rounded-2xl shadow-2xl w-full max-w-md">
                <h1 className="text-center text-white">회원가입</h1>
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
                        placeholder="비밀번호 입력"
                        required
                        />
                        <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="이름 입력"
                        required />

                        <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="전화번호 입력" required/>

                        <br></br>
                        <label for="city-select">지점</label>
                        <select id="branch-select" name="branch_id"
                        value={formData.branch_id}
                        onChange={handleChange}>
                        <option value="">-- 지점 선택 --</option>
                        <option value="1">서울</option>
                        <option value="2">부산</option>
                        <option value="3">인천</option>
                        </select>

                        <br></br>
                        <label for="role-select">role</label>
                        <select id="role-select" name="role"
                        value={formData.role}
                        onChange={handleChange}>
                        <option value="">-- role 선택 --</option>
                        <option value="1">MEMBER</option>
                        <option value="2">TRANINER</option>
                        <option value="3">ADMIN</option>
                        </select>

                        <button 
                        type="submit"
                        >{loading ? "회원 가입 중..." : "회원 가입"}</button>
                    </div>
                </form>
            </div>
            <a href="/">Home</a><br></br>
            <a href="/login">login</a>
        </div>
    );
}
export default RegisterPage;