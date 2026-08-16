import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { createPortal } from "react-dom";

import {
    getNotifications,
    markNotificationAsRead
} from "../../services/notificationService";

import { useNavigate } from "react-router-dom";


const NotificationBell = () => {

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [open, setOpen] = useState(false);

    const navigate = useNavigate();


    // =========================================================
    // LOAD NOTIFICATIONS
    // =========================================================

    const loadNotifications = async () => {

        try {

            const notificationData = await getNotifications();

            console.log("========== NOTIFICATIONS ==========");
            console.log("API Response:", notificationData);

            // Handle different possible API response formats
            let notificationList = [];

            if (Array.isArray(notificationData)) {

                notificationList = notificationData;

            } else if (
                notificationData?.notifications &&
                Array.isArray(notificationData.notifications)
            ) {

                notificationList = notificationData.notifications;

            } else if (
                notificationData?.data &&
                Array.isArray(notificationData.data)
            ) {

                notificationList = notificationData.data;

            }

            console.log("Notification List:", notificationList);

            setNotifications(notificationList);

            // Calculate unread notifications
            const unread = notificationList.filter(
                notification => {

                    // Backend normally uses is_read
                    if (
                        notification.is_read !== undefined &&
                        notification.is_read !== null
                    ) {
                        return notification.is_read === false;
                    }

                    // Support isRead
                    if (
                        notification.isRead !== undefined &&
                        notification.isRead !== null
                    ) {
                        return notification.isRead === false;
                    }

                    // Support read
                    if (
                        notification.read !== undefined &&
                        notification.read !== null
                    ) {
                        return notification.read === false;
                    }

                    // If no read information exists,
                    // consider it unread
                    return true;
                }
            ).length;

            console.log("UNREAD COUNT:", unread);
            console.log("===================================");

            setUnreadCount(unread);

        } catch (error) {

            console.error(
                "Notification loading error:",
                error
            );

        }

    };


    // =========================================================
    // LOAD NOTIFICATIONS ON START + EVERY 10 SECONDS
    // =========================================================

    useEffect(() => {

        // Load immediately
        loadNotifications();

        // Refresh every 5 seconds
        const interval = setInterval(() => {
            loadNotifications();
        }, 5000);

        return () => {
            clearInterval(interval);
        };

    }, []);
    useEffect(() => {

        const handleVisibilityChange = () => {

            if (
                document.visibilityState === "visible"
            ) {
                loadNotifications();
            }

        };

        document.addEventListener(
            "visibilitychange",
            handleVisibilityChange
        );

        return () => {

            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );

        };

    }, []);


    // =========================================================
    // HANDLE NOTIFICATION CLICK
    // =========================================================

    const handleNotificationClick = async (
        notification
    ) => {

        try {

            if (!notification.is_read) {

                await markNotificationAsRead(
                    notification.id
                );

                const updatedNotifications =
                    notifications.map(item =>
                        item.id === notification.id
                            ? {
                                ...item,
                                is_read: true
                            }
                            : item
                    );

                setNotifications(
                    updatedNotifications
                );

                const unread =
                    updatedNotifications.filter(
                        item => !item.is_read
                    ).length;

                setUnreadCount(unread);

            }

            setOpen(false);

            if (notification.report_id) {

                navigate(
                    "/citizen/reports"
                );

            }

        } catch (error) {

            console.error(
                "Read notification error:",
                error
            );

        }

    };


    // =========================================================
    // NOTIFICATION PANEL
    // =========================================================

    const notificationPanel = open ? (

        <>
            {/* =================================================
                DARK BACKDROP
                ================================================= */}

            <div
                className="fixed inset-0 z-[99998]"
                style={{
                    backgroundColor:
                        "rgba(0, 0, 0, 0.35)"
                }}
                onClick={() => setOpen(false)}
            />


            {/* =================================================
                NOTIFICATION PANEL
                ================================================= */}

            <div
                className="fixed z-[99999]"
                style={{
                    top: "90px",
                    right: "35px",
                    width: "390px",
                    maxWidth: "calc(100vw - 30px)",
                    background: "#071c2d",
                    border: "1px solid #1b6685",
                    borderRadius: "18px",
                    boxShadow:
                        "0 25px 70px rgba(0,0,0,0.65)",
                    overflow: "hidden"
                }}
                onClick={(event) =>
                    event.stopPropagation()
                }
            >

                {/* =================================================
                    HEADER
                    ================================================= */}

                <div
                    style={{
                        padding: "18px 20px",
                        background: "#09263a",
                        borderBottom:
                            "1px solid #1b6685"
                    }}
                >

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent:
                                "space-between"
                        }}
                    >

                        <div>

                            <h3
                                style={{
                                    margin: 0,
                                    color: "#ffffff",
                                    fontSize: "20px",
                                    fontWeight: "700"
                                }}
                            >
                                🔔 Notifications
                            </h3>

                            <p
                                style={{
                                    margin:
                                        "5px 0 0",
                                    color: "#9fc4d8",
                                    fontSize: "13px"
                                }}
                            >
                                {unreadCount} unread notification
                                {unreadCount !== 1
                                    ? "s"
                                    : ""}
                            </p>

                        </div>


                        {/* CLOSE BUTTON */}

                        <button
                            type="button"
                            onClick={() =>
                                setOpen(false)
                            }
                            style={{
                                width: "34px",
                                height: "34px",
                                borderRadius: "50%",
                                border: "1px solid #2b718d",
                                background:
                                    "#10344b",
                                color: "#ffffff",
                                cursor: "pointer",
                                fontSize: "18px"
                            }}
                        >
                            ×
                        </button>

                    </div>

                </div>


                {/* =================================================
                    NOTIFICATION LIST
                    ================================================= */}

                <div
                    style={{
                        maxHeight: "430px",
                        overflowY: "auto",
                        background: "#071c2d"
                    }}
                >

                    {notifications.length === 0 ? (

                        <div
                            style={{
                                padding: "45px 20px",
                                textAlign: "center",
                                color: "#9fc4d8"
                            }}
                        >

                            <div
                                style={{
                                    fontSize: "38px",
                                    marginBottom: "10px"
                                }}
                            >
                                🔔
                            </div>

                            <p>
                                No notifications
                            </p>

                        </div>

                    ) : (

                        notifications.map(
                            notification => (

                                <button
                                    key={
                                        notification.id
                                    }
                                    type="button"
                                    onClick={() =>
                                        handleNotificationClick(
                                            notification
                                        )
                                    }
                                    style={{
                                        display: "block",
                                        width: "100%",
                                        textAlign: "left",
                                        padding:
                                            "16px 20px",
                                        border: "none",
                                        borderBottom:
                                            "1px solid #18394b",
                                        background:
                                            notification.is_read
                                                ? "#071c2d"
                                                : "#0b3047",
                                        cursor: "pointer"
                                    }}
                                >

                                    {/* MESSAGE */}

                                    <p
                                        style={{
                                            margin: 0,
                                            color: "#ffffff",
                                            fontSize: "14px",
                                            fontWeight:
                                                notification.is_read
                                                    ? "400"
                                                    : "600",
                                            lineHeight: "1.5"
                                        }}
                                    >
                                        {
                                            notification.message
                                        }
                                    </p>


                                    {/* TYPE */}

                                    <div
                                        style={{
                                            marginTop:
                                                "10px"
                                        }}
                                    >

                                        <span
                                            style={{
                                                display:
                                                    "inline-block",
                                                padding:
                                                    "4px 9px",
                                                borderRadius:
                                                    "999px",
                                                fontSize:
                                                    "11px",
                                                fontWeight:
                                                    "600",
                                                color:
                                                    notification.notification_type ===
                                                    "success"
                                                        ? "#86efac"
                                                        : notification.notification_type ===
                                                          "warning"
                                                        ? "#fde68a"
                                                        : notification.notification_type ===
                                                          "error"
                                                        ? "#fca5a5"
                                                        : "#7dd3fc",
                                                background:
                                                    notification.notification_type ===
                                                    "success"
                                                        ? "#14532d"
                                                        : notification.notification_type ===
                                                          "warning"
                                                        ? "#713f12"
                                                        : notification.notification_type ===
                                                          "error"
                                                        ? "#7f1d1d"
                                                        : "#0c4a6e"
                                            }}
                                        >
                                            {
                                                notification.notification_type ||
                                                "info"
                                            }
                                        </span>

                                    </div>


                                    {/* DATE */}

                                    <p
                                        style={{
                                            margin:
                                                "8px 0 0",
                                            color: "#7899aa",
                                            fontSize: "11px"
                                        }}
                                    >

                                        {
                                            notification.created_at
                                                ? new Date(
                                                    notification.created_at
                                                ).toLocaleString()
                                                : ""
                                        }

                                    </p>

                                </button>

                            )
                        )

                    )}

                </div>

            </div>

        </>

    ) : null;


    // =========================================================
    // RETURN
    // =========================================================

    return (

        <>

            {/* =================================================
                BELL BUTTON
                ================================================= */}

            <div
                className="relative z-[100000]"
            >

                <button
                    type="button"
                    className="smart-notification"
                    onClick={() =>
                        setOpen(
                            previous =>
                                !previous
                        )
                    }
                >

                    <Bell
                        className="bell-icon"
                        size={27}
                    />

                    {unreadCount > 0 && (

                        <span className="smart-notification-count">

                            {unreadCount > 99
                                ? "99+"
                                : unreadCount}

                        </span>

                    )}

                </button>

            </div>


            {/* =================================================
                PORTAL
                RENDERS OUTSIDE DASHBOARD STACKING CONTEXT
                ================================================= */}

            {createPortal(
                notificationPanel,
                document.body
            )}

        </>

    );

};


export default NotificationBell;