import { Outlet, Navigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

export const AdminRoutes = () => {
    const isAdmin = () => {
        // Implementa la lógica para verificar si el usuario ha iniciado sesión
        const accessToken = localStorage.getItem('access');        

        const decodedToken = jwtDecode(accessToken);        

        // Verificar si el token de acceso existe
        if (decodedToken) {
            try {
                const role = decodedToken.role;
                if (role == 1 ) {
                    return true; // El usuario es admin o moderator
                }
            } catch (error) {
                console.error("Error al decodificar el token:", error);
            }
        }
        console.log('noes')
        return false; // El usuario no es admin ni moderator o no ha iniciado sesión
    };

    return isAdmin() ? <Outlet /> : <Navigate to="/menu" />;
};
