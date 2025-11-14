import { useNavigate } from "react-router-dom";
import useNotificationStore from "../stores/notificationStore";

function NotificationPage() {
    const notifications = useNotificationStore((s) => s.notifications);
    const markAsRead = useNotificationStore((s) => s.markAsRead);
    const navigate = useNavigate();

    const handleNotificationClick = (notif) => {
        markAsRead(notif.id);

        if (
            notif.type === "RESERVATION_REQUEST" ||
            notif.type === "RESERVATION_CONFIRMED"
        ) {
            if (notif.relatedId) {
                navigate("/reservations");
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">알림</h1>
            <div className="bg-white rounded-lg shadow">
                <ul className="divide-y divide-gray-200">
                    {notifications.length === 0 ? (
                        <li className="p-6 text-center text-gray-500">
                            새 알림이 없습니다.
                        </li>
                    ) : (
                        notifications.map((notif) => (
                            <li
                                key={notif.id}
                                onClick={() => handleNotificationClick(notif)}
                                className={`p-6 cursor-pointer ${!notif.isRead
                                    ? "bg-blue-50 hover:bg-blue-100"
                                    : "hover:bg-gray-100"
                                    }`}
                            >
                                <div className="flex justify-between items-center">
                                    <p
                                        className={`text-sm font-medium ${!notif.isRead ? "text-gray-900" : "text-gray-600"
                                            }`}
                                    >
                                        {notif.message}
                                    </p>
                                    {!notif.isRead && (
                                        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                                    )}
                                </div>
                                <p
                                    className={`text-xs ${
                                        !notif.isRead ? "text-blue-600" : "text-gray-400"
                                    } mt-1`}
                                >
                                    {new Date(notif.createdAt).toLocaleString("ko-KR")}
                                </p>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    )
};

export default NotificationPage;