import { Link, useLocation } from "react-router-dom";
import paveSentinelLogo from "../../assets/logo/pavesentinel-logo.png";
const OfficialSidebar = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <aside className="smart-sidebar fixed left-0 top-0 h-screen w-64 text-white p-6 z-50">

            {/* LOGO */}
            <div className="brand-icon">
                <img
                    src={paveSentinelLogo}
                    alt="PaveSentinel Logo"
                />
            </div>
            <h1 className="text-2xl font-bold text-cyan-400 mb-2">
                PaveSentinel AI
            </h1>

            <p className="text-slate-400 mb-8">
                Official Portal
            </p>

            {/* NAVIGATION */}
            <nav className="space-y-3">

                <Link
                    to="/official"
                    className={`sidebar-item block px-4 py-3 ${
                        isActive("/official") ? "active" : ""
                    }`}
                >
                    🏠 Dashboard
                </Link>

                <Link
                    to="/official/reports"
                    className={`sidebar-item block px-4 py-3 ${
                        isActive("/official/reports") ? "active" : ""
                    }`}
                >
                    📋 Reports
                </Link>

                <Link
                    to="/official/analytics"
                    className={`sidebar-item block px-4 py-3 ${
                        isActive("/official/analytics") ? "active" : ""
                    }`}
                >
                    📊 Analytics
                </Link>

            </nav>

        </aside>
    );
};

export default OfficialSidebar;