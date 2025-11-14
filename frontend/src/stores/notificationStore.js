import { create } from "zustand";
import notificationService from "../services/notification";

const initialState = {
    notifications: [],
    unreadCount: 0,
    sseConnection: null,
};

const useNotificationStore = create((set, get) => ({
    ...initialState,

    fetchNotifications: async () => {
        try {
            const data = await notificationService.getNotifications();
            const newUnreadCount = data.filter((n) => !n.isRead).length;
            set({ notifications: data, unreadCount: newUnreadCount });
        } catch (error) {
            console.error("Store: 알림 조회 실패", error);
        }
    },

    connectSse: () => {
        if (get().sseConnection) {
            return;
        }

        const sse = notificationService.connect();
        if (!sse) {
            console.log("access 토큰 없음");
            return;
        }

        set({ sseConnection: sse });

        sse.addEventListener("connect", (event) => {
            console.log("SSE 연결됨: ", event.data);
        });

        sse.addEventListener("newNotification", (event) => {
            const newNotification = JSON.parse(event.data);
            console.log("새 알림: ", newNotification);

            set((state) => ({
                notifications: [newNotification, ...state.notifications],
                unreadCount: state.unreadCount + 1,
            }));
        });

        sse.onerror = (error) => {
            console.error("SSE Error: ", error);
            sse.close();
            set({ sseConnection: null });
        };
    },

    disconnectSse: () => {
        const sse = get().sseConnection;
        if (sse) {
            sse.close();
            console.log("SSE 연결 종료");
        }

        set(initialState);
    },

    markAsRead: async (notificationId) => {
        const notification = get().notifications.find(n => n.id === notificationId);

        if (!notification || notification.isRead) {
            return;
        }

        try {
            set((state) => ({
                notifications: state.notifications.map((n) =>
                    n.id === notificationId ? { ...n, isRead: true } : n
                ),
                unreadCount: Math.max(0, state.unreadCount - 1),
            }));

            await notificationService.markAsRead(notificationId);
        } catch (error) {
            console.error("알림 읽음 처리 실패: ", error);
            set((state) => ({
                notifications: state.notifications.map((n) =>
                    n.id === notificationId ? { ...n, isRead: false } : n
                ),
                unreadCount: state.unreadCount + 1,
            }));
        }
    },
}));

export default useNotificationStore;