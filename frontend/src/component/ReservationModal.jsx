import { useEffect, useState } from "react";
import { ReservationApi } from "../services/reservationApi";
import api from "../services/api";

const inputClass =
  "w-full rounded-lg border border-gray-300 px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400";
const primaryButtonClass =
  "px-5 py-3 rounded-xl text-white bg-blue-600 hover:bg-blue-700 font-semibold transition disabled:opacity-50";
const secondaryButtonClass =
  "px-5 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition";

const toLocalISOString = (date) => {
    const pad = (num) => (num < 10 ? '0' : '') +num;

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const ReservationModal = ({ initialTime, onClose, onSubmitSuccess }) => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    startTime: toLocalISOString(initialTime),
    trainerId: "",
    memo: "",
  });

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const response = await api.get("/api/users/trainers");
        setTrainers(response.data);
      } catch (err) {
        console.error("트레이너 목록 조회 실패: ", err);
        setError("트레이너를 찾을 수 없습니다.");
      }
    };
    fetchTrainers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const startTimeDate = new Date (formData.startTime);

    if(!formData.startTime || isNaN(startTimeDate.getTime())){
        setError(" ");
        setLoading(false);
        return;
    }

    const oneHourLater = new Date (startTimeDate.getTime() + 60 * 60 * 1000);


    const requestData = {
      trainerId: parseInt(formData.trainerId),
      startTime: formData.startTime,
      endTime: toLocalISOString(oneHourLater),
      memo: formData.memo,
      status: "PENDING",
    };

    try {
      await ReservationApi.createReservation(requestData);
      alert("새로운 예약이 신청되었습니다.");
      onSubmitSuccess();
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "예약 신청에 실패했습니다.";
      console.error("예약 생성 실패: ", err.response?.data);

      if (errorMsg.includes("겹치는 예약")) {
        setError(
          "해당 트레이너는 이미 겹치는 예약이 있습니다. 다른 시간을 선택해주세요."
        );
      } else if (errorMsg.includes("2주 이내")) {
        setError("예약은 2주 이내의 날짜로만 신청 할 수 있습니다.");
      } else {
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        <div className="border-b px-6 py-4">
          <h3 className="text-xl font-bold text-gray-900">PT 예약 신청</h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* 예약 시간 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              예약 시간 (1시간)
            </label>
            <input
              type="datetime-local"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          {/* 트레이너 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              트레이너 선택
            </label>
            <select
              name="trainerId"
              value={formData.trainerId}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="">-- 트레이너를 선택하세요 --</option>
              {trainers.map((trainer) => (
                <option key={trainer.id} value={trainer.id}>
                  {trainer.username} (강남점)
                </option>
              ))}
            </select>
          </div>

          {/* 메모 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              메모 (선택)
            </label>
            <textarea
              name="memo"
              value={formData.memo}
              onChange={handleChange}
              placeholder="예: 하체 위주로 부탁드립니다."
              rows={3}
              className={inputClass}
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 p-2 bg-red-50 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={secondaryButtonClass}
              disabled={loading}
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              className={primaryButtonClass}
            >
              {loading ? "신청 중..." : "예약 신청"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationModal;