// src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { login } from '../api/auth.api.js';
import { toast } from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';
import { Card, Form, Button, Container, InputGroup } from 'react-bootstrap';
import Logo from '../assets/Logo.png';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/main.css'; // Opcional para estilos adicionales

export const LoginPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const response = await login({ username, password });
            const accessToken = response.data.token;
            const expirationTime = jwtDecode(accessToken).exp;
            localStorage.setItem('access', accessToken);
            localStorage.setItem('expirationTime', expirationTime);
            // Redirect to the new page
            navigate('/menu');
            toast.success('Bienvenido!');

            // Redireccionar o actualizar la página
        } catch (error) {
            toast.error('Ingreso fallido. Por favor revise sus crendenciales');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container fluid className='bg-login'>
            <Container fluid className='d-flex flex-column justify-content-center align-items-center vh-100'>
                <h3 className='text-center title-login text-uppercase fw-bold'>Sistema</h3>
                <h3 className='text-center mb-4 title-login text-uppercase fw-bold'>Informativo de Clientes</h3>
                <Card style={{ width: '20rem' }}>
                    <Card.Body>
                        <Card.Title className='text-center mb-4'>
                            <img className="img-fluid" src={Logo} alt="Logo" />
                        </Card.Title>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Usuario</Form.Label>
                                <Form.Control
                                    type="username"
                                    placeholder="Ingresa tu usuario"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Contraseña</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Contraseña"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <InputGroup.Text
                                        onClick={toggleShowPassword}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <i className={`bi ${showPassword ? "bi-eye" : "bi-eye-slash"}`}></i>
                                    </InputGroup.Text>
                                </InputGroup>
                            </Form.Group>
                            <div className="d-flex justify-content-center">
                                <Button type="submit" disabled={loading} className='btn-pluz'>
                                    {loading ? 'Ingresando...' : 'Ingresar'}
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </Container>
    );
}

