import StatusChart from "../../components/analytics/StatusChart";
import SeverityChart from "../../components/analytics/SeverityChart";


const Analytics = () => {

    /*
        Temporary statistics.

        Later these values can come
        from your backend API.
    */

    const stats = {

        pending: 1,

        verified: 1,

        in_progress: 1,

        completed: 1,

        low: 10,

        medium: 20,

        high: 14

    };


    return (

        <div className="p-6">

            <div className="smart-glass rounded-2xl shadow-xl p-6">

                <h1 className="text-3xl font-bold text-white mb-2">
                    📊 Road Report Analytics
                </h1>

                <p className="text-gray-300 mb-6">
                    Analyze pothole reports, status and severity.
                </p>


                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                    <StatusChart
                        stats={stats}
                    />


                    <SeverityChart
                        stats={stats}
                    />

                </div>

            </div>

        </div>

    );

};


export default Analytics;