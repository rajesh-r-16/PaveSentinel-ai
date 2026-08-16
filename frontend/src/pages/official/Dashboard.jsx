import { useState } from "react";
import { useNavigate } from "react-router-dom";

import OfficialReports from "../../components/official/OfficialReports";
import OfficialReportDetails from "../../components/official/OfficialReportDetails";

import OfficialSidebar from "./OfficialSidebar";

import { logoutUser } from "../../utils/auth";
import officialBg from "../../assets/backgrounds/official-bg.jpg";

const Dashboard = () => {

    const navigate = useNavigate();

    const [
        selectedReportId,
        setSelectedReportId
    ] = useState(null);


    const logout = () => {

        logoutUser();

        navigate("/login", {
            replace: true
        });

    };


    const handleUpdated = () => {

        setSelectedReportId(
            selectedReportId
        );

    };


    return (

        <div
            className="smart-pave-page smart-page-enter official-dashboard"
            style={{
                backgroundImage: `url(${officialBg})`,
            }}
        >

            {/* DARK OVERLAY */}
            <div className="smart-pave-overlay"></div>


            {/* Official Sidebar */}
            


            {/* Main Content */}
            <div className="smart-pave-content relative z-10 ml-64">


                {/* Header */}
                <header className="official-header">

                    

                </header>


                {/* Main */}
                <main className="max-w-7xl mx-auto p-6 bg-transparent">

                    {!selectedReportId ? (

                        <>

                            <div className="mb-8">

                                <h2 className="text-3xl font-bold text-white">
                                    Report Management
                                </h2>

                                <p className="text-slate-300 mt-2">
                                    Review, verify and manage citizen pothole reports.
                                </p>

                            </div>


                            <OfficialReports
                                onSelectReport={setSelectedReportId}
                            />

                        </>

                    ) : (

                        <OfficialReportDetails
                            reportId={selectedReportId}
                            onBack={() =>
                                setSelectedReportId(null)
                            }
                            onUpdated={handleUpdated}
                        />

                    )}

                </main>

            </div>

        </div>
    );
};

export default Dashboard;