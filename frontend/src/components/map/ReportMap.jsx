import {
    MapContainer,
    TileLayer,
    Marker,
    Popup
} from "react-leaflet";

import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import "leaflet/dist/leaflet.css";


// =====================================================
// LEAFLET DEFAULT MARKER FIX
// =====================================================

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});


// =====================================================
// REPORT MAP COMPONENT
// =====================================================

const ReportMap = ({ reports = [] }) => {

    console.log("Reports received by ReportMap:", reports);


    return (

        <div className="smart-map-card">

            {/* =================================================
                CARD HEADER
            ================================================= */}

            <div className="smart-map-card-header">

                <div>

                    <h2 className="smart-map-title">
                        📍 Live Pothole Map
                    </h2>

                    <p className="smart-map-subtitle">
                        View reported potholes and their exact locations
                    </p>

                </div>


                {/* REPORT COUNT */}

                <div className="smart-map-count">

                    <span className="smart-map-count-number">
                        {reports.length}
                    </span>

                    <span className="smart-map-count-label">
                        Reports
                    </span>

                </div>

            </div>


            {/* =================================================
                MAP
            ================================================= */}

            <div className="smart-map-container">

                <MapContainer

                    center={[12.9716, 77.5946]}

                    zoom={13}

                    scrollWheelZoom={true}

                    style={{
                        height: "500px",
                        width: "100%"
                    }}

                >

                    <TileLayer
                        attribution='&copy; OpenStreetMap contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />


                    {/* =================================================
                        REPORT MARKERS
                    ================================================= */}

                    {reports.map((report) => {

                        const latitude =
                            Number(report.latitude);

                        const longitude =
                            Number(report.longitude);


                        // Ignore invalid coordinates

                        if (
                            Number.isNaN(latitude) ||
                            Number.isNaN(longitude)
                        ) {
                            return null;
                        }


                        return (

                            <Marker

                                key={report.id}

                                position={[
                                    latitude,
                                    longitude
                                ]}

                            >

                                {/* =================================================
                                    SINGLE POPUP
                                ================================================= */}

                                <Popup>

                                    <div className="smart-map-popup">

                                        <h3 className="smart-map-popup-title">

                                            📍 {report.address ||
                                                "Pothole Report"}

                                        </h3>


                                        <div className="smart-map-popup-row">

                                            <strong>
                                                Description:
                                            </strong>

                                            <span>
                                                {report.description ||
                                                    "No description"}
                                            </span>

                                        </div>


                                        <div className="smart-map-popup-row">

                                            <strong>
                                                Status:
                                            </strong>

                                            <span>
                                                {report.status ||
                                                    "Unknown"}
                                            </span>

                                        </div>


                                        <div className="smart-map-popup-row">

                                            <strong>
                                                Severity:
                                            </strong>

                                            <span>
                                                {report.severity ||
                                                    "Not assigned"}
                                            </span>

                                        </div>


                                        <div className="smart-map-popup-row">

                                            <strong>
                                                Report ID:
                                            </strong>

                                            <span>
                                                #{report.id}
                                            </span>

                                        </div>

                                    </div>

                                </Popup>

                            </Marker>

                        );

                    })}

                </MapContainer>

            </div>


            {/* =================================================
                MAP FOOTER
            ================================================= */}

            <div className="smart-map-footer">

                <div className="smart-map-footer-item">

                    <span className="smart-map-footer-icon">
                        📍
                    </span>

                    <span>
                        Each marker represents a reported pothole
                    </span>

                </div>


                <div className="smart-map-footer-item">

                    <span className="smart-map-footer-icon">
                        🖱️
                    </span>

                    <span>
                        Click a marker to view report details
                    </span>

                </div>

            </div>

        </div>

    );

};


export default ReportMap;