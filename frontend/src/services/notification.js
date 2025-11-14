import api, { API_URL } from "./api";
import storageService from "./storage";
import EventSourcePolyfill from "eventsource-polyfill";

const notificationService = {
    async getNotifications() {
        try {
            const response = await api.get("/api/notifications", {
                params: {
                    _t: new Date().getTime(),
                }
            });
            return response.data;
        } catch (error) {
            console.error("알림 조회 실패: ", error);
            throw error;
        }
    },

    async markAsRead(notificationId) {
        try {
            await api.patch(`/api/notifications/${notificationId}/read`);
        } catch (error) {
            console.error("알림 읽음 처리 실패: ", error);
            throw error;
        }
    },

    connect() {
        const accessToken = storageService.getAccessToken();
        if (!accessToken) {
            return null;
        }

        const sse = new EventSourcePolyfill(
            `${API_URL}/api/notifications/subscribe`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                heartbeatTimeout: 86400000, 
            }
        );

        return sse;
    },
};

export default notificationService;