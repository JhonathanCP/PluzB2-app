import axios from "axios";

const URL =
    process.env.NODE_ENV === "production"
        ? import.meta.env.VITE_BACKEND_URL
        : "http://10.0.28.15:4500/user";

const authApi = axios.create({
    baseURL: 'http://10.0.28.15:4500/user',
});

// Interceptor para incluir el token en los encabezados de todas las solicitudes
authApi.interceptors.request.use((config) => {
    const token = localStorage.getItem("access");
    if (token) {
        config.headers['x-access-token'] = token;
    }
    return config;
});

export const getUsers = () => authApi.get("/");
export const getUser = (userId) => authApi.get(`/${userId}/`);
export const updateUser = (userId, data) => authApi.put(`/${userId}/`, data);