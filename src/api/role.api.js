import axios from "axios";

const URL =
    process.env.NODE_ENV === "production"
        ? import.meta.env.VITE_BACKEND_URL
        : "http://localhost:4500/role";

const roleApi = axios.create({
    baseURL: URL,
});

// Interceptor para incluir el token en los encabezados de todas las solicitudes
roleApi.interceptors.request.use((config) => {
    const token = localStorage.getItem("access");
    if (token) {
        config.headers['x-access-token'] = token;
    }
    return config;
});

export const getRoles = () => roleApi.get("/");
export const getRole = (roleId) => roleApi.get(`/${roleId}/`);
export const createRole = (data) => roleApi.post("/", data);
export const updateRole = (roleId, data) => roleApi.put(`/${roleId}/`, data);
export const deleteRole = (roleId) => roleApi.delete(`/${roleId}/`);
