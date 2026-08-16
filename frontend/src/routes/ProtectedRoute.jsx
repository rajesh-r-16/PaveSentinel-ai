import { Navigate, useLocation } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";

const ProtectedRoute = ({ children }) => {

    const location = useLocation();

    const loggedIn = isLoggedIn();

    if (!loggedIn) {

        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from: location.pathname
                }}
            />
        );
    }

    return children;
};

export default ProtectedRoute;