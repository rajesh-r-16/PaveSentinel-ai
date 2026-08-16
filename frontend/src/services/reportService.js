import api from "./api";

export const createReport = async (formData) => {

  const response = await api.post(
    "/report/create",
    formData
  );

  return response.data;
};

export const getMyReports = async () => {
  const response = await api.get("/report/my-reports");
  return response.data;
};

export const getCitizenDashboardStats = async () => {
    const response = await api.get("/dashboard/my-stats");
    return response.data;
};

export const getOfficialDashboardStats = async () => {
    const response = await api.get("/dashboard/stats");
    return response.data;
};

export const getMapReports = async () => {

    const response = await api.get(
        "/report/map"
    );

    return response.data;

};
export const searchReports = async(filters)=>{

    const response = await api.get(

        "/report/search",

        {

            params:filters

        }

    );

    return response.data;

};
export const getDashboardAnalytics = async () => {

    const response = await api.get(
        "/dashboard/analytics"
    );

    return response.data;
};
export const getOfficialReports = async () => {

    const response = await api.get(
        "/dashboard/reports"
    );

    return response.data;
};


export const getReportDetails = async (reportId) => {

    const response = await api.get(
        `/dashboard/report/${reportId}`
    );

    return response.data;
};


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
export const uploadRepairPhoto = async (
    reportId,
    image
) => {

    const formData = new FormData();

    formData.append(
        "image",
        image
    );

    const response = await api.put(
        `/dashboard/repair-photo/${reportId}`,
        formData
    );

    return response.data;
};