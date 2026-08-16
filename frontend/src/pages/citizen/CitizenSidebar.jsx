import {
    LayoutDashboard,
    FileText,
    Map,
    Bot,
    BarChart3,
    LogOut,
    User,
    ShieldCheck,
    ChevronRight
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";


const CitizenSidebar = () => {

    const navigate = useNavigate();


    const menuItems = [
        {
            name: "Dashboard",
            path: "/citizen",
            icon: LayoutDashboard
        },
        {
            name: "My Reports",
            path: "/citizen/reports",
            icon: FileText
        },
        {
            name: "Road Map",
            path: "/citizen/map",
            icon: Map
        },
        {
            name: "AI Detection",
            path: "/citizen/ai-detection",
            icon: Bot
        },
        {
            name: "Analytics",
            path: "/citizen/analytics",
            icon: BarChart3
        }
    ];


    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("role");

        navigate("/login");

    };


    return (

        <aside className="citizen-sidebar">

            {/* =====================================
                LOGO
            ===================================== */}

            <div className="citizen-logo">

                <div className="citizen-logo-icon">
                    🛣️
                </div>

                <div>
                    <h1>
                        Smart Pave
                    </h1>

                    <span>
                        SCAN
                    </span>
                </div>

            </div>


            {/* =====================================
                CITIZEN PROFILE CARD
            ===================================== */}

            <div className="citizen-profile-card">

                <div className="citizen-avatar">
                    <User size={22} />
                </div>

                <div className="citizen-profile-info">

                    <strong>
                        Citizen
                    </strong>

                    <span>
                        Road Reporter
                    </span>

                </div>

                <ShieldCheck
                    size={18}
                    className="citizen-verified-icon"
                />

            </div>


            {/* =====================================
                NAVIGATION TITLE
            ===================================== */}

            <div className="citizen-menu-title">
                MAIN MENU
            </div>


            {/* =====================================
                NAVIGATION
            ===================================== */}

            <nav className="citizen-navigation">

                {menuItems.map((item) => {

                    const Icon = item.icon;

                    return (

                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === "/citizen"}
                            className={({ isActive }) =>
                                `citizen-nav-card ${
                                    isActive
                                        ? "citizen-nav-active"
                                        : ""
                                }`
                            }
                        >

                            <div className="citizen-nav-icon">

                                <Icon size={21} />

                            </div>


                            <div className="citizen-nav-text">

                                <span>
                                    {item.name}
                                </span>

                            </div>


                            <ChevronRight
                                size={17}
                                className="citizen-nav-arrow"
                            />

                        </NavLink>

                    );

                })}

            </nav>


            {/* =====================================
                QUICK REPORT CARD
            ===================================== */}

            <div className="citizen-report-card">

                <div className="citizen-report-icon">
                    🤖
                </div>

                <div>

                    <strong>
                        Report a Pothole
                    </strong>

                    <span>
                        Help improve your road
                    </span>

                </div>

                <button
                    onClick={() =>
                        navigate("/citizen/reports")
                    }
                >
                    →
                </button>

            </div>


            {/* =====================================
                SIDEBAR BOTTOM
            ===================================== */}

            <div className="citizen-sidebar-bottom">

                <div className="citizen-online-status">

                    <span className="online-dot"></span>

                    <span>
                        System Online
                    </span>

                </div>


                <button
                    onClick={handleLogout}
                    className="citizen-logout-card"
                >

                    <div className="citizen-logout-icon">

                        <LogOut size={20} />

                    </div>

                    <span>
                        Logout
                    </span>

                </button>

            </div>

        </aside>

    );

};


export default CitizenSidebar;