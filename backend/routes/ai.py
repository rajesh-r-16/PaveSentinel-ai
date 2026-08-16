from fastapi import APIRouter, UploadFile, File, HTTPException, Request
from PIL import Image
import io
import os
import uuid

from ai.services.detect_pothole import detect_pothole


router = APIRouter(
    prefix="/ai",
    tags=["AI Detection"]
)


@router.post("/detect")
async def detect_pothole_ai(
    request: Request,
    image: UploadFile = File(...)
):

    try:

        # ==========================================
        # 1. VALIDATE FILE TYPE
        # ==========================================

        allowed_types = [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "image/webp"
        ]

        if image.content_type not in allowed_types:

            raise HTTPException(
                status_code=400,
                detail="Only JPG, JPEG, PNG and WEBP images are allowed."
            )


        # ==========================================
        # 2. READ IMAGE
        # ==========================================

        contents = await image.read()

        if not contents:

            raise HTTPException(
                status_code=400,
                detail="Uploaded image is empty."
            )


        # ==========================================
        # 3. CHECK FILE SIZE
        # ==========================================

        MAX_FILE_SIZE = 10 * 1024 * 1024

        if len(contents) > MAX_FILE_SIZE:

            raise HTTPException(
                status_code=400,
                detail="Image size must be less than 10 MB."
            )


        # ==========================================
        # 4. VALIDATE IMAGE USING PIL
        # ==========================================

        try:

            img = Image.open(
                io.BytesIO(contents)
            )

            img.verify()

            img = Image.open(
                io.BytesIO(contents)
            )

            width, height = img.size

        except Exception:

            raise HTTPException(
                status_code=400,
                detail="Invalid image file."
            )


        # ==========================================
        # 5. CREATE TEMPORARY AI INPUT FOLDER
        # ==========================================

        input_folder = "ai/inputs"

        os.makedirs(
            input_folder,
            exist_ok=True
        )


        # ==========================================
        # 6. CREATE UNIQUE FILE NAME
        # ==========================================

        original_name = image.filename or "image.jpg"

        extension = os.path.splitext(
            original_name
        )[1].lower()

        if extension not in [
            ".jpg",
            ".jpeg",
            ".png",
            ".webp"
        ]:

            extension = ".jpg"


        unique_filename = (
            f"ai_{uuid.uuid4().hex}"
            f"{extension}"
        )


        input_path = os.path.join(
            input_folder,
            unique_filename
        )


        # ==========================================
        # 7. SAVE IMAGE
        # ==========================================

        with open(
            input_path,
            "wb"
        ) as file:

            file.write(contents)


        # ==========================================
        # 8. RUN REAL YOLO MODEL
        # ==========================================

        print(
            "AI Detection started:",
            unique_filename
        )

        ai_result = detect_pothole(
            input_path
        )


        print(
            "AI Detection completed:",
            ai_result
        )


        # ==========================================
        # 9. GET AI RESULTS
        # ==========================================

        detected = ai_result["detected"]

        count = ai_result["count"]

        confidence = ai_result["confidence"]

        severity = ai_result["severity"]

        output_image = ai_result["output_image"]


        # ==========================================
        # 10. GENERATE RECOMMENDATION
        # ==========================================

        if severity == "High":

            recommendation = (
                "Immediate road inspection and repair "
                "is recommended."
            )

        elif severity == "Medium":

            recommendation = (
                "Road maintenance should be scheduled "
                "as soon as possible."
            )

        elif severity == "Low":

            recommendation = (
                "Routine road maintenance is recommended."
            )

        else:

            recommendation = (
                "No pothole detected. "
                "Periodic monitoring is recommended."
            )


        # ==========================================
        # 11. CREATE OUTPUT IMAGE URL
        # ==========================================

        output_filename = os.path.basename(
            output_image
        )

        output_url = (
            str(request.base_url).rstrip("/")
            + "/ai/outputs/"
            + output_filename
        )


        # ==========================================
        # 12. RETURN RESPONSE
        # ==========================================

        return {

            "success": True,

            "detected": detected,

            "prediction": (
                "Pothole Detected"
                if detected
                else "No Pothole Detected"
            ),

            "count": count,

            "severity": severity,

            "confidence": round(
                confidence * 100,
                2
            ),

            "confidence_score": confidence,

            "recommendation": recommendation,

            "message": (
                "Pothole detected successfully."
                if detected
                else "No pothole detected."
            ),

            "image_width": width,

            "image_height": height,

            "filename": image.filename,

            "output_image": output_url

        }


    except HTTPException:

        raise


    except Exception as error:

        print(
            "AI Detection Error:",
            str(error)
        )

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )