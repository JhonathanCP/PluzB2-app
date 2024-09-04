import axios from "axios";

const URL =
    process.env.NODE_ENV === "production"
        ? import.meta.env.VITE_BACKEND_URL
        : "http://localhost:4500/section";

const authApi = axios.create({
    baseURL: 'http://localhost:4500/section',
});

// Interceptor para incluir el token en los encabezados de todas las solicitudes
authApi.interceptors.request.use((config) => {
    const token = localStorage.getItem("access");
    if (token) {
        config.headers['x-access-token'] = token;
    }
    return config;
});

export const getSections = () => authApi.get("/");
export const getSection = (sectionId) => authApi.get(`/${sectionId}/`);
export const createSection = (data) => authApi.post("/", data);
export const updateSection = (sectionId, data) => authApi.put(`/${sectionId}/`, data);
export const deleteSection = (sectionId) => authApi.delete(`/${sectionId}/`);