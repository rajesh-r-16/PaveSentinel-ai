import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";


// =========================
// OFFICIAL
// =========================

import Dashboard from "../pages/official/Dashboard";
import OfficialReports from "../pages/official/Reports";
import OfficialAnalytics from "../pages/official/Analytics";


// =========================
// CITIZEN
// =========================

import CitizenDashboard from "../pages/citizen/Dashboard";
import Reports from "../pages/citizen/Reports";
import AIDetection from "../pages/citizen/AIDetection";
import CitizenMap from "../pages/citizen/CitizenMap";


// =========================
// CITIZEN ANALYTICS
// =========================

import CitizenAnalytics from "../components/analytics/Analytics";


// =========================
// ROUTES / LAYOUT
// =========================

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";
import CitizenLayout from "../layouts/CitizenLayout";
import OfficialLayout from "../layouts/OfficialLayout";

const AppRoutes = () => {

    return (

        <BrowserRouter>

            <Routes>


                {/* =====================================
                    DEFAULT
                ===================================== */}

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />


                {/* =====================================
                    AUTHENTICATION
                ===================================== */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* =====================================
                    OFFICIAL LAYOUT
                ===================================== */}

                <Route
                    path="/official"
                    element={
                        <ProtectedRoute>

                            <RoleRoute role="Official">

                                <OfficialLayout />

                            </RoleRoute>

                        </ProtectedRoute>
                    }
                >

                    {/* ===============================
                        OFFICIAL DASHBOARD
                    =============================== */}

                    <Route
                        index
                        element={
                            <Dashboard />
                        }
                    />


                    {/* ===============================
                        OFFICIAL REPORTS
                    =============================== */}

                    <Route
                        path="reports"
                        element={
                            <OfficialReports />
                        }
                    />


                    {/* ===============================
                        OFFICIAL ANALYTICS
                    =============================== */}

                    <Route
                        path="analytics"
                        element={
                            <OfficialAnalytics />
                        }
                    />

                </Route>

                {/* =====================================
                    CITIZEN LAYOUT
                ===================================== */}

                <Route
                    path="/citizen"
                    element={
                        <ProtectedRoute>

                            <RoleRoute role="Citizen">

                                <CitizenLayout />

                            </RoleRoute>

                        </ProtectedRoute>
                    }
                >

                    {/* ===============================
                        CITIZEN DASHBOARD
                    =============================== */}

                    <Route
                        index
                        element={
                            <CitizenDashboard />
                        }
                    />


                    {/* ===============================
                        CITIZEN REPORTS
                    =============================== */}

                    <Route
                        path="reports"
                        element={
                            <Reports />
                        }
                    />


                    {/* ===============================
                        CITIZEN MAP
                    =============================== */}

                    <Route
                        path="map"
                        element={
                            <CitizenMap />
                        }
                    />


                    {/* ===============================
                        AI DETECTION
                    =============================== */}

                    <Route
                        path="ai-detection"
                        element={
                            <AIDetection />
                        }
                    />


                    {/* ===============================
                        CITIZEN ANALYTICS
                    =============================== */}

                    <Route
                        path="analytics"
                        element={
                            <CitizenAnalytics />
                        }
                    />

                </Route>


                {/* =====================================
                    404
                ===================================== */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>

    );

};


export default AppRoutes;