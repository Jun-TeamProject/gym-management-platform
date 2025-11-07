import api from "./api";

const PRODUCT_API_URL = "/api/products";

export const ProductApi = {
  getAllProducts: async () => {
    return api.get(PRODUCT_API_URL);
  },

  createProduct: async (productData) => {
    return api.post(PRODUCT_API_URL, productData);
  },

  updateProduct: async (productId, productData) => {
    return api.put(`${PRODUCT_API_URL}/${productId}`, productData);
  },

  deleteProduct: async (productId) => {
    return api.delete(`${PRODUCT_API_URL}/${productId}`);
  },
};
