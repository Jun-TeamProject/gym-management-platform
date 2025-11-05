import api from "./api";

const userService = {
    async getAllUsers(params={}) {
        try{
            const response = await api.get(`/api/admin/users`,{
                params: params
            });
            console.log('response:', response);
            return response.data;
        }catch(error){
            console.log('유저 조회 실패',error);
        }
    },
    async getUserById(userId) {
        try {
            const response = await api.get(`/api/admin/users/${userId}`);
            return response.data;
        } catch (error) {
            console.error(`id ${userId} 사용자 로딩 실패:`, error);
            throw error;
        }
    },
    async deleteUser(userId){
        const response = await api.delete(`/api/admin/users/${userId}`);
    },
    async changeRole(userId,data){
        const response = await api.put(`/api/admin/users/${userId}/role`,data);
    },
};
export default userService;