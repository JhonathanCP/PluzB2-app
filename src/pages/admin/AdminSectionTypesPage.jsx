// src/pages/AdminSectionTypesPage.jsx

import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Spinner, Row, Col } from 'react-bootstrap';
import { getSectionTypes, createSectionType, updateSectionType, deleteSectionType } from '../../api/sectionType.api';
import { NavbarComponent } from '../../components/NavbarComponent';
import { FooterComponent } from '../../components/FooterComponent';

export const AdminSectionTypesPage = () => {
    const [sectionTypes, setSectionTypes] = useState([]);
    const [selectedSectionType, setSelectedSectionType] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const sectionTypesResponse = await getSectionTypes();
            setSectionTypes(sectionTypesResponse.data);
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleShowModal = (sectionType = null) => {
        setSelectedSectionType(sectionType);
        setShowModal(true);
    };

    const handleSaveSectionType = async () => {
        if (selectedSectionType.id) {
            await updateSectionType(selectedSectionType.id, selectedSectionType);
        } else {
            await createSectionType(selectedSectionType);
        }
        setShowModal(false);
        window.location.reload(); // Recargar la página para ver los cambios
    };

    const handleDeleteSectionType = async (sectionTypeId) => {
        await deleteSectionType(sectionTypeId);
        setSectionTypes(sectionTypes.filter(sectionType => sectionType.id !== sectionTypeId));
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
                        <h1>Administrar criterios</h1>
                    </Col>
                    <Col xs={5} md={2}>
                        <Button onClick={() => handleShowModal()}>Crear criterio</Button>
                    </Col>
                </Row>
                <Table responsive striped bordered hover className='mt-3'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sectionTypes.map(sectionType => (
                            <tr key={sectionType.id}>
                                <td>{sectionType.id}</td>
                                <td>{sectionType.name}</td>
                                <td>
                                    <Button onClick={() => handleShowModal(sectionType)}>Editar</Button>{' '}
                                    <Button variant='danger' onClick={() => handleDeleteSectionType(sectionType.id)}>Eliminar</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
            <FooterComponent />

            <Modal show={showModal} onHide={() => setShowModal(false)} size='xl' centered>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedSectionType ? 'Editar Tipo de Sección' : 'Crear Tipo de Sección'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId='name'>
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type='text'
                                value={selectedSectionType?.name || ''}
                                onChange={e => setSelectedSectionType({ ...selectedSectionType, name: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={() => setShowModal(false)}>
                        Cerrar
                    </Button>
                    <Button variant='primary' onClick={handleSaveSectionType}>
                        {selectedSectionType ? 'Guardar Cambios' : 'Crear Tipo de Sección'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};
