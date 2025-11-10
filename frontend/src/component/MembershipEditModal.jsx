import React, { useState, useEffect } from 'react'; 
import { AdminApi } from '../services/AdminApi';

const inputClass = "w-full rounded-lg border border-gray-300 px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400";
const primaryButtonClass = "px-5 py-3 rounded-xl text-white bg-blue-600 hover:bg-blue-700 font-semibold transition disabled:opacity-50";
const secondaryButtonClass = "px-5 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition";

const MembershipEditModal = ({ membership, onClose, onUpdateSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    endDate: '', // 초기값 빈 문자열로 변경
    ptCountRemaining: 0,
  });
  
const isMembership = membership?.productType === 'Membership';
const isPT = membership?.productType === 'PT';

const modalTitle = isMembership ? "회원권 종료일 수정" : isPT ? "남은 PT 횟수 조정" : "이용권 수정";
  useEffect(() => {
    if (membership) {
        setFormData({
            endDate: membership.endDate || '',
            ptCountRemaining: membership.ptCountRemaining || 0,
        });
    }
  }, [membership]);  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const updateData = {
      endDate: isMembership ? formData.endDate : null, 
      ptCountRemaining: isPT ? parseInt(formData.ptCountRemaining, 10) : null
    };

    try {
      await AdminApi.updateMembership(membership.id, updateData);
      alert("이용권 정보가 성공적으로 수정되었습니다.");  
      onUpdateSuccess();
      onClose();  
    } catch (err) {
      console.error("이용권 수정 실패:", err);
      setError("수정에 실패했습니다: " + (err.response?.data?.message || err.message));  
    } finally {
      setLoading(false);
    }
  };

  if (!membership) return null;

  return (
    <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        <div className="border-b px-6 py-4">
          <h3 className="text-xl font-bold text-gray-900">이용권 수정 ({modalTitle})</h3>
          <p className="text-sm text-gray-600">({membership.productName}) - 회원: ({membership.user?.username})</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {isMembership && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">만료일 (YYYY-MM-DD)</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          )}

          {isPT && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">남은 PT 횟수</label>
            <input
              type="number"
              name="ptCountRemaining"
              value={formData.ptCountRemaining}
              onChange={handleChange}
              className={inputClass}
              min="0"
            />
          </div>
            )}

          {error && (
            <div className="text-sm text-red-600 p-2 bg-red-50 rounded-lg">{error}</div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className={secondaryButtonClass} disabled={loading}>
              취소
            </button>
            <button type="submit" disabled={loading} className={primaryButtonClass}>
              {loading ? "저장 중..." : "저장하기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MembershipEditModal;