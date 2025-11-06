import { useState,useEffect } from "react";
import userService from '../services/user';

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchUsers = async () => {
        try {
            const userData = await userService.getAllUsers({role: ['']});
            setUsers(userData);
        } catch (error) {
            console.log("사용자 갱신 실패");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchUsers();
    }, []);

    if (loading) return <div>로딩 중...</div>;

    const handleDeleteUser = async(userId,username) => {
        const isConfirmed = confirm(`정말 username: ${username} 을(를) 삭제하시겠습니까?`);
        if(isConfirmed){
            await userService.deleteUser(userId);
            fetchUsers();
        }else{
            return;
        }
        
    }
    const handleRoleChange = async(userId, data) => {
        console.log(userId,data);
        await userService.changeRole(userId, data);
        alert("role이 성공적으로 변경되었습니다.");
        fetchUsers();
    }
    const availableRoles = ['MEMBER', 'TRAINER']; 
    return (
   <div className="bg-white p-6 rounded-2xl shadow border">   
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-extrabold text-gray-900">
        {" "} 
        사용자 목록 (ADMIN)</h2>
        </div>
        <div className="overflow-x-auto rounded-lg border">
            <table className="min-w-full divide-y divide-gray-200">
                
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    사용자 이름
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    이메일
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        멤버십 종료일
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        남은 pt횟수
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    구분
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    액션
                    </th>
                </tr>
                </thead>
                
                <tbody className="bg-white divide-y divide-gray-200">
                {users.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-900">
                        {user.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                        {user.username}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                        {user.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                        {user.membership?.endDate}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                        {user.membership?.ptCountRemaining}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                        <select
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'TRAINER' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id,{newRole: e.target.value})}>
                            {availableRoles.map(roleOption => (
                            <option key={roleOption} value={roleOption}>
                            {roleOption}
                            </option>
                    ))}
                        </select>
                    </td>
                    <td>
                        <button className="text-red-600 bg-red-50 hover:bg-red-100" onClick={() => handleDeleteUser(user.id,user.username)}>삭제</button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};
export default AdminPage;