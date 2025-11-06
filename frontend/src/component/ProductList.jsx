import React, { useEffect, useState } from "react";
import { ProductApi } from "../services/ProductApi";
import ProductForm from "./ProductForm";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";

const buttonClass = "px-4 py-2 rounded-lg text-sm font-semibold transition";
const primaryButtonClass = `${buttonClass} text-white bg-blue-600 hover:bg-blue-700`;
const secondaryButtonClass = `${buttonClass} text-gray-700 bg-gray-100 hover:bg-gray-200`;

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const navigate = useNavigate();
  const { user } = useAuthStore(); // 로그인한 사용자 정보

  const fetchProducts = async () => {
    try {
      const response = await ProductApi.getAllProducts();
      setProducts(response.data);
    } catch (error) {
      console.error("상품 목록 조회 실패", error);
      alert("상품 목록을 불러오는데 실패 했습니다.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("정말로 이 상품을 삭제하시겠습니까? ")) return;
    //ToDo 구매한 이력이 있는 상품 삭제 불가능 또는 변경 처리 작업 추가
    try {
      await ProductApi.deleteProduct(productId);
      alert("상품이 삭제되었습니다.");
      fetchProducts();
    } catch (error) {
      console.error("상품 삭제 실패: ", error);
      alert("상품 삭제에 실패 했습니다.");
    }
  };

  const handleFormSubmit = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
    fetchProducts();
  };

  const handlePurchase = (productId) => {
    navigate(`/checkout/${productId}`);
  };

  return (
    <div className="product-management bg-white p-6 rounded-2xl shadow border">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-extrabold text-gray-900">
          {" "}
          상품 관리 (ADMIN)
        </h2>
        {user?.role === "ADMIN" && ( // ADMIN 일 떄만 등록 버튼 보임
          <button
            onClick={() => {
              setEditingProduct(null);
              setIsFormOpen(true);
            }}
            className={primaryButtonClass} 
          >
            + 새 상품 등록
          </button>
        )}
      </div>

      {isFormOpen && (
        <ProductForm
          product={editingProduct}
          onClose={() => setIsFormOpen(false)}
          onSubmitSuccess={handleFormSubmit}
        />
      )}

      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                타입
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                상품명
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                가격
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                기간 / 횟수
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                액션
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr
                key={product.productId}
                className="hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4 text-sm text-gray-900">
                  {product.productId}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {product.type === "Membership" ? "회원권" : "PT 이용권"}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {product.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {product.price.toLocaleString()}원
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {
                    product.type === "Membership"
                      ? `${product.durationMonths || 0}개월` // 회원권
                      : `${product.sessionCount || 0}회` // PT
                  }
                </td>

                <td className="px-6 py-4 text-sm font-medium space-x-2">
                  {user?.role === "ADMIN" ? (
                    <>
                      <button
                        onClick={() => handleEdit(product)}
                        className={secondaryButtonClass}
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(product.productId)}
                        className={`${buttonClass} text-red-600 bg-red-50 hover:bg-red-100`}
                      >
                        삭제
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handlePurchase(product.productId)}
                      className={primaryButtonClass}
                    >
                      구매하기
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;
