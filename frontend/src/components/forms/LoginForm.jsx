import { useState } from "react";

import { useForm } from "react-hook-form";

import { useNavigate } from "react-router-dom";

import {
    FaEye,
    FaEyeSlash,
    FaSpinner
} from "react-icons/fa";

import toast from "react-hot-toast";

import api from "../../services/api";

import { saveUser } from "../../utils/auth";

const LoginForm = () => {

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);


    // =====================================================
    // LOGIN
    // =====================================================

    const onSubmit = async (data) => {

        setLoading(true);

        try {

            const formData = new URLSearchParams();

            formData.append(
                "username",
                data.email
            );

            formData.append(
                "password",
                data.password
            );


            const response = await api.post(
                "/auth/login",
                formData,
                {
                    headers: {
                        "Content-Type":
                            "application/x-www-form-urlencoded",
                    },
                }
            );


            console.log(
                "Login Response:",
                response.data
            );


            // =================================================
            // SAVE LOGIN INFORMATION
            // =================================================

            // =================================================
            // SAVE LOGIN INFORMATION
            // =================================================

            localStorage.setItem(
                "token",
                response.data.access_token
            );

            localStorage.setItem(
                "role",
                response.data.role
            );

            localStorage.setItem(
                "fullname",
                response.data.fullname || ""
            );

            localStorage.setItem(
                "email",
                response.data.email || ""
            );


            // =================================================
            // SAVE COMPLETE USER OBJECT
            // =================================================

            localStorage.setItem(
                "user",
                JSON.stringify({
                    fullname:
                        response.data.fullname || "",

                    email:
                        response.data.email || "",

                    role:
                        response.data.role || ""
                })
            );

            const role =
                response.data.role;


            saveUser(response.data);


            toast.success(
                "🎉 Login Successful"
            );


            console.log(
                "User Role:",
                role
            );


            // =================================================
            // ROLE BASED REDIRECTION
            // =================================================

            if (role === "Official") {

                navigate("/official");

            } else if (role === "Citizen") {

                navigate("/citizen");

            } else {

                toast.error(
                    "Unknown user role"
                );

            }


        } catch (error) {

            console.log(
                "Login Error:",
                error
            );


            toast.error(
                error.response?.data?.detail ||
                "Login Failed"
            );


        } finally {

            setLoading(false);

        }

    };


    return (

        <form
            onSubmit={handleSubmit(onSubmit)}
            className="login-form"
        >

            {/* =================================================
                EMAIL
            ================================================= */}

            <div className="input-group">

                <label>
                    Email Address
                </label>

                <input
                    type="email"
                    placeholder="Email Address"
                    {...register("email", {
                        required:
                            "Email is required",
                    })}
                />

                {errors.email && (

                    <p className="text-red-300 text-sm mt-1">

                        {errors.email.message}

                    </p>

                )}

            </div>


            {/* =================================================
                PASSWORD
            ================================================= */}

            <div className="input-group">

                <label>
                    Password
                </label>

                <div className="relative">

                    <input
                        type={
                            showPassword
                                ? "text"
                                : "password"
                        }
                        placeholder="Password"
                        {...register("password", {
                            required:
                                "Password is required",
                        })}
                    />


                    <button
                        type="button"
                        onClick={() =>
                            setShowPassword(
                                !showPassword
                            )
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-300"
                    >

                        {showPassword ? (
                            <FaEyeSlash />
                        ) : (
                            <FaEye />
                        )}

                    </button>

                </div>


                {errors.password && (

                    <p className="text-red-300 text-sm mt-1">

                        {errors.password.message}

                    </p>

                )}

            </div>


            {/* =================================================
                REMEMBER ME / FORGOT PASSWORD
            ================================================= */}

            <div className="login-options">

                <label className="flex items-center gap-2">

                    <input
                        type="checkbox"
                    />

                    Remember Me

                </label>


                <button
                    type="button"
                    className="forgot-btn"
                    onClick={() => {
                        console.log(
                            "Forgot Password clicked"
                        );
                    }}
                >

                    Forgot Password?

                </button>

            </div>


            {/* =================================================
                LOGIN BUTTON
            ================================================= */}

            <button
                type="submit"
                disabled={loading}
                className="sp-primary-btn login-btn"
            >

                {loading ? (

                    <>
                        <FaSpinner
                            className="animate-spin inline mr-2"
                        />

                        Logging In...
                    </>

                ) : (

                    "Login"

                )}

            </button>


            {/* =================================================
                REGISTER
            ================================================= */}

            <p className="register-text">

                Don't have an account?

                <button
                    type="button"
                    onClick={() =>
                        navigate("/register")
                    }
                    className="ml-2 text-cyan-300 hover:text-cyan-400 font-semibold"
                >

                    Register

                </button>

            </p>

        </form>

    );
};

export default LoginForm;