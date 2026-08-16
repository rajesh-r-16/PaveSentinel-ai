from ultralytics import YOLO

model = YOLO("ai_models/best.pt")

def detect_potholes(image_path):

    results = model(image_path)

    # Save annotated image
    results[0].save()

    return results