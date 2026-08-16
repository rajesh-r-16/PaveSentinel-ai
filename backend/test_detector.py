from app.ai.detector import detect_potholes

results = detect_potholes("test_images/pothole.jpg")

print(results)