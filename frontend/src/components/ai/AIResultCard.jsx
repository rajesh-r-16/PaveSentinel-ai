const AIResultCard = ({ ai }) => {

    if (!ai) return null;

    return (
        <div className="smart-glass rounded-2xl shadow-xl p-6 mt-8">

            {/* Title */}
            <h2 className="text-2xl font-bold text-blue-700 mb-6">
                🤖 AI Detection Result
            </h2>

            {/* Result Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Detection Information */}
                <div className="space-y-3">

                    <p>
                        <strong>Detected:</strong>{" "}
                        {ai.detected ? "Yes" : "No"}
                    </p>

                    <p>
                        <strong>Potholes:</strong>{" "}
                        {ai.count ?? 0}
                    </p>

                    <p>
                        <strong>Confidence:</strong>{" "}
                        {ai.confidence ?? 0}%
                    </p>

                    <p>
                        <strong>Severity:</strong>{" "}
                        {ai.severity ?? "N/A"}
                    </p>

                </div>

                {/* Priority Information */}
                <div className="space-y-3">

                    <p>
                        <strong>Priority:</strong>{" "}
                        {ai.priority?.level ?? "N/A"}
                    </p>

                    <p>
                        <strong>Priority Score:</strong>{" "}
                        {ai.priority?.score ?? 0}
                    </p>

                    <p>
                        <strong>Repair Time:</strong>{" "}
                        {ai.priority?.estimated_repair_time ?? "N/A"}
                    </p>

                </div>

            </div>

            {/* AI Summary */}
            <div className="mt-6">

                <h3 className="font-bold mb-2">
                    AI Summary
                </h3>

                <p className="text-gray-700">
                    {ai.summary ?? "No AI summary available."}
                </p>

            </div>

            {/* AI Output Image */}
            {ai.output_image && (
                <div className="mt-8">

                    <h3 className="font-bold mb-3">
                        AI Detection Image
                    </h3>

                    <img
                        src={`http://127.0.0.1:8000/${ai.output_image}`}
                        alt="AI Detection Output"
                        className="rounded-xl shadow-lg max-w-full"
                    />

                </div>
            )}

        </div>
    );
};

export default AIResultCard;