import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000",
    timeout: 30000,
});


api.interceptors.request.use(
    (config) => {

        const token =
            localStorage.getItem("token");

        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;

        }

        return config;
    },

    (error) => {

        return Promise.reject(error);
    }
);


api.interceptors.response.use(

    (response) => {

        return response;
    },

    (error) => {

        console.error(
            "API ERROR:",
            error.response?.status,
            error.config?.url,
            error.response?.data
        );

        return Promise.reject(error);
    }
);


export default api;