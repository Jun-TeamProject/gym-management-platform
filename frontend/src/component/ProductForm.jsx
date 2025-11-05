import React, { useState, useEffect } from "react";
import { ProductApi } from "../services/ProductApi";

const ProductForm = ({ product, onClose, onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    type: "Membership",
    name: "",
    price: 0,
    durationMonths: 1,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        type: product.type,
        name: product.name,
        price: product.price,
        durationMonths: product.durationMonths,
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "durationMonths"
          ? parseInt(value) || 0
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 가격, 기간 유효성 검사
    if (formData.price < 0 || formData.durationMonths < 1) {
      alert("가격은 0원 이상, 기간은 1개월 이상 이어야 합니다.");
      return;
    }

    try {
      if (product) {
        await ProductApi.updateProduct(product.id, formData);
        alert("상품 정보가 성공적으로 수정되었습니다.");
      } else {
        await ProductApi.createProduct(formData);
        alert("새 상품이 성공적으로 등록되었습니다.");
      }
      onSubmitSuccess();
    } catch (error) {
      console.error("상품 저장/ 수정 실패: ", error.response?.data || error);
      alert("저장/수정에 실패했습니다. (권한 및 입력 필드 확인)");
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>{product ? "상품 수정" : "새 상품 등록"}</h3>
        <form onSubmit={handleSubmit}>
          <label>상품 타입</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="Membership">회원권 </option>
            <option value="PT"> PT 이용권</option>
          </select>

          <label>상품명</label>
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="상품명"
            required
          />

          <label>가격 (원)</label>
          <input
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            min="0"
            required
          />

          <label>기간</label>
          <input
            name="durationMonths"
            type="number"
            value={formData.durationMonths}
            onChange={handleChange}
            min="1"
            required
          />

          <button type="submit">{product ? "수정 완료" : "등록"}</button>
          <button type="button" onClick={onClose}>
            취소
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
