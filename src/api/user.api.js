import axios from "axios";

const URL =
    process.env.NODE_ENV === "production"
        ? import.meta.env.VITE_BACKEND_URL
        : "http://localhost:4500/user";

const authApi = axios.create({
    baseURL: 'http://localhost:4500/user',
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
export const createUser = (data) => authApi.post('/', data);
export const updateUser = (id, data) => authApi.put(`/${id}`, data);
export const deleteUser = (id) => authApi.delete(`/${id}`);