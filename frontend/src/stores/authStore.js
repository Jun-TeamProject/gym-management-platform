import { create } from "zustand";
import  authService  from "../services/auth";

const useAuthStore = create((set) => ({
    user: authService.getCurrentUser(),
    isAuthenticated: authService.isAuthenticated(),
    loading: false,
    error: null,

    register: async (userData) => {
        set({ loading: true, error: null});
        try {
            const data = await authService.register(userData);
            set({
                user: data.user,
                isAuthenticated: true,
                loading: false,
            });
            return data;
        }catch (err){
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
  },
}));
export default useAuthStore;