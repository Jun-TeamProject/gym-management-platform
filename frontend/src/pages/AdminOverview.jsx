import { Link } from "react-router-dom";
import ProductList from "../component/ProductList";
import BranchList from "../component/BranchList";

const primaryButtonClass =
  "px-4 py-2 rounded-lg text-sm font-semibold transition text-white bg-blue-600 hover:bg-blue-700";

const AdminOverview = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-gray-900">상품 및 지점 관리</h1>
        <Link to="/admin" className={primaryButtonClass}>
          관리자 홈
        </Link>
      </div>

      <div className="space-y-6">
        <ProductList />

        <BranchList />
      </div>
    </div>
  );
};

export default AdminOverview;
