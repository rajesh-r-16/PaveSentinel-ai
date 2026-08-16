import api from "./api";

const AuthService = {

    login(data) {

        return api.post(
            "/auth/login",
            data,
            {
                headers: {
                    "Content-Type":
                        "application/x-www-form-urlencoded"
                }
            }
        );

    },

    register(data) {

        return api.post(
            "/auth/register",
            data,
            {
                headers: {
                    "Content-Type":
                        "application/json"
                }
            }
        );

    }

};

export default AuthService;