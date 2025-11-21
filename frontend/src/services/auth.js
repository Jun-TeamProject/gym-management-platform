import api from "./api";

const authService = {
    async register(userData) {
        const response = await api.post("/api/auth/register", userData);
        // const {access_token, refresh_token, user} = response.data;

        // localStorage.setItem("accessToken", access_token);
        // localStorage.setItem("refreshToken", refresh_token);
        // localStorage.setItem("user", JSON.stringify(user));

        return response.data;
    },
    async login(userData) {
        const response = await api.post("/api/auth/login", userData);
        const { access_token, refresh_token, user } = response.data;

        localStorage.setItem("accessToken", access_token);
        localStorage.setItem("refreshToken", refresh_token);
        localStorage.setItem("user", JSON.stringify(user));

        return response.data;
    },
    logout() {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
    },
    getCurrentUser() {
        const userStr = localStorage.getItem("user");
        return userStr ? JSON.parse(userStr) : null;
    },
    isAuthenticated() {
        return !!localStorage.getItem("accessToken");
    },
    getRole() {
        const user = this.getCurrentUser();
        return user ? user.role : null;
    },

    async requestPasswordReset(email) {
        const response = await api.post("/api/auth/forgot-password", { email });
        return response.data;
    },

    async resetPassword(token, newPassword) {
        const response = await api.post("/api/auth/reset-password", { token, newPassword });
        return response.data;
    },

    async withdraw(password) {
        const data = password ? { password: password } : {};
        const response = await api.post("/api/users/withdraw", data);

        this.logout();
        return response.data;
    }
}
export default authService;