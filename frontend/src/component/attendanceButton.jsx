import attendService from "../services/attend";
import authService from "../services/auth";
import fetchAttendances from "./Calender";

const attendanceButton = ({ onRefresh }) => {
    const handleAttendanceCheck = async () => {
        try {
            const response = await attendService.attend();
            //user_id와 날짜, 출석 상태를 확인 후 허용할지 말지. 추가할 수 있음.
            if (onRefresh) {
                onRefresh(); 
            }
        } catch (error) {
            console.error("출석 체크 실패:", error);
        }
    }
    
    return(
        <button
        onClick={handleAttendanceCheck}
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full 
                   transition duration-300 ease-in-out transform hover:scale-105 
                   shadow-lg shadow-indigo-500/50 focus:outline-none focus:ring-4 focus:ring-indigo-300"
    >
        출석 체크하기
    </button>
    )
}
export default attendanceButton;