import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
    getOfficialReports,
    verifyReport,
    assignEngineer,
    updateRepairStatus,
    uploadRepairPhoto
} from "../../services/reportService";

const Reports = () => {

    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    const [severity, setSeverity] = useState("Medium");
    const [remarks, setRemarks] = useState("");
    const [engineer, setEngineer] = useState("");

    const [repairPhotos, setRepairPhotos] = useState({});

    // ==========================================
    // LOAD REPORTS
    // ==========================================

    const loadReports = async () => {

        try {

            setLoading(true);

            const data = await getOfficialReports();

            console.log("Official Reports:", data);

            setReports(data || []);

        } catch (error) {

            console.error("Load reports error:", error);

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


    // ==========================================
    // VERIFY REPORT
    // ==========================================

    const handleVerify = async (reportId) => {

        try {

            await verifyReport(
                reportId,
                severity,
                remarks
            );

            toast.success(
                "Report verified successfully"
            );

            setRemarks("");

            await loadReports();

        } catch (error) {

            console.error(error);

            toast.error(
                error.response?.data?.detail ||
                "Verification failed"
            );

        }

    };


    // ==========================================
    // ASSIGN ENGINEER
    // ==========================================

    const handleAssign = async (reportId) => {

        if (!engineer.trim()) {

            toast.error(
                "Enter engineer name"
            );

            return;
        }


        try {

            await assignEngineer(
                reportId,
                engineer
            );

            toast.success(
                "Engineer assigned successfully"
            );

            setEngineer("");

            await loadReports();

        } catch (error) {

            console.error(error);

            toast.error(
                error.response?.data?.detail ||
                "Engineer assignment failed"
            );

        }

    };


    // ==========================================
    // UPDATE REPAIR STATUS
    // ==========================================

    const handleStatus = async (
        reportId,
        status
    ) => {

        try {

            await updateRepairStatus(
                reportId,
                status,
                remarks
            );

            toast.success(
                "Status updated successfully"
            );

            setRemarks("");

            await loadReports();

        } catch (error) {

            console.error(error);

            toast.error(
                error.response?.data?.detail ||
                "Status update failed"
            );

        }

    };


    // ==========================================
    // REPAIR PHOTO UPLOAD
    // ==========================================

    const handleRepairPhotoUpload = async (
        reportId
    ) => {

        const image = repairPhotos[reportId];

        if (!image) {

            toast.error(
                "Please select a repaired road photo"
            );

            return;
        }


        try {

            await uploadRepairPhoto(
                reportId,
                image
            );

            toast.success(
                "Repaired road photo uploaded successfully"
            );

            setRepairPhotos(
                (previous) => ({
                    ...previous,
                    [reportId]: null
                })
            );

            await loadReports();

        } catch (error) {

            console.error(
                "Repair photo upload error:",
                error
            );

            toast.error(
                error.response?.data?.detail ||
                "Failed to upload repair photo"
            );

        }

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="official-reports-page">

                <div className="reports-loading">

                    <div className="loading-spinner">
                        ⟳
                    </div>

                    <h2>
                        Loading reports...
                    </h2>

                    <p>
                        Fetching citizen road reports
                    </p>

                </div>

            </div>

        );

    }


    // ==========================================
    // MAIN UI
    // ==========================================

    return (

        <div className="official-reports-page">


            {/* ====================================
                PAGE HEADER
            ==================================== */}

            <div className="reports-page-header">

                <div>

                    <div className="reports-title-row">

                        <span className="reports-title-icon">
                            🛣️
                        </span>

                        <h1>
                            Report Management
                        </h1>

                    </div>

                    <p>
                        Review, verify and manage citizen road reports
                    </p>

                </div>


                <button
                    onClick={loadReports}
                    className="reports-refresh-btn"
                >
                    ↻ &nbsp; Refresh
                </button>

            </div>


            {/* ====================================
                NO REPORTS
            ==================================== */}

            {reports.length === 0 ? (

                <div className="no-reports-card">

                    <div className="no-reports-icon">
                        📋
                    </div>

                    <h2>
                        No reports found
                    </h2>

                    <p>
                        There are currently no citizen road reports.
                    </p>

                </div>

            ) : (


                /* ====================================
                   REPORT LIST
                ==================================== */

                <div className="official-reports-list">

                    {reports.map((report) => (

                        <div
                            key={report.report_id}
                            className="official-report-card"
                        >


                            {/* ====================================
                                REPORT HEADER
                            ==================================== */}

                            <div className="report-header">

                                <div>

                                    <h3 className="report-number">
                                        Report #{report.report_id}
                                    </h3>

                                    <p className="citizen-name">
                                        {report.citizen_name}
                                    </p>

                                    <p className="citizen-email">
                                        {report.citizen_email}
                                    </p>

                                </div>


                                <span
                                    className={`report-status status-${report.status
                                        ?.toLowerCase()
                                        .replace(/\s+/g, "-")}`}
                                >
                                    {report.status}
                                </span>

                            </div>


                            {/* ====================================
                                IMAGE + INFORMATION
                            ==================================== */}

                            <div className="report-content-grid">


                                {/* IMAGE */}

                                <div className="report-image-section">

                                    {report.image ? (

                                        <img
                                            src={`http://127.0.0.1:8000/${report.image}`}
                                            alt="Road report"
                                            className="report-road-image"
                                        />

                                    ) : (

                                        <div className="no-report-image">
                                            📷
                                            <span>
                                                No road image available
                                            </span>
                                        </div>

                                    )}

                                </div>


                                {/* DETAILS */}

                                <div className="report-details">

                                    <div className="report-detail-item">

                                        <span className="detail-label">
                                            Address
                                        </span>

                                        <span className="detail-value">
                                            {report.address || "Not available"}
                                        </span>

                                    </div>


                                    <div className="report-detail-item">

                                        <span className="detail-label">
                                            Severity
                                        </span>

                                        <span
                                            className={`severity-badge severity-${report.severity
                                                ?.toLowerCase() || "unknown"}`}
                                        >
                                            {report.severity || "Not assigned"}
                                        </span>

                                    </div>


                                    <div className="report-detail-item">

                                        <span className="detail-label">
                                            Description
                                        </span>

                                        <span className="detail-value">
                                            {report.description || "No description provided"}
                                        </span>

                                    </div>


                                    <div className="report-detail-item">

                                        <span className="detail-label">
                                            Latitude
                                        </span>

                                        <span className="detail-value">
                                            {report.latitude}
                                        </span>

                                    </div>


                                    <div className="report-detail-item">

                                        <span className="detail-label">
                                            Longitude
                                        </span>

                                        <span className="detail-value">
                                            {report.longitude}
                                        </span>

                                    </div>

                                </div>

                            </div>


                            {/* ====================================
                                VERIFY REPORT
                            ==================================== */}

                            {report.status === "Pending" && (

                                <div className="report-action-section">

                                    <div className="action-title">
                                        <span>✓</span>
                                        Verify Report
                                    </div>


                                    <div className="action-grid">

                                        <div className="form-group">

                                            <label>
                                                Severity
                                            </label>

                                            <select
                                                value={severity}
                                                onChange={(e) =>
                                                    setSeverity(e.target.value)
                                                }
                                                className="report-input"
                                            >

                                                <option value="Low">
                                                    Low
                                                </option>

                                                <option value="Medium">
                                                    Medium
                                                </option>

                                                <option value="High">
                                                    High
                                                </option>

                                            </select>

                                        </div>


                                        <div className="form-group">

                                            <label>
                                                Verification Remarks
                                            </label>

                                            <input
                                                type="text"
                                                value={remarks}
                                                onChange={(e) =>
                                                    setRemarks(e.target.value)
                                                }
                                                placeholder="Enter verification remarks"
                                                className="report-input"
                                            />

                                        </div>

                                    </div>


                                    <button
                                        onClick={() =>
                                            handleVerify(
                                                report.report_id
                                            )
                                        }
                                        className="action-btn verify-btn"
                                    >
                                        ✓ &nbsp; Verify Report
                                    </button>

                                </div>

                            )}


                            {/* ====================================
                                ASSIGN ENGINEER
                            ==================================== */}

                            {report.status === "Verified" && (

                                <div className="report-action-section">

                                    <div className="action-title">
                                        <span>🔧</span>
                                        Assign Engineer
                                    </div>


                                    <div className="engineer-row">

                                        <input
                                            type="text"
                                            value={engineer}
                                            onChange={(e) =>
                                                setEngineer(e.target.value)
                                            }
                                            placeholder="Enter engineer name"
                                            className="report-input engineer-input"
                                        />


                                        <button
                                            onClick={() =>
                                                handleAssign(
                                                    report.report_id
                                                )
                                            }
                                            className="action-btn assign-btn"
                                        >
                                            Assign Engineer
                                        </button>

                                    </div>

                                </div>

                            )}


                            {/* ====================================
                                REPAIR STATUS
                            ==================================== */}

                            {report.status === "In Progress" && (

                                <div className="report-action-section">

                                    <div className="action-title">
                                        <span>🔧</span>
                                        Repair Status
                                    </div>


                                    <div className="form-group">

                                        <label>
                                            Repair Remarks
                                        </label>

                                        <input
                                            type="text"
                                            value={remarks}
                                            onChange={(e) =>
                                                setRemarks(e.target.value)
                                            }
                                            placeholder="Enter repair remarks"
                                            className="report-input"
                                        />

                                    </div>


                                    <button
                                        onClick={() =>
                                            handleStatus(
                                                report.report_id,
                                                "Completed"
                                            )
                                        }
                                        className="action-btn complete-btn"
                                    >
                                        ✓ &nbsp; Mark Completed
                                    </button>

                                </div>

                            )}


                            {/* ====================================
                                COMPLETED - UPLOAD PHOTO
                            ==================================== */}

                            {report.status === "Completed" && (

                                <div className="report-action-section">

                                    <div className="action-title">
                                        <span>📸</span>
                                        Repaired Road Photo
                                    </div>


                                    <p className="action-description">
                                        Upload a photo showing the road
                                        after the pothole has been repaired.
                                    </p>


                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {

                                            const file =
                                                e.target.files?.[0];

                                            setRepairPhotos(
                                                (previous) => ({
                                                    ...previous,
                                                    [report.report_id]: file
                                                })
                                            );

                                        }}
                                        className="file-input"
                                    />


                                    <button
                                        onClick={() =>
                                            handleRepairPhotoUpload(
                                                report.report_id
                                            )
                                        }
                                        className="action-btn upload-btn"
                                    >
                                        📤 &nbsp; Upload Repaired Road Photo
                                    </button>

                                </div>

                            )}


                            {/* ====================================
                                REPAIRED IMAGE
                            ==================================== */}

                            {report.repair_image && (

                                <div className="repair-photo-section">

                                    <div className="action-title">
                                        <span>✅</span>
                                        Repaired Road Photo
                                    </div>


                                    <img
                                        src={`http://127.0.0.1:8000/${report.repair_image}`}
                                        alt="Repaired road"
                                        className="repair-road-image"
                                    />


                                    {report.repair_image_uploaded_at && (

                                        <p className="upload-date">

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