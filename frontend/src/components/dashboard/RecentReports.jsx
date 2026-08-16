import { useEffect, useState } from "react";
import { getMyReports } from "../../services/reportService";

const RecentReports = () => {

    const [reports, setReports] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

    const loadReports = async () => {

        try {

            const data = await getMyReports();

            setReports(data);

        } catch (error) {

            console.error(
                "Failed to load recent reports:",
                error
            );

        } finally {

            setLoading(false);

        }

    };

    loadReports();

    }, []);

    const loadReports = async () => {
        try {
            const data = await getMyReports();
            console.log("Recent Reports:", data);
            setReports(data);
        } catch (error) {
            console.error("Failed to load reports:", error);
        }
    };

    return (
        <div className="smart-glass rounded-2xl shadow-md p-6 mt-6">

            <h2 className="text-2xl font-bold mb-6">
                My Reports
            </h2>

            {reports.length === 0 ? (
                <p className="text-gray-500">
                    No reports found.
                </p>
            ) : (

                <div className="overflow-x-auto">

                    <table className="w-full table-fixed border-collapse">

                        <thead>
                            <tr className="border-b-2 border-gray-200">

                                <th className="w-[15%] text-left px-4 py-3 font-bold">
                                    ID
                                </th>

                                <th className="w-[25%] text-left px-4 py-3 font-bold">
                                    Status
                                </th>

                                <th className="w-[25%] text-left px-4 py-3 font-bold">
                                    Severity
                                </th>

                                <th className="w-[35%] text-left px-4 py-3 font-bold">
                                    Address
                                </th>

                            </tr>
                        </thead>

                        <tbody>

                            {reports.map((report) => (

                                <tr
                                    key={report.id}
                                    className="border-b border-gray-100 hover:bg-gray-50"
                                >

                                    <td className="w-[15%] text-left px-4 py-3">
                                        {report.id}
                                    </td>

                                    <td className="w-[25%] text-left px-4 py-3">
                                        {report.status}
                                    </td>

                                    <td className="w-[25%] text-left px-4 py-3">
                                        {report.severity}
                                    </td>

                                    <td className="w-[35%] text-left px-4 py-3">
                                        {report.address}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            )}

        </div>
    );
};

export default RecentReports;