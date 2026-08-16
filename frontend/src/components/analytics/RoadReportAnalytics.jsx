import { useEffect, useState } from "react";
import SeverityChart from "./SeverityChart";
import StatusChart from "./StatusChart";

const RoadReportAnalytics = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        // Temporary analytics data
        // Replace this later with backend/API data

        const demoStats = {
            pending: 8,
            verified: 12,
            in_progress: 6,
            completed: 18,

            low: 10,
            medium: 20,
            high: 14
        };

        setTimeout(() => {
            setStats(demoStats);
            setLoading(false);
        }, 500);

    }, []);

    if (loading) {
        return (
            <div className="smart-glass rounded-2xl shadow-xl p-6">
                <h2 className="text-xl font-bold text-white">
                    📊 Road Report Analytics
                </h2>

                <p className="text-gray-300 mt-2">
                    Loading analytics...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="smart-glass rounded-2xl shadow-xl p-6">
                <h2 className="text-xl font-bold text-white">
                    📊 Road Report Analytics
                </h2>

                <p className="text-red-400 mt-2">
                    {error}
                </p>
            </div>
        );
    }

    return (
        <section className="w-full">

            {/* ANALYTICS HEADER */}

            <div className="smart-glass rounded-2xl shadow-xl p-6 mb-6">

                <h1 className="text-2xl font-bold text-white">
                    📊 Road Report Analytics
                </h1>

                <p className="text-gray-300 mt-2">
                    Overview of pothole reports, severity and resolution status.
                </p>

            </div>


            {/* CHARTS */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* STATUS CHART */}

                <StatusChart stats={stats} />


                {/* SEVERITY CHART */}

                <SeverityChart stats={stats} />

            </div>

        </section>
    );
};

export default RoadReportAnalytics;