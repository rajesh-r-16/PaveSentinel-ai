import { NavLink } from "react-router-dom";

import {
    LayoutDashboard,
    FileText,
    Map,
    BarChart3
} from "lucide-react";

const Sidebar = () => {

    return (

        <aside className="smart-sidebar fixed left-0 top-0 h-screen w-72 p-6 z-50">

            {/* LOGO */}
            <div className="mb-8">

                <h1 className="text-2xl font-bold text-cyan-400">
                    🚧 PaveSentinel AI
                </h1>

                <p className="text-slate-400 mt-2">
                    Citizen Portal
                </p>

            </div>

            {/* NAVIGATION */}
            <nav className="space-y-3">

                {/* DASHBOARD */}
                <NavLink
                    to="/citizen"
                    end
                    className={({ isActive }) =>
                        `smart-menu-item flex items-center gap-3 px-4 py-3 ${
                            isActive ? "active" : ""
                        }`
                    }
                >
                    <span className="smart-icon">
                        <LayoutDashboard size={22} />
                    </span>

                    <span>
                        Dashboard
                    </span>

                </NavLink>


                {/* REPORTS */}
                <NavLink
                    to="/citizen/reports"
                    className={({ isActive }) =>
                        `smart-menu-item flex items-center gap-3 px-4 py-3 ${
                            isActive ? "active" : ""
                        }`
                    }
                >
                    <span className="smart-icon">
                        <FileText size={22} />
                    </span>

                    <span>
                        Reports
                    </span>

                </NavLink>


                {/* MAP */}
                <NavLink
                    to="/citizen/map"
                    className={({ isActive }) =>
                        `smart-menu-item flex items-center gap-3 px-4 py-3 ${
                            isActive ? "active" : ""
                        }`
                    }
                >
                    <span className="smart-icon">
                        <Map size={22} />
                    </span>

                    <span>
                        Map
                    </span>

                </NavLink>


                {/* ANALYTICS */}
                <NavLink
                    to="/citizen/analytics"
                    className={({ isActive }) =>
                        `smart-menu-item flex items-center gap-3 px-4 py-3 ${
                            isActive ? "active" : ""
                        }`
                    }
                >
                    <span className="smart-icon">
                        <BarChart3 size={22} />
                    </span>

                    <span>
                        Analytics
                    </span>

                </NavLink>

            </nav>

        </aside>

    );
};

export default Sidebar;