import {
    FaHome,
    FaMapMarkedAlt,
    FaClipboardList,
    FaRobot,
    FaChartBar,
    FaCog,
    FaSignOutAlt
} from "react-icons/fa";

import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {

    const navigate = useNavigate();

    const handleLogout = () => {

        localStorage.clear();

        navigate("/login", {
            replace: true
        });

    };

    return (

        <div className="w-64 bg-slate-900 text-white h-screen fixed">

            <div className="p-6">

                <h1 className="text-2xl font-bold text-cyan-400">
                    PaveSentinel AI
                </h1>

            </div>

            <nav className="mt-10">

                {/* Dashboard */}

                <Link
                    to="/citizen"
                    className="flex items-center gap-3 px-6 py-4 hover:bg-cyan-600 cursor-pointer"
                >

                    <FaHome />

                    Dashboard

                </Link>


                {/* Reports */}

                <Link
                    to="/citizen/reports"
                    className="flex items-center gap-3 px-6 py-4 hover:bg-cyan-600 cursor-pointer"
                >

                    <FaClipboardList />

                    Reports

                </Link>


                {/* Map */}

                <Link
                    to="/citizen/map"
                    className="flex items-center gap-3 px-6 py-4 hover:bg-cyan-600 cursor-pointer"
                >

                    <FaMapMarkedAlt />

                    Map

                </Link>


                {/* AI Detection */}

                <Link
                    to="/citizen/ai-detection"
                    className="flex items-center gap-3 px-6 py-4 hover:bg-cyan-600 cursor-pointer"
                >

                    <FaRobot />

                    AI Detection

                </Link>


                {/* Analytics */}

                <Link
                    to="/citizen/analytics"
                    className="flex items-center gap-3 px-6 py-4 hover:bg-cyan-600 cursor-pointer"
                >

                    <FaChartBar />

                    Analytics

                </Link>


                

                {/* Logout */}

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-6 py-4 text-red-400 hover:bg-red-600 hover:text-white cursor-pointer"
                >

                    <FaSignOutAlt />

                    Logout

                </button>

            </nav>

        </div>

    );

};

export default Sidebar;