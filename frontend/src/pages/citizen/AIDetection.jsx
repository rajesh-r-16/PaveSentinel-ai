import { useState } from "react";
import toast from "react-hot-toast";

import { detectPothole } from "../../services/aiService";

const AIDetection = () => {

    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);


    // ================================
    // HANDLE IMAGE SELECTION
    // ================================

    const handleFileChange = (event) => {

        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {

            toast.error(
                "Please select an image file."
            );

            return;
        }

        setSelectedFile(file);

        setPreview(
            URL.createObjectURL(file)
        );

        setResult(null);
    };



    const handleAnalyze = async () => {

        if (!selectedFile) {
            toast.error("Please upload an image first.");
            return;
        }

        try {

            setLoading(true);
            setResult(null);

            console.log(
                "Sending image to AI backend:",
                selectedFile.name
            );

            const data = await detectPothole(selectedFile);

            console.log(
                "AI Result:",
                data
            );

            setResult(data);

            toast.success(
                "AI detection completed"
            );

        } catch (error) {

            console.error(
                "AI Detection Error:",
                error
            );

            console.error(
                "Backend Response:",
                error.response?.data
            );

            const detail =
                error.response?.data?.detail;

            let message = "AI detection failed. Check your backend.";

            if (Array.isArray(detail)) {

                message = detail
                    .map((item) => item.msg)
                    .join(", ");

            } else if (typeof detail === "string") {

                message = detail;

            }

            toast.error(message);

        } finally {

            setLoading(false);

        }

    };



    // ================================
    // RESET
    // ================================

    const handleReset = () => {

        setSelectedFile(null);
        setPreview(null);
        setResult(null);

    };


    return (

        <div className="p-6">

            {/* =========================
                PAGE HEADER
            ========================= */}

            <div className="mb-6">

                <h1
                    className="text-3xl font-bold"
                    style={{
                        color: "#ffffff"
                    }}
                >
                    🤖 AI Pothole Detection
                </h1>

                <p
                    className="mt-2 text-lg"
                    style={{
                        color: "#b9d7e8"
                    }}
                >
                    Upload a road image and let AI
                    analyze the pothole severity.
                </p>

            </div>


            {/* =========================
                MAIN CARD
            ========================= */}

            <div
                className="smart-glass rounded-2xl shadow-xl p-6"
            >

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">


                    {/* =========================
                        LEFT - UPLOAD
                    ========================= */}

                    <div>

                        <h2
                            className="text-xl font-bold mb-4"
                            style={{
                                color: "#ffffff"
                            }}
                        >
                            📷 Upload Road Image
                        </h2>


                        <label
                            htmlFor="ai-image"
                            className="block cursor-pointer"
                        >

                            <div
                                className="border-2 border-dashed rounded-2xl p-8 text-center transition hover:bg-white/5"
                                style={{
                                    borderColor: "#38bdf8"
                                }}
                            >

                                {!preview ? (

                                    <>

                                        <div className="text-5xl mb-4">
                                            🖼️
                                        </div>

                                        <p
                                            className="text-lg font-semibold"
                                            style={{
                                                color: "#ffffff"
                                            }}
                                        >
                                            Click to upload image
                                        </p>

                                        <p
                                            className="text-sm mt-2"
                                            style={{
                                                color: "#a9c4d6"
                                            }}
                                        >
                                            JPG, JPEG or PNG
                                        </p>

                                    </>

                                ) : (

                                    <img
                                        src={preview}
                                        alt="Selected road"
                                        className="w-full h-64 object-cover rounded-xl"
                                    />

                                )}

                            </div>

                        </label>


                        <input
                            id="ai-image"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />


                        {selectedFile && (

                            <p
                                className="text-sm mt-3"
                                style={{
                                    color: "#b9d7e8"
                                }}
                            >
                                Selected file:{" "}

                                <strong>
                                    {selectedFile.name}
                                </strong>

                            </p>

                        )}


                        {/* BUTTONS */}

                        <div className="flex gap-3 mt-5">

                            <button
                                onClick={handleAnalyze}
                                disabled={
                                    !selectedFile ||
                                    loading
                                }
                                className="px-6 py-3 rounded-xl font-semibold transition"
                                style={{
                                    background:
                                        !selectedFile ||
                                        loading
                                            ? "#475569"
                                            : "#06b6d4",

                                    color: "#ffffff",

                                    cursor:
                                        !selectedFile ||
                                        loading
                                            ? "not-allowed"
                                            : "pointer"
                                }}
                            >

                                {loading
                                    ? "🔄 Analyzing..."
                                    : "🤖 Analyze Image"}

                            </button>


                            <button
                                onClick={handleReset}
                                className="px-6 py-3 rounded-xl font-semibold"
                                style={{
                                    background: "#1e3a52",
                                    color: "#ffffff"
                                }}
                            >
                                Reset
                            </button>

                        </div>

                    </div>


                    {/* =========================
                        RIGHT - RESULT
                    ========================= */}

                    <div>

                        <h2
                            className="text-xl font-bold mb-4"
                            style={{
                                color: "#ffffff"
                            }}
                        >
                            🧠 AI Detection Result
                        </h2>


                        {!result ? (

                            <div
                                className="rounded-2xl p-8 text-center h-full min-h-[300px] flex flex-col justify-center"
                                style={{
                                    background:
                                        "rgba(8, 30, 50, 0.75)",

                                    border:
                                        "1px solid rgba(56,189,248,0.35)"
                                }}
                            >

                                <div className="text-5xl mb-4">
                                    🤖
                                </div>

                                <p
                                    className="text-lg font-semibold"
                                    style={{
                                        color: "#ffffff"
                                    }}
                                >
                                    No analysis yet
                                </p>

                                <p
                                    className="text-sm mt-2"
                                    style={{
                                        color: "#9fb7c8"
                                    }}
                                >
                                    Upload an image and click
                                    Analyze Image.
                                </p>

                            </div>

                        ) : (

                            <div
                                className="rounded-2xl p-6"
                                style={{
                                    background:
                                        "rgba(8, 30, 50, 0.85)",

                                    border:
                                        "1px solid rgba(56,189,248,0.4)"
                                }}
                            >

                                {/* DETECTION */}

                                <div className="mb-5">

                                    <p
                                        className="text-sm"
                                        style={{
                                            color: "#9fb7c8"
                                        }}
                                    >
                                        Detection
                                    </p>

                                    <p
                                        className="text-2xl font-bold mt-1"
                                        style={{
                                            color: "#ffffff"
                                        }}
                                    >
                                        {result.detected
                                            ? "Pothole Detected"
                                            : "No Pothole Detected"}
                                    </p>

                                </div>


                                {/* SEVERITY */}

                                <div className="mb-5">

                                    <p
                                        className="text-sm"
                                        style={{
                                            color: "#9fb7c8"
                                        }}
                                    >
                                        Severity
                                    </p>

                                    <p
                                        className="text-2xl font-bold mt-1"
                                        style={{
                                            color:
                                                result.severity === "High"
                                                    ? "#ef4444"
                                                    : result.severity === "Medium"
                                                    ? "#f59e0b"
                                                    : "#22c55e"
                                        }}
                                    >
                                        {result.severity || "Unknown"}
                                    </p>

                                </div>


                                {/* CONFIDENCE */}

                                <div className="mb-5">

                                    <p
                                        className="text-sm"
                                        style={{
                                            color: "#9fb7c8"
                                        }}
                                    >
                                        AI Confidence
                                    </p>

                                    <p
                                        className="text-2xl font-bold mt-1"
                                        style={{
                                            color: "#22d3ee"
                                        }}
                                    >
                                        {result.confidence !== undefined
                                            ? `${result.confidence}%`
                                            : "N/A"}
                                    </p>

                                </div>


                                {/* RECOMMENDATION */}

                                <div>

                                    <p
                                        className="text-sm"
                                        style={{
                                            color: "#9fb7c8"
                                        }}
                                    >
                                        Recommendation
                                    </p>

                                    <p
                                        className="mt-2"
                                        style={{
                                            color: "#ffffff"
                                        }}
                                    >
                                        {result.recommendation ||
                                            "Review the detected road condition."}
                                    </p>

                                </div>

                            </div>

                        )}

                    </div>

                </div>

            </div>

        </div>

    );

};


export default AIDetection;