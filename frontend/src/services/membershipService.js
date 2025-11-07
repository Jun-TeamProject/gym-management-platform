import api from "./api";

const membershipService = {
  async getMySummary() {
    const { data } = await api.get("/api/memberships/me/summary");
    return data;
  },

  async getMembershipDetail(id) {
    const { data } = await api.get(`/api/memberships/${id}`);
    return data;
  },

  async purchaseMembership(payload) {
    const { data } = await api.post("/api/memberships", payload);
    return data;
  },
};

export default membershipService;
