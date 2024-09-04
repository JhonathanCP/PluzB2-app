import axios from "axios";

const URL =
    process.env.NODE_ENV === "production"
        ? import.meta.env.VITE_BACKEND_URL
        : "http://localhost:4500/location";

const locationApi = axios.create({
    baseURL: URL,
});

// Interceptor para incluir el token en los encabezados de todas las solicitudes
locationApi.interceptors.request.use((config) => {
    const token = localStorage.getItem("access");
    if (token) {
        config.headers['x-access-token'] = token;
    }
    return config;
});

export const getLocations = () => locationApi.get("/");
export const getLocation = (locationId) => locationApi.get(`/${locationId}/`);
export const createLocation = (data) => locationApi.post("/", data);
export const updateLocation = (locationId, data) => locationApi.put(`/${locationId}/`, data);
export const deleteLocation = (locationId) => locationApi.delete(`/${locationId}/`);
