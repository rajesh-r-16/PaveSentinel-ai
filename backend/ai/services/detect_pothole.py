import os
import cv2
import time
from ai.services.yolo_loader import model


def calculate_severity(area):

    if area < 15000:
        return "Low"

    elif area < 50000:
        return "Medium"

    return "High"


def detect_pothole(image_path):

    start_time = time.perf_counter()

    results = model(
        image_path,
        imgsz=320,
        verbose=False
    )

    end_time = time.perf_counter()

    inference_time = end_time - start_time

    print(
        f"YOLO INFERENCE TIME: {inference_time:.2f} seconds"
    )

    output_folder = "ai/outputs"

    os.makedirs(output_folder, exist_ok=True)

    filename = os.path.basename(image_path)

    output_path = os.path.join(
        output_folder,
        filename

    )

    annotated = results[0].plot()

    cv2.imwrite(output_path, annotated)

    boxes = results[0].boxes

    detection_count = len(boxes)

    confidence = 0

    severity = "None"

    max_area = 0

    if detection_count > 0:

        confidence = float(boxes.conf.max())

        for box in boxes.xyxy:

            x1, y1, x2, y2 = box.tolist()

            area = (x2 - x1) * (y2 - y1)

            if area > max_area:
                max_area = area

        severity = calculate_severity(max_area)

    return {

        "detected": detection_count > 0,

        "count": detection_count,

        "confidence": round(confidence, 3),

        "severity": severity,

        "area": int(max_area),

        "output_image": output_path

    }