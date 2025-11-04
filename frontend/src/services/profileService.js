import api from "./api";

const profileService = {
  async getMyProfile() {
    const res = await api.get("/api/users/me");
    return res.data;
  },

  async updateMyProfile(data) {
    const res = await api.put("/api/users/me", data);
    return res.data;
  },

  async uploadAvatar(file) {
    const form = new FormData();
    form.append("image", file);
    const res = await api.put("/api/users/me/image", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
};

export default profileService;
