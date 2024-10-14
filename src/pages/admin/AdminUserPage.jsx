import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Spinner, Row, Col } from 'react-bootstrap';
import { getUsers, createUser, updateUser, deleteUser, recoverPassword } from '../../api/user.api'; // Añadir recoverPassword
import { getRoles } from '../../api/role.api';
import { NavbarComponent } from '../../components/NavbarComponent';
import { FooterComponent } from '../../components/FooterComponent';
import { toast } from 'react-hot-toast'; // Importar la librería de notificaciones

export const AdminUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const usersResponse = await getUsers();
            const rolesResponse = await getRoles();
            setUsers(usersResponse.data);
            setRoles(rolesResponse.data);
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleShowModal = (user = null) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const handleSaveUser = async () => {
        try {
            if (selectedUser.id) {
                await updateUser(selectedUser.id, selectedUser);
                toast.success('Usuario actualizado correctamente.');
            } else {
                await createUser(selectedUser);
                toast.success('Usuario creado correctamente.');
            }
            setShowModal(false);
            window.location.reload(); // Recargar para reflejar cambios
        } catch (error) {
            if (error.response && error.response.status === 400) {
                toast.error(error.response.data.message); // Mostrar mensaje de error desde el backend
            } else {
                toast.error('Error al guardar el usuario.');
            }
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            await deleteUser(userId);
            setUsers(users.filter(user => user.id !== userId));
            toast.success('Usuario eliminado correctamente.');
        } catch (error) {
            toast.error('Error al eliminar el usuario.');
        }
    };

    const handleRecoverPassword = async () => {
        try {
            await recoverPassword(selectedUser.id); // Llamar a la API para recuperar la contraseña
            toast.success('Nueva contraseña enviada correctamente.');
        } catch (error) {
            toast.error('Error al enviar la nueva contraseña.');
        }
    };

    if (loading) {
        return <Spinner animation="border" />;
    }

    return (
        <Container fluid className='p-0'>
            <NavbarComponent />
            <Container fluid className='mt-5 p-5'>
                <Row>
                    <Col xs={7} md={9}>
                        <h1>Administrar Usuarios</h1>
                    </Col>
                    <Col xs={5} md={3}>
                        <Button onClick={() => handleShowModal()}>Crear Usuario</Button>
                    </Col>
                </Row>
                <Table responsive striped bordered hover className='mt-3'>
                    <thead>
                        <tr>
                            <th>Nombre de Usuario</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{roles.find(role => role.id === user.roleId)?.name}</td>
                                <td>
                                    <Button onClick={() => handleShowModal(user)}>Editar</Button>{' '}
                                    <Button variant='danger' onClick={() => handleDeleteUser(user.id)}>Eliminar</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
            <FooterComponent />

            <Modal show={showModal} onHide={() => setShowModal(false)} size='xl' centered>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedUser ? 'Editar Usuario' : 'Crear Usuario'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId='username'>
                            <Form.Label>Nombre de Usuario</Form.Label>
                            <Form.Control
                                type='text'
                                value={selectedUser?.username || ''}
                                onChange={e => setSelectedUser({ ...selectedUser, username: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId='email'>
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type='email'
                                value={selectedUser?.email || ''}
                                onChange={e => setSelectedUser({ ...selectedUser, email: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId='role'>
                            <Form.Label>Rol</Form.Label>
                            <Form.Control
                                as='select'
                                value={selectedUser?.roleId || ''}
                                onChange={e => setSelectedUser({ ...selectedUser, roleId: e.target.value })}
                            >
                                <option value=''>Selecciona un rol</option>
                                {roles.map(role => (
                                    <option key={role.id} value={role.id}>
                                        {role.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={() => setShowModal(false)}>
                        Cerrar
                    </Button>
                    {selectedUser && selectedUser.id && (
                        <Button variant='warning' onClick={handleRecoverPassword}>
                            Enviar nueva contraseña
                        </Button>
                    )}
                    <Button variant='primary' onClick={handleSaveUser}>
                        {selectedUser ? 'Guardar Cambios' : 'Crear Usuario'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};
