import React from "react";
import { BranchApi } from "../services/BranchApi";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const BranchListPage = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await BranchApi.getAllBranches();
        setBranches(response.data);
      } catch (error) {
        console.error("지점 목록을 불러오는 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  if (loading) {
    return <div>지점 목록을 불러오는 중...</div>;
  }
  return (
    <div className="branch-list-page bg-white p-6 rounded-2xl shadow border max-w-4xl mx-auto">
      <h2 className="text-2xl font-extrabold text-gray-900 mb-6"> </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {branches.map((branch) => (
          <Link
            key={branch.id}
            to={`/branches/${branch.id}`} //
            className="block p-6 bg-gray-50 rounded-lg border transition hover:shadow-md hover:border-blue-300"
          >
            <h3 className="text-lg font-bold text-blue-700">
              {branch.branchName}
            </h3>
            <p className="text-sm text-gray-600 mt-2">📍 {branch.location}</p>
            <p className="text-sm text-gray-600 mt-1">📞 {branch.phone}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BranchListPage;
