import api from "./api";

const calendarService = {
    // async create(memoData){
    //     await api.post("/api/memo", memoData);//출석의 memo항목 내용 추가
    // },
    async update(date,memoData){
        const token = localStorage.getItem("accessToken");
        console.log(token, date, memoData);
        await api.put(`/api/dailyLog/calendar/${date}/memo`, memoData,{
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });//출석의 memo항목 내용 수정
    },
    // async delete(data){
    //     await api.delete('/api/memo',data)//출석 memo항목을 null로 만듦.
    // }
}
export default calendarService;