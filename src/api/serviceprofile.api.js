import axios from "axios";

const URL =
    process.env.NODE_ENV === "production"
        ? import.meta.env.VITE_BACKEND_URL
        : "http://localhost:4500/service-profile";

const authApi = axios.create({
    baseURL: 'http://localhost:4500/service-profile',
});

// Interceptor para incluir el token en los encabezados de todas las solicitudes
authApi.interceptors.request.use((config) => {
    const token = localStorage.getItem("access");
    if (token) {
        config.headers['x-access-token'] = token;
    }
    return config;
});

export const getServiceProfiles = () => authApi.get("/");
export const getServiceProfile = (serviceProfileId) => authApi.get(`/${serviceProfileId}/`);
export const createServiceProfile = (data) => authApi.post("/", data);
export const updateServiceProfile = (serviceProfileId, data) => authApi.put(`/${serviceProfileId}/`, data);
export const deleteServiceProfile = (serviceProfileId) => authApi.delete(`/${serviceProfileId}/`);