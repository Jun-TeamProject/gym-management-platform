import api from "./api";

const BRANCH_API_URL = "/api/branches";

export const BranchApi = {
  getAllBranches: async () => {
    return api.get(BRANCH_API_URL);
  },

  // 지점 등록
  createBranch: async (branchData) => {
    return api.post(BRANCH_API_URL, branchData);
  },

  getBranchDetails: async (branchId) => {
    return api.get(`${BRANCH_API_URL}/${branchId}`);
  },

  updateBranch: async (branchId, branchData) => {
    return api.put(`${BRANCH_API_URL}/${branchId}`, branchData);
  },

  deleteBranch: async (branchId) => {
    return api.delete(`${BRANCH_API_URL}/${branchId}`);
  },

  addFacilityImage: async (branchId, file) => {
    const formData = new FormData();
    formData.append("image", file);

    return api.post(`${BRANCH_API_URL}/${branchId}/images`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  deleteFacilityImage: async (branchId, imageUrl) => {
    return api.delete(`${BRANCH_API_URL}/${branchId}/images`, {
      params: { imageUrl },
    });
  },
};
