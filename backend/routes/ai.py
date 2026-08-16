from fastapi import APIRouter, UploadFile, File, HTTPException
from PIL import Image
import io


router = APIRouter(
    prefix="/ai",
    tags=["AI Detection"]
)


@router.post("/detect")
async def detect_pothole(
    image: UploadFile = File(...)
):

    try:

        # ==============================
        # READ UPLOADED IMAGE
        # ==============================

        contents = await image.read()

        if not contents:
            raise HTTPException(
                status_code=400,
                detail="Uploaded image is empty."
            )


        # ==============================
        # VALIDATE IMAGE
        # ==============================

        try:

            img = Image.open(
                io.BytesIO(contents)
            )

            # Verify that PIL can actually read it
            img.verify()

            # Re-open after verify
            img = Image.open(
                io.BytesIO(contents)
            )

        except Exception:

            raise HTTPException(
                status_code=400,
                detail="Invalid image file."
            )


        # ==============================
        # IMAGE INFORMATION
        # ==============================

        width, height = img.size


        # ==============================
        # DEMO AI RESULT
        # ==============================

        # This is currently a DEMO prediction.
        # Replace this section later with
        # your trained ML/AI model.

        detected = True
        severity = "High"
        confidence = 92


        # ==============================
        # RECOMMENDATION
        # ==============================

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

        else:

            recommendation = (
                "Road condition appears acceptable, "
                "but periodic monitoring is recommended."
            )


        # ==============================
        # RESPONSE
        # ==============================

        return {

            "success": True,

            "detected": detected,

            "prediction": (
                "Pothole Detected"
                if detected
                else "No Pothole Detected"
            ),

            "severity": severity,

            "confidence": confidence,

            "recommendation": recommendation,

            "message": (
                "Pothole detected successfully."
                if detected
                else "No pothole detected."
            ),

            "image_width": width,

            "image_height": height,

            "filename": image.filename

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