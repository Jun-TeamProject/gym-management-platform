import { useEffect, useState } from "react";
import { BranchApi } from "../services/BranchApi";

const inputClass =
  "w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400";
const buttonClass = "px-4 py-2 rounded-lg text-sm font-semibold transition";
const primaryButtonClass = `${buttonClass} text-white bg-blue-600 hover:bg-blue-700`;
const secondaryButtonClass = `${buttonClass} text-gray-700 bg-gray-100 hover:bg-gray-200`;

const BranchForm = ({ branch, onClose, onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    branchName: "",
    location: "",
    phone: "",
  });

  useEffect(() => {
    if (branch) {
      setFormData({
        branchName: branch.branchName || "",
        location: branch.location || "",
        phone: branch.phone || "",
      });
    }
  }, [branch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (branch) {
        await BranchApi.updateBranch(branch.id, formData);
        alert("지점 정보가 수정되었습니다.");
      } else {
        await BranchApi.createBranch(formData);
        alert("새 지점이 등록되었습니다.");
      }
      onSubmitSuccess();
    } catch (error) {
      console.error("지점 저장 / 수정 실패: ", error.response?.data || error);
      alert("저장 / 수정에 실패했습니다. 필드를 확인해 주세요");
    }
  };

  return (
    <div className="modal">
      <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center">
        <div className="modal-content">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="border-b px-6 py-4">
              <h3 className="text-xl font-bold text-gray-900">
                {branch ? "지점 수정" : "새 지점 등록"}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  지점명
                </label>
                <input
                  name="branchName"
                  value={formData.branchName}
                  onChange={handleChange}
                  placeholder="지점명 (예: 강남점)"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  주소
                </label>
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="주소 (예: 서울특별시 강남구)"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  연락처
                </label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="연락처 (예: 02-123-4567)"
                  className={inputClass}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className={secondaryButtonClass}
                >
                  취소
                </button>
                <button type="submit" className={primaryButtonClass}>
                  {branch ? "수정 완료" : "등록"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchForm;
