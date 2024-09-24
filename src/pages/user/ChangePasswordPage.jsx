import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Spinner } from 'react-bootstrap';
import { updateUser, getUser } from '../../api/user.api';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { NavbarComponent } from '../../components/NavbarComponent';
import { FooterComponent } from '../../components/FooterComponent';
import { jwtDecode } from 'jwt-decode'; // Importar jwt-decode para decodificar el token JWT

export const ChangePasswordPage = () => {
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true); // Estado de carga general
    const [changingPassword, setChangingPassword] = useState(false); // Estado de carga para el cambio de contraseña
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('access');
                if (!token) {
                    toast.error('No estás logueado.');
                    navigate('/login');
                    return;
                }

                const decodedToken = JSON.parse(atob(token.split('.')[1]));
                setUserId(decodedToken.id); // Ajusta para usar "id" del token

                const userResponse = await getUser(decodedToken.id); // Ajusta para usar "id"
                setLoading(false); // Se carga la información correctamente
            } catch (error) {
                console.error('Error fetching user:', error);
                toast.error('Error cargando la información del usuario.');
                navigate('/login');
            }
        };

        fetchUser();
    }, [navigate]);

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error('Las contraseñas no coinciden.');
            return;
        }

        setChangingPassword(true); // Inicia la carga del cambio de contraseña

        try {
            // Actualizar la contraseña del usuario
            await updateUser(userId, { password: newPassword });
            toast.success('Contraseña actualizada exitosamente.');
            navigate('/menu');
        } catch (error) {
            toast.error('Error actualizando la contraseña.');
            console.error(error);
        } finally {
            setChangingPassword(false); // Termina la carga del cambio de contraseña
        }
    };

    if (loading) {
        return <Spinner animation="border" />;
    }

    return (
        <Container fluid>
            <NavbarComponent />
            <Container fluid className='mt-5 p-5'>
                <h2 className="text-center mb-4">Cambiar Contraseña</h2>
                <Form onSubmit={handlePasswordChange}>

                    <Form.Group controlId="newPassword" className="mt-3">
                        <Form.Label>Nueva Contraseña</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Ingrese su nueva contraseña"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="confirmPassword" className="mt-3">
                        <Form.Label>Confirmar Nueva Contraseña</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Confirme su nueva contraseña"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <div className="d-flex justify-content-center">
                        <Button className="mt-4 text-center" variant="primary" type="submit" disabled={changingPassword}>
                            {changingPassword ? <Spinner as="span" animation="border" size="sm" /> : 'Cambiar Contraseña'}
                        </Button>
                    </div>
                </Form>
            </Container>
            <FooterComponent />
        </Container>
    );
};
