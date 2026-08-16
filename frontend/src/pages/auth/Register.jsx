import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/AuthService";
import { toast } from "react-hot-toast";
import paveSentinelLogo from "../../assets/logo/pavesentinel-logo.png";
const Register = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "Citizen"
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {

            toast.error("Passwords do not match");

            return;
        }

        if (formData.password.length < 6) {

            toast.error("Password must be at least 6 characters");

            return;
        }

        setLoading(true);

        try {

            const response = await AuthService.register({
                fullname: formData.fullname,
                email: formData.email,
                password: formData.password,
                role: formData.role
            });

            toast.success(
                response.data?.message || "Registration Successful"
            );

            setFormData({
                fullname: "",
                email: "",
                password: "",
                confirmPassword: "",
                role: "Citizen"
            });

            setTimeout(() => {
                navigate("/login");
            }, 1000);

        } catch (error) {

            const message =
                error.response?.data?.detail ||
                "Registration failed. Please try again.";

            toast.error(message);

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-800 via-cyan-700 to-slate-900 flex items-center justify-center p-6">

            <div className="w-full max-w-lg smart-glass rounded-2xl shadow-2xl border border-white/20 p-8">
                <div className="register-logo">
                    <img
                        src={paveSentinelLogo}
                        alt="PaveSentinel Logo"
                    />
                </div>
                <h1 className="text-4xl font-bold text-white text-center">
                    Create Account
                </h1>

                <p className="text-center text-slate-200 mt-2">
                    Join PaveSentinel AI
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="mt-8 space-y-5"
                >

                    {/* FULL NAME */}
                    <div>
                        <label className="block text-white mb-2">
                            Full Name
                        </label>

                        <input
                            type="text"
                            name="fullname"
                            value={formData.fullname}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            required
                            minLength={3}
                            maxLength={100}
                            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-300 outline-none focus:border-cyan-400"
                        />
                    </div>

                    {/* EMAIL */}
                    <div>
                        <label className="block text-white mb-2">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-300 outline-none focus:border-cyan-400"
                        />
                    </div>

                    {/* PASSWORD */}
                    <div>
                        <label className="block text-white mb-2">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter password"
                            required
                            minLength={6}
                            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-300 outline-none focus:border-cyan-400"
                        />
                    </div>

                    {/* CONFIRM PASSWORD */}
                    <div>
                        <label className="block text-white mb-2">
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm password"
                            required
                            minLength={6}
                            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-300 outline-none focus:border-cyan-400"
                        />
                    </div>

                    {/* ROLE */}
                    <div>
                        <label className="block text-white mb-2">
                            Account Type
                        </label>

                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white bg-slate-800 outline-none focus:border-cyan-400"
                        >
                            <option value="Citizen">
                                Citizen
                            </option>

                            <option value="Official">
                                Official
                            </option>
                        </select>
                    </div>

                    {/* REGISTER BUTTON */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading
                            ? "Creating Account..."
                            : "Create Account"}
                    </button>

                </form>

                {/* LOGIN LINK */}
                <p className="text-center text-slate-200 mt-6">

                    Already have an account?{" "}

                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="text-cyan-300 hover:text-cyan-200 font-semibold"
                    >
                        Login
                    </button>

                </p>

            </div>

        </div>
    );
};

export default Register;