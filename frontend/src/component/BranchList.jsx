import React, { useState, useEffect } from "react";
import { BranchApi } from "../services/BranchApi";
import BranchForm from "./BranchForm";

const buttonClass = "px-4 py-2 rounded-lg text-sm font-semibold transition";
const primaryButtonClass = `${buttonClass} text-white bg-blue-600 hover:bg-blue-700`;
const secondaryButtonClass = `${buttonClass} text-gray-700 bg-gray-100 hover:bg-gray-200`;

const BranchList = () => {
  const [branches, setBranches] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);

  const fetchBranches = async () => {
    try {
      const response = await BranchApi.getAllBranches();
      setBranches(response.data);
    } catch (error) {
      console.error("지점 목록 조회 실패: ", error);
      alert("지점 목록을 불러오는 데 실패했습니다.");
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleEdit = (branch) => {
    setEditingBranch(branch);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("정말로 이 지점을 삭제 하시겠습니까?")) return;
    try {
      await BranchApi.deleteBranch(id);
      alert("지점이 삭제 되었습니다.");
      fetchBranches();
    } catch (error) {
      console.error("지점 삭제 실패: ", error);
      alert("지점 삭제에 실패했습니다. ");
    }
  };

  const handleFormSubmit = () => {
    setIsFormOpen(false);
    setEditingBranch(null);
    fetchBranches(); // 새로고침
  };

  return (
    <div className="branch-management bg-white p-6 rounded-2xl shadow border">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-extrabold text-gray-900"> 지점 관리 (ADMIN)</h2>
        <button
          onClick={() => {
            setEditingBranch(null);
            setIsFormOpen(true);
          }}
          className={primaryButtonClass} 
        >
          + 새 지점 등록
        </button>
      </div>

      {isFormOpen && (
        <BranchForm
          branch={editingBranch}
          onClose={() => setIsFormOpen(false)}
          onSubmitSuccess={handleFormSubmit}
        />
      )}

      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">지점명</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">주소</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">연락처</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">액션</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {branches.map((branch) => (
              <tr key={branch.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm text-gray-900">{branch.id}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{branch.branchName}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{branch.location}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{branch.phone}</td>
                <td className="px-6 py-4 text-sm font-medium space-x-2">
                  <button onClick={() => handleEdit(branch)} className={secondaryButtonClass}>
                    수정
                  </button>
                  <button onClick={() => handleDelete(branch.id)} className={`${buttonClass} text-red-600 bg-red-50 hover:bg-red-100`}>
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BranchList;
