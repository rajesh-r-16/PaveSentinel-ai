import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
    getMyReports
} from "../../services/reportService";

const Reports = () => {

    const [reports, setReports] = useState([]);

    const [loading, setLoading] = useState(true);


    const loadReports = async () => {

        try {

            setLoading(true);

            const data = await getMyReports();

            console.log(
                "Citizen Reports:",
                data
            );

            setReports(data);

        } catch (error) {

            console.error(
                "Failed to load reports:",
                error
            );

            toast.error(
                error.response?.data?.detail ||
                "Failed to load reports"
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadReports();

    }, []);


    const getStatusClass = (status) => {

        switch (status) {

            case "Pending":
                return "smart-status-pending";

            case "Verified":
                return "smart-status-verified";

            case "In Progress":
                return "smart-status-progress";

            case "Completed":
                return "smart-status-completed";

            default:
                return "smart-status-default";
        }

    };


    if (loading) {

        return (
            <div className="smart-loading-container">

                <p className="smart-loading-text">
                    Loading your reports...
                </p>

            </div>
        );

    }


    return (

        <div className="smart-reports-page p-6">

            {/* =====================================================
                PAGE HEADER
            ===================================================== */}

            <div className="smart-reports-header">

                <div>

                    <h1 className="smart-reports-title">
                        My Reports
                    </h1>

                    <p className="smart-reports-subtitle">
                        Track your submitted road reports
                    </p>

                </div>


                <button
                    onClick={loadReports}
                    className="smart-refresh-button"
                >
                    Refresh
                </button>

            </div>


            {/* =====================================================
                NO REPORTS
            ===================================================== */}

            {reports.length === 0 ? (

                <div className="smart-glass smart-empty-reports">

                    <h2 className="smart-empty-title">
                        No Reports Found
                    </h2>

                    <p className="smart-empty-description">
                        You haven't submitted any road reports yet.
                    </p>

                </div>

            ) : (

                <div className="grid gap-6">

                    {reports.map((report) => (

                        <div
                            key={report.id}
                            className="smart-glass smart-report-card rounded-2xl shadow-lg p-6 mb-6"
                        >

                            {/* =================================================
                                REPORT HEADER
                            ================================================= */}

                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">

                                <div>

                                    <h2 className="smart-report-title">
                                        Report #{report.id}
                                    </h2>

                                    <p className="smart-report-address">
                                        {report.address || "Address not provided"}
                                    </p>

                                </div>


                                <span
                                    className={`inline-flex w-fit px-5 py-2 rounded-full font-semibold ${getStatusClass(report.status)}`}
                                >
                                    {report.status}
                                </span>

                            </div>


                            {/* =================================================
                                ORIGINAL PHOTO
                            ================================================= */}

                            <div className="mb-6">

                                <h3 className="smart-photo-title">
                                    📷 Original Pothole Photo
                                </h3>


                                {report.image ? (

                                    <img
                                        src={`http://127.0.0.1:8000/${report.image}`}
                                        alt="Original pothole"
                                        className="w-full max-h-[500px] object-cover rounded-xl shadow-md"
                                    />

                                ) : (

                                    <div className="smart-no-image">
                                        No original image available
                                    </div>

                                )}

                            </div>


                            {/* =================================================
                                REPORT DETAILS
                            ================================================= */}

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">

                                {/* DESCRIPTION */}

                                <div className="smart-report-detail">

                                    <p className="smart-detail-label">
                                        Description
                                    </p>

                                    <p className="smart-detail-value">
                                        {report.description || "Not provided"}
                                    </p>

                                </div>


                                {/* SEVERITY */}

                                <div className="smart-report-detail">

                                    <p className="smart-detail-label">
                                        Severity
                                    </p>

                                    <p className="smart-detail-value smart-severity-value">
                                        {report.severity || "Not assigned"}
                                    </p>

                                </div>


                                {/* LOCATION */}

                                <div className="smart-report-detail">

                                    <p className="smart-detail-label">
                                        Location
                                    </p>

                                    <p className="smart-detail-value smart-location-value break-words">
                                        {report.latitude}, {report.longitude}
                                    </p>

                                </div>

                            </div>


                            {/* =================================================
                                REPAIRED PHOTO
                            ================================================= */}

                            {report.repair_image && (

                                <div className="smart-repaired-section">

                                    {/* REPAIR HEADER */}

                                    <div className="flex items-center gap-2 mb-4">

                                        <span className="smart-repaired-icon">
                                            ✅
                                        </span>

                                        <h3 className="smart-repaired-title">
                                            Road Repaired
                                        </h3>

                                    </div>


                                    {/* REPAIRED PHOTO TITLE */}

                                    <h4 className="smart-repaired-photo-title">
                                        Repaired Road Photo
                                    </h4>


                                    {/* REPAIRED IMAGE */}

                                    <img
                                        src={`http://127.0.0.1:8000/${report.repair_image}`}
                                        alt="Repaired road"
                                        className="w-full max-h-[500px] object-cover rounded-xl shadow-md"
                                    />


                                    {/* REPAIR DESCRIPTION */}

                                    <p className="smart-repaired-description">
                                        Repaired road photo uploaded by official.
                                    </p>


                                    {/* UPLOAD DATE */}

                                    {report.repair_image_uploaded_at && (

                                        <p className="smart-repaired-date">

                                            Uploaded on:{" "}

                                            {new Date(
                                                report.repair_image_uploaded_at
                                            ).toLocaleString()}

                                        </p>

                                    )}

                                </div>

                            )}

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

};

export default Reports;