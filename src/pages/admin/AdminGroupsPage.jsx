// src/pages/AdminGroupsPage.jsx

import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Spinner, Row, Col } from 'react-bootstrap';
import { getGroups, createGroup, updateGroup, deleteGroup } from '../../api/group.api.js';
import { NavbarComponent } from '../../components/NavbarComponent';
import { FooterComponent } from '../../components/FooterComponent';

export const AdminGroupsPage = () => {
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const groupsResponse = await getGroups();
            setGroups(groupsResponse.data);
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleShowModal = (group = null) => {
        setSelectedGroup(group);
        setShowModal(true);
    };

    const handleSaveGroup = async () => {
        if (selectedGroup.id) {
            await updateGroup(selectedGroup.id, selectedGroup);
        } else {
            await createGroup(selectedGroup);
        }
        setShowModal(false);
        // Refresh groups
        const groupsResponse = await getGroups();
        setGroups(groupsResponse.data);
    };

    const handleDeleteGroup = async (groupId) => {
        await deleteGroup(groupId);
        const updatedGroups = groups.filter(group => group.id !== groupId);
        setGroups(updatedGroups);
    };

    if (loading) {
        return <Spinner animation="border" />;
    }

    return (
        <Container fluid className='p-0'>
            <NavbarComponent />
            <Container fluid className='mt-5 p-5'>
                <Row>
                    <Col xs={7} md={10}>
                        <h1>Administrar Grupos</h1>
                    </Col>
                    <Col xs={5} md={2}>
                        <Button onClick={() => handleShowModal()}>Crear Grupo</Button>
                    </Col>
                </Row>
                <Table striped bordered hover className='mt-3'>
                    <thead>
                        <tr>
                            {/* <th>ID</th> */}
                            <th className='w-25'>Nombre</th>
                            <th className='w-25'>Descripción</th>
                            <th className='w-25'>Icono</th>
                            <th className='w-25'>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {groups.map(group => (
                            <tr key={group.id}>
                                {/* <td>{group.id}</td> */}
                                <td className='w-25'>{group.description}</td>
                                <td className='w-25'>{group.name}</td>
                                <td className='w-25'><i className={`bi bi-${group.icon}`}></i></td>
                                <td className='w-25'>
                                    <Button onClick={() => handleShowModal(group)}>Editar</Button>{' '}
                                    <Button variant="danger" onClick={() => handleDeleteGroup(group.id)}>Eliminar</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
            <FooterComponent />

            <Modal show={showModal} onHide={() => setShowModal(false)} size='xl' centered>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedGroup ? 'Editar Grupo' : 'Crear Grupo'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId='name'>
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type='text'
                                value={selectedGroup?.name || ''}
                                onChange={e => setSelectedGroup({ ...selectedGroup, name: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId='description'>
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control
                                type='text'
                                value={selectedGroup?.description || ''}
                                onChange={e => setSelectedGroup({ ...selectedGroup, description: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId='icon'>
                            <Form.Label>Icono</Form.Label>
                            <Form.Control
                                type='text'
                                value={selectedGroup?.icon || ''}
                                onChange={e => setSelectedGroup({ ...selectedGroup, icon: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={() => setShowModal(false)}>
                        Cerrar
                    </Button>
                    <Button variant='primary' onClick={handleSaveGroup}>
                        {selectedGroup ? 'Guardar Cambios' : 'Crear Grupo'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};
