import { FaUserCircle } from "react-icons/fa";
import NotificationBell from "../dashboard/NotificationBell";
const Navbar = () => {

    return (

        <div className="smart-glass shadow h-20 flex justify-between items-center px-8">

            <div>

                <h1 className="text-3xl font-bold">

                    Dashboard

                </h1>

            </div>

            <div className="flex items-center gap-8">

                <NotificationBell />

                <div className="flex items-center gap-3">

                    <FaUserCircle className="text-3xl" />

                    <div>

                        <p className="font-semibold">

                            {localStorage.getItem("fullname")}

                        </p>

                        <p className="text-gray-500 text-sm">

                            {localStorage.getItem("role")}

                        </p>

                    </div>

                </div>

            </div>

        </div>

    );

};

export default Navbar;