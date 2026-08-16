import { useEffect, useState } from "react";

import {
    getNotifications,
    markNotificationAsRead
} from "../../services/notificationService";


const NotificationPanel = () => {

    const [notifications, setNotifications] = useState([]);

    const [loading, setLoading] = useState(true);


    const loadNotifications = async () => {

        try {

            const data = await getNotifications();

            setNotifications(data);

        } catch (error) {

            console.error(
                "Notification loading failed:",
                error
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadNotifications();

    }, []);


    const handleRead = async (id) => {

        try {

            await markNotificationAsRead(id);

            setNotifications(
                notifications.map(
                    (notification) =>
                        notification.id === id
                            ? {
                                ...notification,
                                is_read: true
                            }
                            : notification
                )
            );

        } catch (error) {

            console.error(
                "Notification update failed:",
                error
            );

        }

    };


    return (

        <div className="smart-glass rounded-2xl shadow-xl p-6">

            <h2 className="text-xl font-bold mb-5">
                🔔 Notifications
            </h2>


            {loading && (

                <p className="smart-notification-status">
                    Loading notifications...
                </p>

            )}


            {!loading &&
                notifications.length === 0 && (

                <p className="smart-notification-status">
                    No notifications yet.
                </p>

            )}


            <div className="space-y-4">

                {notifications.map(
                    (notification) => (

                    <div
                        key={notification.id}
                        className={`smart-notification-card ${
                            !notification.is_read ? "unread" : ""
                        }`}
                    >

                        <div className="flex justify-between">

                            <h3 className="smart-notification-title">

                                {notification.title}

                            </h3>

                            {!notification.is_read && (

                                <span className="smart-notification-new">

                                    NEW

                                </span>

                            )}

                        </div>


                        <p className="smart-notification-message">

                            {notification.message}

                        </p>


                        {!notification.is_read && (

                            <button
                                onClick={() =>
                                    handleRead(
                                        notification.id
                                    )
                                }
                                className="smart-notification-read"
                            >

                                Mark as read

                            </button>

                        )}

                    </div>

                ))}

            </div>

        </div>

    );

};

export default NotificationPanel;