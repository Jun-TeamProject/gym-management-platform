import { Link } from "react-router-dom";

const Card = ({ to, title, description, icon }) => (
  <Link
    to={to}
    className="block p-6 bg-white rounded-2xl shadow border transition-all hover:shadow-lg hover:border-blue-300"
  >
    <div className="text-3xl mb-3">{icon}</div>
    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
    <p className="text-sm text-gray-600 mt-1">{description}</p>
  </Link>
);

const AdminMain = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-extrabold text-gray-900">관리자 페이지</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          to="/admin/users"
          title="회원 관리"
          description="전체 회원 목록을 조회하고 역할을 변경합니다."
          icon="👤"
        />
        <Card
          to="/admin/overview"
          title="상품 및 지점 관리"
          description="이용권 상품과 헬스장 지점을 관리합니다."
          icon="🏬"
        />
        <Card
          to="/admin/payments"
          title="결제 / 매출 관리"
          description="전체 결제 내역을 조회하고 매출을 확인합니다."
          icon="💳"
        />
      </div>
    </div>
  );
};

export default AdminMain;
