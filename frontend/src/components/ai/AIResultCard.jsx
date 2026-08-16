import { useEffect, useState } from "react";
import api from "../../services/api";

const AIResultCard = ({ ai, reportId }) => {

    const [aiData, setAiData] = useState(ai);
    const [processing, setProcessing] = useState(
        ai?.ai_status === "Processing" ||
        ai?.severity === "Processing"
    );

    useEffect(() => {

        if (!reportId) return;

        let interval;

        const checkAIResult = async () => {

            try {

                const response = await api.get(
                    `/report/${reportId}`
                );

                const report = response.data;

                // Check whether AI processing is complete
                if (
                    report.ai_detected &&
                    report.ai_detected !== "Processing"
                ) {

                    const convertedAI = {

                        detected:
                            report.ai_detected === "True" ||
                            report.ai_detected === "true",

                        count:
                            report.ai_detection_count ?? 0,

                        confidence:
                            report.ai_confidence ?? 0,

                        severity:
                            report.severity ?? "N/A",

                        summary:
                            report.ai_summary ??
                            "No AI summary available.",

                        output_image:
                            report.ai_output_image,

                        priority: {

                            level:
                                report.priority_level ??
                                "N/A",

                            score:
                                report.priority_score ?? 0,

                            estimated_repair_time:
                                report.estimated_repair_time ??
                                "N/A"

                        }

                    };

                    setAiData(convertedAI);

                    setProcessing(false);

                    // Stop polling
                    clearInterval(interval);
                }

            } catch (error) {

                console.error(
                    "AI result fetch error:",
                    error
                );

            }

        };

        // Check immediately
        checkAIResult();

        // Check every 2 seconds
        interval = setInterval(
            checkAIResult,
            2000
        );

        return () => {
            clearInterval(interval);
        };

    }, [reportId]);


    if (!aiData && !processing) {
        return null;
    }


    return (

        <div className="smart-glass rounded-2xl shadow-xl p-6 mt-8">

            {/* Title */}

            <h2 className="text-2xl font-bold text-blue-700 mb-6">
                🤖 AI Detection Result
            </h2>


            {/* Processing */}

            {processing ? (

                <div className="p-5 rounded-xl bg-blue-50">

                    <p className="font-semibold text-blue-700">
                        🤖 AI Analysis in Progress...
                    </p>

                    <p className="text-gray-600 mt-2">
                        Your report has been submitted successfully.
                        YOLO AI is analyzing the image.
                    </p>

                </div>

            ) : (

                <>

                    {/* Result Details */}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Detection Information */}

                        <div className="space-y-3">

                            <p>
                                <strong>Detected:</strong>{" "}
                                {aiData?.detected
                                    ? "Yes"
                                    : "No"}
                            </p>


                            <p>
                                <strong>Potholes:</strong>{" "}
                                {aiData?.count ?? 0}
                            </p>


                            <p>
                                <strong>Confidence:</strong>{" "}
                                {aiData?.confidence != null
                                    ? `${(aiData.confidence * 100).toFixed(1)}%`
                                    : "0%"}
                            </p>


                            <p>
                                <strong>Severity:</strong>{" "}
                                {aiData?.severity ?? "N/A"}
                            </p>

                        </div>


                        {/* Priority Information */}

                        <div className="space-y-3">

                            <p>
                                <strong>Priority:</strong>{" "}

                                {aiData?.priority?.level ??
                                    "N/A"}
                            </p>


                            <p>
                                <strong>
                                    Priority Score:
                                </strong>{" "}

                                {aiData?.priority?.score ??
                                    0}
                            </p>


                            <p>
                                <strong>
                                    Repair Time:
                                </strong>{" "}

                                {aiData?.priority
                                    ?.estimated_repair_time ??
                                    "N/A"}
                            </p>

                        </div>

                    </div>


                    {/* AI Summary */}

                    <div className="mt-6">

                        <h3 className="font-bold mb-2">
                            AI Summary
                        </h3>


                        <p className="text-gray-700 whitespace-pre-line">
                            {aiData?.summary ??
                                "No AI summary available."}
                        </p>

                    </div>


                    {/* AI Output Image */}

                    {aiData?.output_image && (

                        <div className="mt-8">

                            <h3 className="font-bold mb-3">
                                AI Detection Image
                            </h3>

                            <img
                                src={
                                    aiData.output_image.startsWith("http")
                                        ? aiData.output_image
                                        : `https://pavesentinel-api-5cbs.onrender.com/${
                                            aiData.output_image.startsWith("/")
                                                ? aiData.output_image.slice(1)
                                                : aiData.output_image
                                        }`
                                }
                                alt="AI Detection Output"
                                className="rounded-xl shadow-lg max-w-full"
                            />

                        </div>

                    )}

                </>

            )}

        </div>

    );

};

export default AIResultCard;