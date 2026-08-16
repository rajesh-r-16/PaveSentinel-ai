def calculate_priority(ai_result):

    confidence = ai_result["confidence"]

    severity = ai_result["severity"]

    count = ai_result["count"]

    score = 0

    # Severity weight
    if severity == "High":
        score += 50
    elif severity == "Medium":
        score += 30
    elif severity == "Low":
        score += 10

    # Confidence weight
    score += int(confidence * 30)

    # Number of potholes
    score += min(count * 10, 20)

    if score >= 80:
        level = "Critical"
        recommendation = "Repair immediately"
        repair_time = "Within 24 Hours"

    elif score >= 60:
        level = "High"
        recommendation = "Repair within 2 Days"
        repair_time = "48 Hours"

    elif score >= 40:
        level = "Medium"
        recommendation = "Schedule Repair"
        repair_time = "1 Week"

    else:
        level = "Low"
        recommendation = "Routine Maintenance"
        repair_time = "2 Weeks"

    return {
        "score": score,
        "level": level,
        "recommendation": recommendation,
        "repair_time": repair_time
    }