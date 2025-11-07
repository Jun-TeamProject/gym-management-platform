import api from "./api";

const attendService = {
    async attend(){
        const token = localStorage.getItem("accessToken");
        const response = await api.post("/api/dailyLog/check-in", {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        // console.log(response.data);
        return response.data;
    },
    async checkAttend(date){
        // const date = String(dateInfo.startStr).substring(0,7);
        // console.log('date:',date);
        
        const token = localStorage.getItem("accessToken");
        const response = await api.get(`/api/dailyLog/calendar`,{
            params: {
                month: date
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        // console.log(response.data);
        return response.data;
    }
}
export default attendService