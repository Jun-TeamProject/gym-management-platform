import React, { useState, useEffect } from "react";
import { ProductApi } from "../services/ProductApi";

const inputClass =
  "w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400";
const buttonClass = "px-4 py-2 rounded-lg text-sm font-semibold transition";
const primaryButtonClass = `${buttonClass} text-white bg-blue-600 hover:bg-blue-700`;
const secondaryButtonClass = `${buttonClass} text-gray-700 bg-gray-100 hover:bg-gray-200`;

const ProductForm = ({ product, onClose, onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    type: "Membership",
    name: "",
    price: 0,
    durationMonths: 1,
    sessionCount: 10,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        type: product.type,
        name: product.name,
        price: product.price,
        durationMonths: product.durationMonths || 1,
        sessionCount: product.sessionCount || 10,
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const isNumericField =
      name === "price" || name === "durationMonths" || name === "sessionCount";

    setFormData((prev) => ({
      ...prev,
      [name]: isNumericField ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      type: formData.type,
      name: formData.name,
      price: formData.price,
      durationMonths:
        formData.type === "Membership" ? formData.durationMonths : 0,
      sessionCount: formData.type === "PT" ? formData.sessionCount : 0,
    };

    if (
      dataToSend.price < 0 ||
      (dataToSend.type === "Membership" && dataToSend.durationMonths < 1) ||
      (dataToSend.type === "PT" && dataToSend.sessionCount < 1)
    ) {
      alert("가격은 0원 이상, 기간/횟수는 1 이상이어야 합니다.");
      return;
    }

    try {
      if (product) {
        await ProductApi.updateProduct(product.productId, dataToSend); // DTO가 productId를 사용
        alert("상품 정보가 성공적으로 수정되었습니다.");
      } else {
        await ProductApi.createProduct(dataToSend);
        alert("새 상품이 성공적으로 등록되었습니다.");
      }
      onSubmitSuccess();
    } catch (error) {
      console.error("상품 저장/ 수정 실패: ", error.response?.data || error);
      alert("저장/수정에 실패했습니다.");
    }
  };

  return (
    <div className="modal">
      <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center">
        <div className="modal-content">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="border-b px-6 py-4">
              <h3 className="text-xl font-bold text-gray-900">
                {product ? "상품 수정" : "새 상품 등록"}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  상품 타입
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className={inputClass}
                >
                  <option value="Membership">회원권</option>
                  <option value="PT">PT 이용권</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  상품명
                </label>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="상품명"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  가격 (원)
                </label>
                <input
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  required
                  className={inputClass}
                />
              </div>

              {formData.type === "Membership" ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    기간 (개월)
                  </label>
                  <input
                    name="durationMonths"
                    type="number"
                    value={formData.durationMonths}
                    onChange={handleChange}
                    min="1"
                    required
                    className={inputClass}
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    횟수 (회)
                  </label>
                  <input
                    name="sessionCount"
                    type="number"
                    value={formData.sessionCount}
                    onChange={handleChange}
                    min="1"
                    required
                    className={inputClass}
                  />
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className={secondaryButtonClass}
                >
                  취소
                </button>
                <button type="submit" className={primaryButtonClass}>
                  {product ? "수정 완료" : "등록"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
