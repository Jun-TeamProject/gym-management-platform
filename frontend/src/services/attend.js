import api from "./api";

const attendService = {
    async attend(){
        const response = await api.post("/api/attendances/check");
        return response.data;
    },
    async checkAttend(userId){
        const response = await api.get(`/api/attendances/${userId}`);
        return response.data;
    }
}
export default attendService