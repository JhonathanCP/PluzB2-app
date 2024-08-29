// src/components/Navbar.jsx

import React, { useEffect, useState } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Asegúrate de que la importación sea correcta
import Logo from '../assets/Logo-blanco.png'; // Asegúrate de que la ruta sea correcta
import { toast } from 'react-hot-toast';

export const NavbarComponent = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');

    useEffect(() => {
        // Obtener el token desde el localStorage
        const accessToken = localStorage.getItem('access');
        if (accessToken) {
            const decodedToken = jwtDecode(accessToken);
            setUsername(decodedToken.username);

            // Configurar un timer para manejar la expiración del token
            const currentTime = Math.floor(Date.now() / 1000);
            const expirationTime = decodedToken.exp;

            if (currentTime >= expirationTime) {
                handleLogout();
            } else {
                const timeout = (expirationTime - currentTime) * 1000;
                setTimeout(() => {
                    handleExpire();
                }, timeout);
            }
        } else {
            handleLogout();
        }
    }, []);

    const handleExpire = () => {
        localStorage.removeItem('access');
        localStorage.removeItem('expirationTime');
        toast.error('Sesión expirada. Por favor, inicia sesión nuevamente.');
        navigate('/login');
    };

    const handleLogout = () => {
        localStorage.removeItem('access');
        localStorage.removeItem('expirationTime');
        toast.success('Sesión cerrada correctamente!');
        navigate('/login');
    };

    return (
        <Navbar variant="dark" expand="lg" className="px-5 bg-login">
            <Navbar.Brand as={Link} to="/">
                <img
                    src={Logo}
                    width="80"
                    height="45"
                    className="d-inline-block align-top"
                    alt="Logo"
                />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ms-auto">
                    <Nav.Link as={Link} to="/settings/general">
                        <i className="bi bi-building"></i> B2G
                    </Nav.Link>
                    <Nav.Link as={Link} to="/settings/account">
                        <i className="bi bi-briefcase"></i> B2B
                    </Nav.Link>
                    <Nav.Link as={Link} to="/settings/security">
                        <i className="bi bi-person"></i> B2C
                    </Nav.Link>
                    <span className="nav-link">
    <i className="bi bi-person-circle"></i> {username || 'Usuario'}
</span>


                    <Nav.Link onClick={handleLogout}>
                        <i className="bi bi-box-arrow-left"></i> Cerrar sesión
                    </Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};
