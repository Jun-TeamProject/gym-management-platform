import React, { useEffect, useState } from "react";
import { ProductApi } from "../services/ProductApi";
import ProductForm from "./ProductForm";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";

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
    <div className="product-management">
      <h2> 상품 관리 (ADMIN)</h2>
      {user?.role === "ADMIN" && ( // ADMIN 일 떄만 등록 버튼 보임
        <button
          onClick={() => {
            setEditingProduct(null);
            setIsFormOpen(true);
          }}
        >
          + 새 상품 등록
        </button>
      )}

      {isFormOpen && (
        <ProductForm
          product={editingProduct}
          onClose={() => setIsFormOpen(false)}
          onSubmitSuccess={handleFormSubmit}
        />
      )}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>타입</th>
            <th>상품명</th>
            <th>가격</th>
            <th>기간(개월)</th>
            <th>액션</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.ProductId}>
              <td>{product.ProductId}</td>
              <td>{product.type === "Membership" ? "회원권" : "PT 이용권"}</td>
              <td>{product.name}</td>
              <td>{product.price.toLocaleString()}원</td>
              <td>{product.durationMonths}개월</td>
              <td>
                {user?.role === "ADMIN" ? (
                  <>
                    <button onClick={() => handleEdit(product)}>수정</button>
                    <button onClick={() => handleDelete(product.productId)}>
                      삭제
                    </button>
                  </>
                ) : (
                  <button onClick={() => handlePurchase(product.productId)}>
                    구매하기
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
