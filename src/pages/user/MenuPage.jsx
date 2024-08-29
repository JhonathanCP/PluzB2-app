// src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { NavbarComponent } from '../../components/NavbarComponent'
import { FooterComponent } from '../../components/FooterComponent';

export const MenuPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const response = await login({ username, password });
            localStorage.setItem('access', response.data.token);
            toast.success('Login successful!');
            navigate('/menu');
            // Redireccionar o actualizar la página
        } catch (error) {
            toast.error('Login failed! Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container fluid className='p-0'>
            <NavbarComponent></NavbarComponent>

            <FooterComponent></FooterComponent>
        </Container>
    );
};
