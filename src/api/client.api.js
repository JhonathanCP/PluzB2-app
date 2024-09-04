import axios from "axios";

const URL =
    process.env.NODE_ENV === "production"
        ? import.meta.env.VITE_BACKEND_URL
        : "http://localhost:4500/client";

const authApi = axios.create({
    baseURL: 'http://localhost:4500/client',
});

// Interceptor para incluir el token en los encabezados de todas las solicitudes
authApi.interceptors.request.use((config) => {
    const token = localStorage.getItem("access");
    if (token) {
        config.headers['x-access-token'] = token;
    }
    return config;
});

export const getClients = () => authApi.get("/");
export const getClient = (clientId) => authApi.get(`/${clientId}/`);
export const createClient = (data) => authApi.post("/", data);
export const updateClient = (clientId, data) => authApi.put(`/${clientId}/`, data);
export const deleteClient = (clientId) => authApi.delete(`/${clientId}/`);