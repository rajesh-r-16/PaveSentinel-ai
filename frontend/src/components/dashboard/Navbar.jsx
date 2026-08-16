import NotificationBell from "./NotificationBell";

const Navbar = () => {

    return (

        <header className="smart-glass shadow h-20 flex items-center justify-between px-8">

            <h2 className="text-2xl font-bold">
                Citizen Dashboard
            </h2>

            <div className="flex items-center gap-6">

                {/* Notification Bell */}
                <NotificationBell />

                {/* User Information */}
                <div>
                    <p className="font-bold">
                        {localStorage.getItem("fullname") || "Rajesh"}
                    </p>

                    <p className="text-sm text-gray-500">
                        {localStorage.getItem("role") || "Citizen"}
                    </p>
                </div>

            </div>

        </header>

    );

};

export default Navbar;