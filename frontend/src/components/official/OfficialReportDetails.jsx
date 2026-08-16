import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import {
    getReportDetails,
    verifyReport,
    assignEngineer,
    updateRepairStatus,
    uploadRepairPhoto
} from "../../services/officialReportService";


const OfficialReportDetails = ({
    reportId,
    onBack,
    onUpdated
}) => {

    const [report, setReport] = useState(null);

    const [loading, setLoading] = useState(true);

    const [severity, setSeverity] = useState("Medium");

    const [verifyRemarks, setVerifyRemarks] = useState("");

    const [engineer, setEngineer] = useState("");

    const [status, setStatus] = useState("In Progress");

    const [remarks, setRemarks] = useState("");

    const [repairPhoto, setRepairPhoto] = useState(null);

    const loadDetails = async () => {

        try {

            setLoading(true);

            const data = await getReportDetails(
                reportId
            );

            setReport(data);

            setSeverity(
                data.complaint?.severity ||
                "Medium"
            );

        } catch (error) {

            console.error(error);

            toast.error(
                error.response?.data?.detail ||
                "Unable to load report"
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        loadDetails();

    }, [reportId]);


    const handleVerify = async () => {

        try {

            await verifyReport(
                reportId,
                severity,
                verifyRemarks
            );

            toast.success(
                "Report verified successfully"
            );

            await loadDetails();

            if (onUpdated) {
                onUpdated();
            }

        } catch (error) {

            toast.error(
                error.response?.data?.detail ||
                "Verification failed"
            );
        }
    };


    const handleAssign = async () => {

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

            await loadDetails();

            if (onUpdated) {
                onUpdated();
            }

        } catch (error) {

            toast.error(
                error.response?.data?.detail ||
                "Engineer assignment failed"
            );
        }
    };


    const handleStatusUpdate = async () => {

        try {

            await updateRepairStatus(
                reportId,
                status,
                remarks
            );

            toast.success(
                "Repair status updated"
            );

            await loadDetails();

            if (onUpdated) {
                onUpdated();
            }

        } catch (error) {

            toast.error(
                error.response?.data?.detail ||
                "Status update failed"
            );
        }
    };


    const handleRepairPhoto = async () => {

        if (!repairPhoto) {

            toast.error(
                "Select repair photo"
            );

            return;
        }

        try {

            await uploadRepairPhoto(
                reportId,
                repairPhoto
            );

            toast.success(
                "Repair photo uploaded"
            );

            setRepairPhoto(null);

            await loadDetails();

            if (onUpdated) {
                onUpdated();
            }

        } catch (error) {

            toast.error(
                error.response?.data?.detail ||
                "Photo upload failed"
            );
        }
    };


    if (loading) {

        return (
            <div className="smart-glass rounded-2xl p-10 text-center">

                Loading report...

            </div>
        );
    }


    if (!report) {

        return (
            <div className="smart-glass rounded-2xl p-10 text-center">

                Report not found.

            </div>
        );
    }


    const currentStatus =
        report.complaint?.status;


    return (

        <div className="space-y-6">

            <button
                onClick={onBack}
                className="bg-gray-700 hover:bg-gray-800 text-white px-5 py-2 rounded-lg"
            >
                ← Back to Reports
            </button>


            {/* Report Details */}

            <div className="smart-glass rounded-2xl shadow-lg p-6">

                <div className="flex justify-between">

                    <div>

                        <h2 className="text-2xl font-bold">
                            Report #{report.report_id}
                        </h2>

                        <p className="text-gray-500">
                            {report.citizen?.name}
                        </p>

                    </div>

                    <span className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold">
                        {currentStatus}
                    </span>

                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

                    <div>

                        <h3 className="font-bold">
                            Citizen
                        </h3>

                        <p>
                            {report.citizen?.name}
                        </p>

                        <p>
                            {report.citizen?.email}
                        </p>

                    </div>


                    <div>

                        <h3 className="font-bold">
                            Location
                        </h3>

                        <p>
                            {report.location?.address}
                        </p>

                        <p>
                            {report.location?.latitude},
                            {" "}
                            {report.location?.longitude}
                        </p>

                    </div>

                </div>


                <div className="mt-6">

                    <h3 className="font-bold">
                        Complaint
                    </h3>

                    <p className="mt-2">
                        {report.complaint?.description}
                    </p>

                </div>

            </div>


            {/* Verify */}

            {currentStatus === "Pending" && (

                <div className="smart-glass rounded-2xl shadow-lg p-6">

                    <h3 className="text-xl font-bold">
                        ✅ Verify Report
                    </h3>


                    <select
                        value={severity}
                        onChange={(e) =>
                            setSeverity(e.target.value)
                        }
                        className="border rounded-xl px-4 py-3 w-full mt-4"
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


                    <textarea
                        value={verifyRemarks}
                        onChange={(e) =>
                            setVerifyRemarks(e.target.value)
                        }
                        placeholder="Verification remarks"
                        className="border rounded-xl px-4 py-3 w-full mt-4"
                        rows="4"
                    />


                    <button
                        onClick={handleVerify}
                        className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl"
                    >
                        Verify Report
                    </button>

                </div>
            )}


            {/* Engineer Assignment */}

            {currentStatus === "Verified" && (

                <div className="smart-glass rounded-2xl shadow-lg p-6">

                    <h3 className="text-xl font-bold">
                        👷 Assign Engineer
                    </h3>


                    <input
                        value={engineer}
                        onChange={(e) =>
                            setEngineer(e.target.value)
                        }
                        placeholder="Engineer name"
                        className="border rounded-xl px-4 py-3 w-full mt-4"
                    />


                    <button
                        onClick={handleAssign}
                        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
                    >
                        Assign Engineer
                    </button>

                </div>
            )}


            {/* Repair Status */}

            {currentStatus === "In Progress" && (

                <div className="smart-glass rounded-2xl shadow-lg p-6">

                    <h3 className="text-xl font-bold">
                        🔧 Update Repair
                    </h3>


                    <select
                        value={status}
                        onChange={(e) =>
                            setStatus(e.target.value)
                        }
                        className="border rounded-xl px-4 py-3 w-full mt-4"
                    >

                        <option value="In Progress">
                            In Progress
                        </option>

                        <option value="Completed">
                            Completed
                        </option>

                    </select>


                    <textarea
                        value={remarks}
                        onChange={(e) =>
                            setRemarks(e.target.value)
                        }
                        placeholder="Repair remarks"
                        className="border rounded-xl px-4 py-3 w-full mt-4"
                        rows="4"
                    />


                    <button
                        onClick={handleStatusUpdate}
                        className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl"
                    >
                        Update Status
                    </button>

                </div>
            )}


            {/* Repair Photo */}

            {currentStatus === "Completed" && (

                <div className="smart-glass rounded-2xl shadow-lg p-6">

                    <h3 className="text-xl font-bold">
                        📸 Upload Repair Photo
                    </h3>


                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                            setRepairPhoto(
                                e.target.files?.[0] || null
                            )
                        }
                        className="mt-4"
                    />


                    <button
                        onClick={handleRepairPhoto}
                        className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl"
                    >
                        Upload Repair Photo
                    </button>

                </div>
            )}

        </div>
    );
};

export default OfficialReportDetails;