import axios from "axios";

const URL =
    process.env.NODE_ENV === "production"
        ? import.meta.env.VITE_BACKEND_URL
        : "http://localhost:4500/data";

const authApi = axios.create({
    baseURL: 'http://localhost:4500/data',
});

// Interceptor para incluir el token en los encabezados de todas las solicitudes
authApi.interceptors.request.use((config) => {
    const token = localStorage.getItem("access");
    if (token) {
        config.headers['x-access-token'] = token;
    }
    return config;
});

export const updateData = () => authApi.post("/");
export const getOldData = () => authApi.get("/download-old-data", { responseType: 'blob' });
export const uploadNewData = (formData) => {
    return authApi.post("/upload-new-data", formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
