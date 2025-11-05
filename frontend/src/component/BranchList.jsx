import React, { useState, useEffect } from "react";
import { BranchApi } from "../services/BranchApi";
import BranchForm from "./BranchForm";

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
    <div className="branch-management">
      <h2> 지점 관리 (ADMIN)</h2>
      <button
        onClick={() => {
          setEditingBranch(null);
          setIsFormOpen(true);
        }}
      >
        + 새 지점 등록
      </button>

      {isFormOpen && (
        <BranchForm
          branch={editingBranch}
          onClose={() => setIsFormOpen(false)}
          onSubmitSuccess={handleFormSubmit}
        />
      )}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>지점명</th>
            <th>주소</th>
            <th>연락처</th>
            <th>액션</th>
          </tr>
        </thead>
        <tbody>
          {branches.map((branch) => (
            <tr key={branch.id}>
              <td>{branch.id}</td>
              <td>{branch.name}</td>
              <td>{branch.location}</td>
              <td>{branch.phone}</td>
              <td>
                <button onClick={() => handleEdit(branch)}>수정</button>
                <button onClick={() => handleDelete(branch)}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BranchList;
