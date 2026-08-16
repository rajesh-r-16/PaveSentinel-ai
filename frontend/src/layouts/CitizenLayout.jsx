import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Bell, UserCircle, X } from "lucide-react";

import NotificationPanel from "../components/notifications/NotificationPanel";
import NotificationBell from "../components/dashboard/NotificationBell";
import { useEffect, useState } from "react";
import paveSentinelLogo from "../assets/logo/pavesentinel-logo.png";
const CitizenLayout = () => {

    const navigate = useNavigate();

    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [userName, setUserName] = useState("Citizen");

    useEffect(() => {

        // =====================================================
        // GET CURRENT LOGGED-IN USER NAME
        // =====================================================

        const fullname =
            localStorage.getItem("fullname");

        const storedUser =
            localStorage.getItem("user");

        let currentName = fullname;


        // =====================================================
        // FALLBACK TO USER OBJECT
        // =====================================================

        if (!currentName && storedUser) {

            try {

                const user =
                    JSON.parse(storedUser);

                currentName =
                    user.fullname ||
                    user.full_name ||
                    user.name ||
                    user.username ||
                    user.email?.split("@")[0] ||
                    "Citizen";

            } catch (error) {

                console.error(
                    "Error reading user data:",
                    error
                );

            }

        }


        // =====================================================
        // SET USER NAME
        // =====================================================

        setUserName(
            currentName || "Citizen"
        );

    }, []);


    const menuItems = [

        {
            name: "Dashboard",
            path: "/citizen",
            icon: "🏠",
            end: true
        },

        {
            name: "Reports",
            path: "/citizen/reports",
            icon: "📋"
        },

        {
            name: "Map",
            path: "/citizen/map",
            icon: "🗺️"
        },

        {
            name: "AI Detection",
            path: "/citizen/ai-detection",
            icon: "🤖"
        },

        {
            name: "Analytics",
            path: "/citizen/analytics",
            icon: "📊"
        }

    ];


    const handleLogout = () => {

        // =====================================================
        // CLEAR CURRENT USER SESSION
        // =====================================================

        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("fullname");
        localStorage.removeItem("email");
        localStorage.removeItem("user");

        // =====================================================
        // RETURN TO LOGIN
        // =====================================================

        navigate("/login");

    };


    return (

        <div className="citizen-layout">


            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside className="citizen-sidebar">


                {/* BRAND */}

                <div className="citizen-brand">

                    <div className="brand-icon">
                        <img
                            src={paveSentinelLogo}
                            alt="PaveSentinel Logo"
                        />
                    </div>
                    <div>

                        <h1>
                            PaveSentinel
                        </h1>

                        <span>
                            Citizen Portal
                        </span>

                    </div>

                </div>


                {/* USER CARD */}

                <div className="citizen-user-card">

                    <div className="citizen-avatar">
                        👤
                    </div>

                    <div>

                        <strong>
                            Citizen
                        </strong>

                        <small>
                            Road Safety Portal
                        </small>

                    </div>

                </div>


                {/* NAVIGATION */}

                <nav className="citizen-navigation">

                    <p className="nav-title">
                        MAIN MENU
                    </p>


                    {menuItems.map((item) => (

                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.end}
                            className={({ isActive }) =>
                                `citizen-nav-item ${
                                    isActive
                                        ? "active"
                                        : ""
                                }`
                            }
                        >

                            <span className="nav-icon">
                                {item.icon}
                            </span>

                            <span>
                                {item.name}
                            </span>

                        </NavLink>

                    ))}

                </nav>


                {/* SIDEBAR BOTTOM */}

                <div className="sidebar-bottom">


                    {/* HELP CARD */}

                    <div className="sidebar-help-card">

                        <span className="help-icon">
                            💡
                        </span>

                        <div>

                            <strong>
                                Help improve roads
                            </strong>

                            <small>
                                Report damaged roads
                            </small>

                        </div>

                    </div>


                    {/* LOGOUT */}

                    <button
                        className="citizen-logout"
                        onClick={handleLogout}
                    >

                        <span>
                            🚪
                        </span>

                        Logout

                    </button>

                </div>

            </aside>


            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <main className="citizen-main">


                {/* =================================================
                    TOPBAR
                ================================================= */}

                <header className="citizen-topbar">


                    {/* LEFT */}

                    <div className="topbar-title">

                        <span className="topbar-label">
                            CITIZEN PORTAL
                        </span>

                        <h2>
                            PaveSentinel AI
                        </h2>

                    </div>


                    {/* RIGHT */}

                    <div className="citizen-topbar-actions">


                        {/* =========================================
                            NOTIFICATION
                        ========================================= */}

                        <div className="notification-wrapper">


                            <button
                                type="button"
                                className="smart-notification"
                                onClick={() =>
                                    setShowNotifications(
                                        !showNotifications
                                    )
                                }
                                aria-label="Notifications"
                            >

                                <Bell
                                    size={28}
                                    strokeWidth={2}
                                    className="bell-icon"
                                />


                                {unreadCount > 0 && (
                                    <span className="smart-notification-count">
                                        {unreadCount > 99 ? "99+" : unreadCount}
                                    </span>
                                )}

                            </button>


                            {/* NOTIFICATION PANEL */}

                            {showNotifications && (

                                <div className="citizen-notification-dropdown">


                                    <div className="citizen-notification-header">

                                        <div>

                                            <h3>
                                                Notifications
                                            </h3>

                                            <span>
                                                Recent road updates
                                            </span>

                                        </div>


                                        <button
                                            type="button"
                                            className="notification-close"
                                            onClick={() =>
                                                setShowNotifications(
                                                    false
                                                )
                                            }
                                        >

                                            <X size={18} />

                                        </button>

                                    </div>


                                    <div className="citizen-notification-content">

                                        <NotificationBell />

                                    </div>

                                </div>

                            )}

                        </div>


                        {/* =========================================
                            PROFILE
                        ========================================= */}

                        <div className="citizen-topbar-profile">

                            <UserCircle
                                size={44}
                                strokeWidth={1.8}
                            />

                            <div className="profile-details">

                                <strong>
                                    {userName}
                                </strong>

                                <span>
                                    Citizen
                                </span>

                            </div>

                        </div>


                        {/* =========================================
                            SYSTEM STATUS
                        ========================================= */}

                        <div className="topbar-status">

                            <span className="status-dot"></span>

                            System Online

                        </div>

                    </div>

                </header>


                {/* =================================================
                    PAGE CONTENT
                ================================================= */}

                <section className="citizen-content">

                    <Outlet />

                </section>


            </main>

        </div>

    );

};


export default CitizenLayout;