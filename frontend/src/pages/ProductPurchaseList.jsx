import React, { useEffect, useState } from "react";
import { ProductApi } from "../services/ProductApi";
import useAuthStore from "../stores/authStore";
import { useNavigate } from 'react-router-dom';

const buttonClass = "px-4 py-2 rounded-lg text-sm font-semibold transition";
const primaryButtonClass = `${buttonClass} text-white bg-blue-600 hover:bg-blue-700`;


const ProductPurchaseList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  const fetchProducts = async () => {
    try {
      const response = await ProductApi.getAllProducts();
      setProducts(response.data);
    } catch (error) {
      console.error("상품 목록 조회 실패:", error);
      alert("상품 목록을 불러오는 데 실패했습니다.");
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handlePurchase = (productId) => {
    if (!isAuthenticated || user.role !== 'MEMBER') {
        alert("회원권 구매는 회원으로 로그인해야 가능합니다.");
        navigate('/login');
        return;
    }
    navigate(`/checkout/${productId}`);
  };

  if (loading) return <div className="text-center p-10">상품 목록 로딩 중...</div>;

  return (
    <div className="product-purchase bg-white p-6 rounded-2xl shadow border">
      <h2 className="text-2xl font-extrabold text-gray-900 mb-6">🏋️ 이용권 및 PT 상품</h2>

      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">상품명</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">타입</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">가격</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">기간 / 횟수</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">구매</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.productId} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.name}</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                    {product.type === "Membership" ? "헬스 회원권" : "PT 이용권"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">{product.price.toLocaleString()}원</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {product.type === "Membership"
                    ? `${product.durationMonths || 0}개월`
                    : `${product.sessionCount || 0}회`
                  }
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  <button 
                    onClick={() => handlePurchase(product.productId)} 
                    className={primaryButtonClass}
                  >
                    구매하기
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

export default ProductPurchaseList;