import attendService from "../services/attend";
import authService from "../services/auth";

const attendanceButton = () => {
    const handleAttendanceCheck = async () => {
        const currentUser = authService.getCurrentUser();

        try {
            const userId = currentUser.id;
            const result = await attendService.attend(userId); 

            await fetchAttendances();
        } catch (error) {
            console.error("출석 체크 실패:", error);
        }
    }
    
    return(
        <div>
            <button
            onClick={handleAttendanceCheck}
            className="">출석체크</button>
        </div>
    )
}
export default attendanceButton;