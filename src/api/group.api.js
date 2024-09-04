import axios from "axios";

const URL =
    process.env.NODE_ENV === "production"
        ? import.meta.env.VITE_BACKEND_URL
        : "http://localhost:4500/group";

const authApi = axios.create({
    baseURL: 'http://localhost:4500/group',
});

// Interceptor para incluir el token en los encabezados de todas las solicitudes
authApi.interceptors.request.use((config) => {
    const token = localStorage.getItem("access");
    if (token) {
        config.headers['x-access-token'] = token;
    }
    return config;
});

export const getGroups = () => authApi.get("/");
export const getGroup = (userId) => authApi.get(`/${userId}/`);
export const createGroup = (data) => authApi.post("/", data);
export const updateGroup = (userId, data) => authApi.put(`/${userId}/`, data);
export const deleteGroup = (userId) => authApi.delete(`/${userId}/`);