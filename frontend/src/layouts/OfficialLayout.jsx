import { NavLink, Outlet, useNavigate } from "react-router-dom";
import paveSentinelLogo from "../assets/logo/pavesentinel-logo.png";
const OfficialLayout = () => {

    const navigate = useNavigate();

    const menuItems = [
        {
            name: "Dashboard",
            path: "/official",
            icon: "🏠",
            end: true
        },
        {
            name: "Reports",
            path: "/official/reports",
            icon: "📋"
        },
        {
            name: "Analytics",
            path: "/official/analytics",
            icon: "📊"
        }
    ];


    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("role");

        navigate("/login", {
            replace: true
        });

    };


    return (

        <div className="citizen-layout official-layout">

            {/* =====================================================
                SIDEBAR
            ===================================================== */}

            <aside className="citizen-sidebar official-sidebar">

                {/* =================================================
                    BRAND
                ================================================= */}

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
                            Official Portal
                        </span>

                    </div>

                </div>


                {/* =================================================
                    USER CARD
                ================================================= */}

                <div className="citizen-user-card">

                    <div className="citizen-avatar">
                        👤
                    </div>

                    <div>

                        <strong>
                            Official
                        </strong>

                        <small>
                            Road Safety Portal
                        </small>

                    </div>

                </div>


                {/* =================================================
                    NAVIGATION
                ================================================= */}

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


                {/* =================================================
                    BOTTOM SECTION
                ================================================= */}

                <div className="sidebar-bottom">

                    {/* HELP CARD */}

                    <div className="sidebar-help-card">

                        <span className="help-icon">
                            💡
                        </span>

                        <div>

                            <strong>
                                Manage road safety
                            </strong>

                            <small>
                                Review citizen reports
                            </small>

                        </div>

                    </div>


                    {/* LOGOUT */}

                    <button
                        className="official-logout-button"
                        onClick={handleLogout}
                    >
                        <span className="official-logout-icon">🚪</span>
                        <span className="official-logout-text">Logout</span>
                    </button>

                </div>

            </aside>


            {/* =====================================================
                MAIN CONTENT
            ===================================================== */}

            <main className="citizen-main official-main">

                {/* =================================================
                    TOPBAR
                ================================================= */}

                <header className="citizen-topbar">

                    <div>

                        <span className="topbar-label">
                            OFFICIAL PORTAL
                        </span>

                        <h2>
                            PaveSentinel AI
                        </h2>

                    </div>


                    <div className="topbar-status">

                        <span className="status-dot"></span>

                        System Online

                    </div>

                </header>


                {/* =================================================
                    PAGE CONTENT
                ================================================= */}

                <section className="citizen-content official-content">

                    <Outlet />

                </section>

            </main>

        </div>

    );

};


export default OfficialLayout;