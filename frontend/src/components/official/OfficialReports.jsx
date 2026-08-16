import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import {
    getAllReports,
    searchReports
} from "../../services/officialReportService";


const OfficialReports = ({
    onSelectReport
}) => {

    const [reports, setReports] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [status, setStatus] = useState("");

    const [severity, setSeverity] = useState("");


    const loadReports = async () => {

        try {

            setLoading(true);

            const data = await getAllReports();

            setReports(data);

        } catch (error) {

            console.error(error);

            toast.error(
                error.response?.data?.detail ||
                "Unable to load reports"
            );

        } finally {

            setLoading(false);

        }
    };


    const handleSearch = async () => {

        try {

            setLoading(true);

            const data = await searchReports({

                status,

                severity,

                address: search

            });

            setReports(data);

        } catch (error) {

            console.error(error);

            toast.error(
                error.response?.data?.detail ||
                "Search failed"
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        loadReports();

    }, []);


    return (

        <div className="space-y-6">

            {/* Search and Filter */}

            <div className="smart-glass rounded-2xl shadow-lg p-6">

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                    <input
                        type="text"
                        placeholder="Search address..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        className="border rounded-xl px-4 py-3"
                    />


                    <select
                        value={status}
                        onChange={(e) =>
                            setStatus(e.target.value)
                        }
                        className="border rounded-xl px-4 py-3"
                    >

                        <option value="">
                            All Status
                        </option>

                        <option value="Pending">
                            Pending
                        </option>

                        <option value="Verified">
                            Verified
                        </option>

                        <option value="In Progress">
                            In Progress
                        </option>

                        <option value="Completed">
                            Completed
                        </option>

                    </select>


                    <select
                        value={severity}
                        onChange={(e) =>
                            setSeverity(e.target.value)
                        }
                        className="border rounded-xl px-4 py-3"
                    >

                        <option value="">
                            All Severity
                        </option>

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


                    <button
                        onClick={handleSearch}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 py-3 font-semibold"
                    >
                        🔍 Search
                    </button>

                </div>

            </div>


            {/* Reports */}

            {loading ? (

                <div className="smart-glass rounded-2xl p-10 text-center">

                    <p className="text-gray-500">
                        Loading reports...
                    </p>

                </div>

            ) : reports.length === 0 ? (

                <div className="smart-glass rounded-2xl p-10 text-center">

                    <p className="text-gray-500">
                        No reports found.
                    </p>

                </div>

            ) : (

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {reports.map((report) => (

                        <div
                            key={report.report_id}
                            className="smart-glass rounded-2xl shadow-lg overflow-hidden"
                        >

                            <div className="p-6">

                                <div className="flex justify-between items-start">

                                    <div>

                                        <h3 className="text-xl font-bold">
                                            Report #{report.report_id}
                                        </h3>

                                        <p className="text-gray-500 mt-1">
                                            {report.citizen_name}
                                        </p>

                                    </div>


                                    <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-semibold">
                                        {report.status}
                                    </span>

                                </div>


                                <div className="mt-5 space-y-2">

                                    <p>
                                        <strong>
                                            Address:
                                        </strong>{" "}
                                        {report.address}
                                    </p>

                                    <p>
                                        <strong>
                                            Severity:
                                        </strong>{" "}
                                        {report.severity}
                                    </p>

                                    <p>
                                        <strong>
                                            Description:
                                        </strong>{" "}
                                        {report.description}
                                    </p>

                                </div>


                                <button
                                    onClick={() =>
                                        onSelectReport(
                                            report.report_id
                                        )
                                    }
                                    className="smart-button px-4 py-2"
                                >
                                    View Report
                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
};

export default OfficialReports;