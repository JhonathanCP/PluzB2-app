import axios from "axios";

const URL =
    process.env.NODE_ENV === "production"
        ? import.meta.env.VITE_BACKEND_URL
        : "http://localhost:4500/auth/";

const authApi = axios.create({
    // baseURL: 'https://explora.essalud.gob.pe/api/auth/',
    baseURL: 'http://localhost:4500/auth/',
});

// Interceptor para incluir el token en los encabezados de todas las solicitudes
authApi.interceptors.request.use((config) => {
    const token = localStorage.getItem("access");
    if (token) {
        config.headers['x-access-token'] = token;  // Corregir aquí
    }
    return config;
});

export const login = (credentials) => authApi.post("login/", credentials);