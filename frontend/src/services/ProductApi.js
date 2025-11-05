import api from "./api";

const PRODUCT_API_URL = "/products";

export const ProductApi = {
  getAllProducts: async () => {
    return api.get(PRODUCT_API_URL);
  },

  createProduct: async (productData) => {
    return api.post(PRODUCT_API_URL, productData);
  },

  updateProduct: async (id, productData) => {
    return api.put(`${PRODUCT_API_URL}/${id}`, productData);
  },

  deleteProduct: async (id) => {
    return api.delete(`${PRODUCT_API_URL}/${id}`);
  },
};
