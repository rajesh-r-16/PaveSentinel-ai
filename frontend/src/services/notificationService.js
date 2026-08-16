import api from "./api";

export const getNotifications = async () => {

    const response = await api.get(
        "/notifications"
    );

    console.log(
        "Notifications API:",
        response.data
    );

    return response.data;
};


export const getUnreadNotificationCount = async () => {

    const response = await api.get(
        "/notifications/unread-count"
    );

    console.log(
        "Unread Count API:",
        response.data
    );

    return response.data;
};


export const markNotificationAsRead = async (
    notificationId
) => {

    const response = await api.put(
        `/notifications/${notificationId}/read`
    );

    return response.data;
};