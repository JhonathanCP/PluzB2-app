import axios from "axios";

const URL =
    process.env.NODE_ENV === "production"
        ? import.meta.env.VITE_BACKEND_URL
        : "http://localhost:4500/group";

const authApi = axios.create({
    baseURL: 'http://localhost:4500/group-services',
});

// Interceptor para incluir el token en los encabezados de todas las solicitudes
authApi.interceptors.request.use((config) => {
    const token = localStorage.getItem("access");
    if (token) {
        config.headers['x-access-token'] = token;
    }
    return config;
});

export const getGroupServices = () => authApi.get("/");
export const getGroupService = (serviceId) => authApi.get(`/${serviceId}/`);
export const createGroupService = (data) => authApi.post("/", data);
export const updateGroupService = (serviceId, data) => authApi.put(`/${serviceId}/`, data);
export const deleteGroupService = (serviceId) => authApi.delete(`/${serviceId}/`);