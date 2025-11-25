import api from './api';

const chatService = {
    async getChatHistory(roomId) {
        try {
            const response = await api.get(`/api/chat/history/${roomId}`);
            return response.data; 
        } catch (error) {
            console.error("과거 채팅 기록 로딩 실패:", error);
            return [];
        }
    },
    async getAllChatRoom() {
        try{
            const response = await api.get(`api/chatroom`);
            console.log(response.data[0]);
            return response.data;
        }catch (error){
            console.log("chatroom 조회 실패");
            return [];
        }
    },
    async updateUnread(roomId,userId) {
        try{
            console.log(roomId,userId);
            await api.put(`api/chat/update/${roomId}`,null,{
                params : {
                    userId: userId
                },
            });
        }catch (error){
            console.error("isread업데이트 실패");
        }
    }
}
export default chatService;
