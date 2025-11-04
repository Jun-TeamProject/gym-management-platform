import { useEffect, useState } from "react";
import { BranchApi } from "../services/BranchApi";

const BranchForm = ({ branch, onClose, onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    phone: "",
  });

  useEffect(() => {
    if (branch) {
      setFormData(branch);
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
        // 수정
        await BranchApi.updateBranch(branch.id, formData);
        alert("지점 정보가 수정되었습니다.");
      } else {
        //등록
        await BranchApi.createBranch(formData);
        alert("새 지점이 등록되었습니다.");
      }
      onSubmitSuccess;
    } catch (error) {
      console.error("지점 저장 / 수정 실패: ", error.response?.data || error);
      alert("저장 / 수정에 실패했습니다. 필드를 확인해 주세요");
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>{branch ? "지점 수정" : "새 지점 등록"}</h3>
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="지점명"
            required
          />
          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="주소"
          />
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="연락처"
          />

          <button type="submit"> {branch ? "수정완료" : "등록"}</button>
          <button type="button" onClick={onClose}>
            취소
          </button>
        </form>
      </div>
    </div>
  );
};

export default BranchForm;
