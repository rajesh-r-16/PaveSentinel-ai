import { useState } from "react";
import toast from "react-hot-toast";
import { createReport } from "../../services/reportService";
import AIResultCard from "../ai/AIResultCard";
import { useForm } from "react-hook-form";

const ReportForm = ({ onReportSubmitted }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm();

  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [aiResult, setAiResult] = useState(null);
  const [preview, setPreview] = useState(null);

  /* =====================================================
     IMAGE CHANGE
  ===================================================== */

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setImage(null);
      setPreview(null);
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp"
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Please select a JPG, PNG or WEBP image"
      );

      event.target.value = "";
      setImage(null);
      setPreview(null);

      return;
    }

    setImage(file);

    setPreview(
      URL.createObjectURL(file)
    );
  };

  /* =====================================================
     GET CURRENT LOCATION
  ===================================================== */

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error(
        "Geolocation is not supported by this browser"
      );

      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude =
          position.coords.latitude;

        const longitude =
          position.coords.longitude;

        setValue(
          "latitude",
          latitude,
          {
            shouldValidate: true
          }
        );

        setValue(
          "longitude",
          longitude,
          {
            shouldValidate: true
          }
        );

        toast.success(
          "Current location captured"
        );
      },

      (error) => {
        console.error(
          "Location error:",
          error
        );

        toast.error(
          "Unable to get your location"
        );
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  /* =====================================================
     SUBMIT REPORT
  ===================================================== */

  const submitReport = async (data) => {
    try {
      /* IMAGE VALIDATION */

      if (!image) {
        toast.error(
          "Please select a pothole image"
        );

        return;
      }

      /* LOCATION VALIDATION */

      if (!data.latitude) {
        toast.error(
          "Please enter or capture latitude"
        );

        return;
      }

      if (!data.longitude) {
        toast.error(
          "Please enter or capture longitude"
        );

        return;
      }

      /* FORM DATA */

      const formData = new FormData();

      formData.append(
        "image",
        image
      );

      formData.append(
        "latitude",
        data.latitude
      );

      formData.append(
        "longitude",
        data.longitude
      );

      formData.append(
        "address",
        address
      );

      formData.append(
        "description",
        description
      );

      /* DEBUG */

      console.log(
        "Submitting report..."
      );

      console.log(
        "Image:",
        image
      );

      console.log(
        "Latitude:",
        data.latitude
      );

      console.log(
        "Longitude:",
        data.longitude
      );

      console.log(
        "Address:",
        address
      );

      console.log(
        "Description:",
        description
      );

      /* API REQUEST */

      const response =
        await createReport(formData);

      console.log(
        "Report Response:",
        response
      );

      /* AI RESULT */

      setAiResult(
        response.data?.ai ||
        response.ai
      );

      /* REFRESH REPORTS */

      if (onReportSubmitted) {
        onReportSubmitted();
      }

      toast.success(
        "Report Submitted Successfully"
      );

    } catch (error) {

      console.error(
        "Report submission error:",
        error
      );

      console.error(
        "Backend response:",
        error.response?.data
      );

      toast.error(
        error.response?.data?.detail ||
        "Failed to submit report"
      );
    }
  };

  /* =====================================================
     RETURN UI
  ===================================================== */

  return (
    <div className="smart-report-form-card">

      <div className="smart-report-form-content">

        <form
          onSubmit={handleSubmit(submitReport)}
        >

          {/* =====================================================
              TITLE
          ===================================================== */}

          <h2 className="smart-report-form-title">
            📍 Report New Pothole
          </h2>


          {/* =====================================================
              IMAGE UPLOAD
          ===================================================== */}

          <div className="smart-file-upload">

            <label className="smart-form-label">
              Pothole Image
            </label>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="smart-file-input"
            />

            <p className="smart-form-help">
              Upload JPG, PNG or WEBP image
            </p>

          </div>


          {/* =====================================================
              IMAGE PREVIEW
          ===================================================== */}

          {preview && (
            <div className="smart-image-preview">

              <p className="smart-form-label">
                Image Preview
              </p>

              <img
                src={preview}
                alt="Selected pothole"
              />

            </div>
          )}


          {/* =====================================================
              ADDRESS
          ===================================================== */}

          <div className="smart-form-group">

            <label className="smart-form-label">
              Address
            </label>

            <input
              type="text"
              placeholder="Enter pothole location address..."
              className="smart-form-input"
              value={address}
              onChange={(e) =>
                setAddress(e.target.value)
              }
            />

          </div>


          {/* =====================================================
              DESCRIPTION
          ===================================================== */}

          <div className="smart-form-group">

            <label className="smart-form-label">
              Description
            </label>

            <textarea
              placeholder="Describe the pothole, road condition, location details..."
              className="smart-form-textarea"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              rows={4}
            />

          </div>


          {/* =====================================================
              CURRENT LOCATION BUTTON
          ===================================================== */}

          <button
            type="button"
            onClick={getCurrentLocation}
            className="smart-location-button"
          >
            📍 Use My Current Location
          </button>


          {/* =====================================================
              GPS COORDINATES CARD
          ===================================================== */}

          <div className="smart-location-card">

            {/* CARD HEADER */}

            <div className="smart-location-card-header">

              <div className="smart-location-icon">
                📍
              </div>

              <div>

                <h3 className="smart-location-card-title">
                  GPS Coordinates
                </h3>

                <p className="smart-location-card-subtitle">
                  Exact geographical location of the pothole
                </p>

              </div>

            </div>


            {/* =====================================================
                COORDINATE FIELDS
            ===================================================== */}

            <div className="smart-coordinate-grid">

              {/* LATITUDE */}

              <div className="smart-coordinate-box">

                <div className="smart-coordinate-label">

                  <span className="smart-coordinate-symbol">
                    ↕
                  </span>

                  Latitude

                </div>

                <input
                  type="number"
                  step="any"
                  placeholder="e.g. 12.9716"
                  {...register("latitude", {
                    required:
                      "Latitude required"
                  })}
                  className="smart-coordinate-input"
                />

                <span className="smart-coordinate-help">
                  North / South position
                </span>

                {errors.latitude && (
                  <span className="smart-coordinate-error">
                    {errors.latitude.message}
                  </span>
                )}

              </div>


              {/* LONGITUDE */}

              <div className="smart-coordinate-box">

                <div className="smart-coordinate-label">

                  <span className="smart-coordinate-symbol">
                    ↔
                  </span>

                  Longitude

                </div>

                <input
                  type="number"
                  step="any"
                  placeholder="e.g. 77.5946"
                  {...register("longitude", {
                    required:
                      "Longitude required"
                  })}
                  className="smart-coordinate-input"
                />

                <span className="smart-coordinate-help">
                  East / West position
                </span>

                {errors.longitude && (
                  <span className="smart-coordinate-error">
                    {errors.longitude.message}
                  </span>
                )}

              </div>

            </div>


            {/* =====================================================
                LOCATION INFO
            ===================================================== */}

            <div className="smart-location-info">

              <span className="smart-location-info-icon">
                🛰️
              </span>

              <span>
                Use{" "}
                <strong>
                  “Use My Current Location”
                </strong>{" "}
                to automatically capture your GPS coordinates.
              </span>

            </div>

          </div>


          {/* =====================================================
              SUBMIT BUTTON
          ===================================================== */}

          <div className="smart-submit-wrapper">

            <button
              type="submit"
              className="smart-button smart-submit-button"
            >
              Submit Report
            </button>

          </div>

        </form>

      </div>


      {/* =====================================================
          AI RESULT
      ===================================================== */}

      {aiResult && (
        <AIResultCard
          ai={aiResult}
        />
      )}

    </div>
  );
};

export default ReportForm;