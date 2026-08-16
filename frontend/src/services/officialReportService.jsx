import api from "./api";


// ======================================================
// GET ALL REPORTS
// ======================================================

export const getAllReports = async () => {

    const response = await api.get(
        "/dashboard/reports"
    );

    return response.data;
};


// ======================================================
// SEARCH REPORTS
// ======================================================

export const searchReports = async ({
    status,
    severity,
    address,
    citizen_name
}) => {

    const params = {};

    if (status) {
        params.status = status;
    }

    if (severity) {
        params.severity = severity;
    }

    if (address) {
        params.address = address;
    }

    if (citizen_name) {
        params.citizen_name = citizen_name;
    }

    const response = await api.get(
        "/dashboard/search",
        {
            params
        }
    );

    return response.data;
};


// ======================================================
// GET REPORT DETAILS
// ======================================================

export const getReportDetails = async (reportId) => {

    const response = await api.get(
        `/dashboard/report/${reportId}`
    );

    return response.data;
};


// ======================================================
// VERIFY REPORT
// ======================================================

export const verifyReport = async (
    reportId,
    severity,
    remarks
) => {

    const response = await api.put(
        `/dashboard/verify/${reportId}`,
        null,
        {
            params: {
                severity,
                remarks
            }
        }
    );

    return response.data;
};


// ======================================================
// ASSIGN ENGINEER
// ======================================================

export const assignEngineer = async (
    reportId,
    engineerName
) => {

    const response = await api.put(
        `/dashboard/assign/${reportId}`,
        null,
        {
            params: {
                engineer_name: engineerName
            }
        }
    );

    return response.data;
};


// ======================================================
// UPDATE REPAIR STATUS
// ======================================================

export const updateRepairStatus = async (
    reportId,
    status,
    remarks
) => {

    const response = await api.put(
        `/dashboard/status/${reportId}`,
        null,
        {
            params: {
                status,
                remarks
            }
        }
    );

    return response.data;
};


// ======================================================
// UPLOAD REPAIR PHOTO
// ======================================================

export const uploadRepairPhoto = async (
    reportId,
    file
) => {

    const formData = new FormData();

    formData.append(
        "image",
        file
    );

    const response = await api.put(
        `/dashboard/repair-photo/${reportId}`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );

    return response.data;
};