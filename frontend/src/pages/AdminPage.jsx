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
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">전체 사용자 목록</h2>

      <table className="min-w-full divide-y divide-gray-200 shadow-lg rounded-lg overflow-hidden">
        
        <thead className="bg-gray-300">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              사용자 이름
            </th>
            <th className="px-17 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              이메일
            </th>
            <th className="px-14 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              구분
            </th>
            <th className="px-0 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                삭제
            </th>
          </tr>
        </thead>
        
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map(user => (
            <tr key={user.id} className="hover:bg-gray-50 transition duration-150">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {user.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.username}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <select
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'TRAINER' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}
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
                <button className="bg-gray-600 hover:bg-red-700 inline-flex text-xs leading- text-white font-semibold rounded-half" onClick={() => handleDeleteUser(user.id,user.username)}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default AdminPage;