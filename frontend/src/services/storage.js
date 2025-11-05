const storageKeys = {
    ACCESS_TOKEN: "accessToken",
    REFRESH_TOKEN: "refreshToken",
    USER: "user",
};

const storageService = {
    setUser: (userObject) => {
        localStorage.setItem(storageKeys.USER, JSON.stringify(userObject));
    },
    getAccessToken: () => localStorage.getItem(storageKeys.ACCESS_TOKEN),
    setAccessToken: (token) => localStorage.setItem(storageKeys.ACCESS_TOKEN, token),
    setRefreshToken: (token) => localStorage.setItem(storageKeys.REFRESH_TOKEN, token),
    clearAuth: () => {
        localStorage.removeItem(storageKeys.ACCESS_TOKEN);
        localStorage.removeItem(storageKeys.REFRESH_TOKEN);
        localStorage.removeItem(storageKeys.USER);
    },
};
export default storageService;