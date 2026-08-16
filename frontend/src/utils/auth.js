export const saveUser = (data) => {

    if (data.access_token) {
        localStorage.setItem(
            "token",
            data.access_token
        );
    }

    if (data.role) {
        localStorage.setItem(
            "role",
            data.role
        );
    }

    if (data.fullname) {
        localStorage.setItem(
            "fullname",
            data.fullname
        );
    }

    if (data.email) {
        localStorage.setItem(
            "email",
            data.email
        );
    }

    if (data.user_id) {
        localStorage.setItem(
            "user_id",
            data.user_id
        );
    }
};


export const logoutUser = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("fullname");
    localStorage.removeItem("email");
    localStorage.removeItem("user_id");
};


export const getToken = () => {

    return localStorage.getItem("token");
};


export const getRole = () => {

    return localStorage.getItem("role");
};


export const getCurrentUser = () => {

    return {
        token: localStorage.getItem("token"),
        role: localStorage.getItem("role"),
        fullname: localStorage.getItem("fullname"),
        email: localStorage.getItem("email"),
        user_id: localStorage.getItem("user_id"),
    };
};


export const isLoggedIn = () => {

    return Boolean(
        localStorage.getItem("token")
    );
};