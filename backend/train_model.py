from ultralytics import YOLO

def train():

    model = YOLO("yolov8n.pt")

    model.train(
        data="datasets/pothole/data.yaml",
        epochs=50,
        imgsz=640,
        batch=8,
        workers=2,
        project="training",
        name="pothole_detector",
        device="cpu"
    )

if __name__ == "__main__":
    train()