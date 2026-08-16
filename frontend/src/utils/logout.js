export function logout() {

    localStorage.removeItem("token");

    localStorage.removeItem("role");

    localStorage.removeItem("email");

    window.location.href = "/login";

}