import { create } from "zustand";
import authService from "../services/auth";
import useNotificationStore from "./notificationStore";

const useAuthStore = create((set) => ({
    user: authService.getCurrentUser(),
    isAuthenticated: authService.isAuthenticated(),
    loading: false,
    error: null,

    register: async (userData) => {
        set({ loading: true, error: null });
        try {
            const data = await authService.register(userData);
            // set({
            //     user: data.user,
            //     isAuthenticated: true,
            //     loading: false,
            // });

            //회원가입후 자동로그인으로 뜨는 상태 변경
            set({ loading: false });
            return data;
        } catch (err) {
            set({
                loading: false,
                error: err.response?.data?.message || "Registration failed",
            });
            throw err;
        }
    },
    login: async (userData) => {
        set({ loading: true, error: null });
        try {
            const data = await authService.login(userData);
            set({
                user: data?.user || null,
                isAuthenticated: !!data?.access_token,
                loading: false,
            });
            return data;
        } catch (err) {
            console.error("authStore.login error:", err);
            set({
                loading: false,
                error: err.response?.data?.message || "Login failed",
            });
            throw err;
        }
    },
    logout: () => {
        authService.logout();
        set({
            user: null,
            isAuthenticated: false,
            error: null,
        });
        useNotificationStore.getState().disconnectSse();
    },
    socialLoginSuccess: () => {
        const accessToken = localStorage.getItem("accessToken");
        const userStr = localStorage.getItem("user");
        const user = userStr ? JSON.parse(userStr) : null;

        if (accessToken && user) {
            set({
                user: user,
                isAuthenticated: !!accessToken,
                loading: false,
                error: null,
            });
            return true;
        } else {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
            set({
                user: null,
                isAuthenticated: false,
                loading: false,
            });
            return false;
        }
    }
}));
export default useAuthStore;