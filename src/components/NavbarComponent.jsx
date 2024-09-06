import React, { useEffect, useState } from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Corrige la importación
import Logo from '../assets/Logo-blanco.png'; // Asegúrate de que la ruta sea correcta
import { toast } from 'react-hot-toast';
import { getGroups } from '../api/group.api.js'; // Importa la API para obtener los grupos

export const NavbarComponent = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [groups, setGroups] = useState([]); // Estado para almacenar los grupos
    const [isAdmin, setIsAdmin] = useState(false); // Estado para verificar si el usuario es administrador

    useEffect(() => {
        // Obtener el token desde el localStorage
        const accessToken = localStorage.getItem('access');
        if (accessToken) {
            const decodedToken = jwtDecode(accessToken);
            setUsername(decodedToken.username);
            setIsAdmin(decodedToken.role == 1); // Asumimos que `isAdmin` está en el token

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

        // Fetch groups
        const fetchGroups = async () => {
            try {
                const response = await getGroups();
                setGroups(response.data);
            } catch (error) {
                console.error('Error fetching groups:', error);
            }
        };

        fetchGroups();
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
        <Navbar variant="dark" expand="lg" className="fixed-top px-5 bg-login">
            <Navbar.Brand as={Link} to="/menu">
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
                    <Nav.Link as={Link} to="/menu">
                        <i className="bi bi-house-fill"></i> Inicio
                    </Nav.Link>
                    {groups.map((group) => (
                        <Nav.Link as={Link} onClick={() => navigate(`/client/${id}`)} key={group.id}>
                            <i className={`bi bi-${group.icon}`}></i> {group.name}
                        </Nav.Link>
                    ))}
                    {isAdmin && ( // Mostrar solo si es administrador
                        <NavDropdown title="Configuración" id="admin-config-dropdown">
                            <NavDropdown.Item as={Link} to="/admin/user">
                                <i className="bi bi-people-fill"></i> Usuarios
                            </NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/admin/locations">
                                <i className="bi bi-geo-alt-fill"></i> Locaciones
                            </NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/admin/groups">
                                <i className="bi bi-collection-fill"></i> Grupos
                            </NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/admin/clients">
                                <i className="bi bi-briefcase-fill"></i> Clientes
                            </NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/admin/section-types">
                                <i className="bi bi-bar-chart-steps"></i> Criterios
                            </NavDropdown.Item>
                        </NavDropdown>
                    )}
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