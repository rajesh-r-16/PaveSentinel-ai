import { useEffect } from "react";
import LoginForm from "../../components/forms/LoginForm";
import loginBg from "../../assets/backgrounds/login-bg.jpg";
import paveSentinelLogo from "../../assets/logo/pavesentinel-logo.png";
const Login = () => {

    useEffect(() => {

        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if (token) {

            if (role === "Official") {

                window.location.href = "/official";

            } else if (role === "Citizen") {

                window.location.href = "/citizen";

            }

        }

    }, []);

    return (

        <div
            className="login-page"
            style={{
                backgroundImage: `url(${loginBg})`
            }}
        >

            <div className="login-card smart-glass rounded-2xl p-8">

                {/* LOGO */}

                <div className="login-logo">
                    <img
                        src={paveSentinelLogo}
                        alt="PaveSentinel Logo"
                    />
                </div>


                {/* TITLE */}

                <h1>
                    PaveSentinel
                </h1>


                {/* SUBTITLE */}

                <p className="login-subtitle">
                    AI-Powered Intelligent Road Safety & Civic Road Management
                    <br />
                    Detect. Report. Resolve. Safer Roads.
                    
                </p>


                {/* EXISTING LOGIN FORM */}

                <LoginForm />

            </div>

        </div>

    );
};

export default Login;