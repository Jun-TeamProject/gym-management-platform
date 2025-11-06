import { Link } from "react-router-dom";
import ProductList from "../component/ProductList";
import BranchList from "../component/BranchList";
import AdminPage from "./AdminPage";
import AdminOverview from "./AdminOverview";

const primaryButtonClass =
  "px-4 py-2 rounded-lg text-sm font-semibold transition text-white bg-blue-600 hover:bg-blue-700";

const AdminMain = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-gray-900">관리자 페이지</h1>
      </div>

      <div className="space-y-6">
        <Link to="/admin/users" className={primaryButtonClass}>
          전체 회원 관리
        </Link>
      </div>
      <div>
        <Link to="/admin/overview" className={primaryButtonClass}>
          상품 및 지점 관리
        </Link>
      </div>
    </div>
  );
};

export default AdminMain;
