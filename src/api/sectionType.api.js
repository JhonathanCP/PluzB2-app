import axios from "axios";

const URL =
    process.env.NODE_ENV === "production"
        ? import.meta.env.VITE_BACKEND_URL
        : "http://localhost:4500/sectiontype";

const sectionTypeApi = axios.create({
    baseURL: URL,
});

// Interceptor para incluir el token en los encabezados de todas las solicitudes
sectionTypeApi.interceptors.request.use((config) => {
    const token = localStorage.getItem("access");
    if (token) {
        config.headers['x-access-token'] = token;
    }
    return config;
});

export const getSectionTypes = () => sectionTypeApi.get("/");
export const getSectionType = (sectionTypeId) => sectionTypeApi.get(`/${sectionTypeId}/`);
export const createSectionType = (data) => sectionTypeApi.post("/", data);
export const updateSectionType = (sectionTypeId, data) => sectionTypeApi.put(`/${sectionTypeId}/`, data);
export const deleteSectionType = (sectionTypeId) => sectionTypeApi.delete(`/${sectionTypeId}/`);
