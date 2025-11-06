import attendService from "../services/attend";
import authService from "../services/auth";
import fetchAttendances from "./Calender";

const attendanceButton = () => {
    const handleAttendanceCheck = async () => {
        const currentUser = authService.getCurrentUser();

        try {
            const userId = currentUser.id;
            const result = await attendService.attend(userId); 

            fetchAttendances();
        } catch (error) {
            alert("이미 출석체크를 하셨습니다.")
            // console.error("출석 체크 실패:", error);
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