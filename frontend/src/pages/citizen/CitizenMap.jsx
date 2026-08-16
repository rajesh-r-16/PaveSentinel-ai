import { useEffect, useState } from "react";

import ReportMap from "../../components/map/ReportMap";

import {
    getMyReports
} from "../../services/reportService";


const CitizenMap = () => {

    const [reports, setReports] = useState([]);

    const [loading, setLoading] = useState(true);


    useEffect(() => {

        const loadReports = async () => {

            try {

                setLoading(true);

                const data = await getMyReports();

                console.log(
                    "Map Reports:",
                    data
                );

                setReports(
                    Array.isArray(data)
                        ? data
                        : []
                );

            } catch (error) {

                console.error(
                    "Failed to load map reports:",
                    error
                );

                setReports([]);

            } finally {

                setLoading(false);

            }

        };


        loadReports();

    }, []);


    return (

        <div className="p-6">

            <div className="smart-glass rounded-2xl shadow-xl p-6">

                


                {loading ? (

                    <div className="flex items-center justify-center h-[500px]">

                        <p className="text-white text-lg">
                            Loading pothole map...
                        </p>

                    </div>

                ) : (

                    <ReportMap
                        reports={reports}
                    />

                )}

            </div>

        </div>

    );

};


export default CitizenMap;