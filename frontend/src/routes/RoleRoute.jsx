import { Navigate } from "react-router-dom";
import { getRole, isLoggedIn } from "../utils/auth";

const RoleRoute = ({ children, role }) => {

    if (!isLoggedIn()) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    const userRole = getRole();
    if (userRole === role) {
        return children;    
    }

    

    if (userRole === "Citizen") {

        return (
            <Navigate
                to="/citizen"
                replace
            />
        );
    }

    if (userRole === "Official") {

        return (
            <Navigate
                to="/official"
                replace
            />
        );
    }

    return (
        <Navigate
            to="/login"
            replace
        />
    );



};

export default RoleRoute;