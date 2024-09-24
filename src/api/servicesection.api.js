import axios from "axios";

const URL =
    process.env.NODE_ENV === "production"
        ? import.meta.env.VITE_BACKEND_URL
        : "http://localhost:4500/group";

const authApi = axios.create({
    baseURL: 'http://localhost:4500/service-section',
});

// Interceptor para incluir el token en los encabezados de todas las solicitudes
authApi.interceptors.request.use((config) => {
    const token = localStorage.getItem("access");
    if (token) {
        config.headers['x-access-token'] = token;
    }
    return config;
});

export const getServiceSections = () => authApi.get("/");
export const getServiceSection = (serviceSectionId) => authApi.get(`/${serviceSectionId}/`);
export const createServiceSection = (data) => authApi.post("/", data);
export const updateServiceSection = (serviceSectionId, data) => authApi.put(`/${serviceSectionId}/`, data);
export const deleteServiceSection = (serviceSectionId) => authApi.delete(`/${serviceSectionId}/`);