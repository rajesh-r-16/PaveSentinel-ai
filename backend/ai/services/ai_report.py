def generate_ai_report(ai_result):

    confidence = ai_result["confidence"]

    severity = ai_result["severity"]

    count = ai_result["count"]

    if severity == "High":

        recommendation = (
            "Immediate repair required. "
            "This pothole poses a high risk to vehicles."
        )

    elif severity == "Medium":

        recommendation = (
            "Repair should be scheduled soon "
            "to prevent further road damage."
        )

    elif severity == "Low":

        recommendation = (
            "Minor pothole detected. "
            "Routine maintenance is recommended."
        )

    else:

        recommendation = (
            "No pothole detected."
        )

    summary = f"""
AI Detection Report

Potholes Detected : {count}

Confidence Score : {confidence}

Severity : {severity}

Recommendation : {recommendation}
"""

    return summary.strip()