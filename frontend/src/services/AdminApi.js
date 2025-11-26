import MembershipInfo from "../components/profile/MembershipInfo";
import api from "./api";

export const AdminApi = {
  getAllUsers: (role) => {
    return api.get("/api/admin/users", { params: { role } });
  },

  changeUserRole: (userId, newRole) => {
    return api.put(`/api/admin/users/${userId}/role`, { newRole });
  },

  deleteUser: (userId) => {
    return api.delete(`/api/admin/users/${userId}`);
  },

  getPaymentHistory: async (period) => {
    return api.get("/api/admin/payments", {
      params: { period },
    });
  },

  getUserById: async (userId) => {
    return api.get(`/api/admin/users/${userId}`);
  },

  getUserPayments: (userId) => {
    return api.get(`api/payments/admin/user/${userId}`);
  },

  updateMembership: async (MembershipId, updateData) => {
    return api.put(`/api/admin/memberships/${MembershipId}`, updateData);
  }
};
