import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
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

    const handleSaveSectionType = async (event) => {
        event.preventDefault();
        
        // Validar que el campo "nombre" esté lleno
        if (!selectedSectionType?.name || selectedSectionType.name.trim() === '') {
            toast.error('Por favor, completa el campo de nombre.');
            return; // Detener el envío del formulario si el campo está vacío
        }

        if (selectedSectionType.id) {
            await updateSectionType(selectedSectionType.id, selectedSectionType);
            toast.success('Criterio actualizado correctamente!');
        } else {
            await createSectionType(selectedSectionType);
            toast.success('Criterio creado correctamente!');
        }
        setShowModal(false);
        // Refrescar la lista de tipos de sección
        const sectionTypesResponse = await getSectionTypes();
        setSectionTypes(sectionTypesResponse.data);
    };

    const handleDeleteSectionType = async (sectionTypeId) => {
        await deleteSectionType(sectionTypeId);
        const updatedSectionTypes = sectionTypes.filter(sectionType => sectionType.id !== sectionTypeId);
        setSectionTypes(updatedSectionTypes);
        toast.success('Criterio eliminado correctamente!');
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
                        <h1>Administrar Criterios</h1>
                    </Col>
                    <Col xs={5} md={2}>
                        <Button onClick={() => handleShowModal()}>Crear Criterio</Button>
                    </Col>
                </Row>
                <Table striped bordered hover className='mt-3'>
                    <thead>
                        <tr>
                            {/* <th>ID</th> */}
                            <th>Nombre</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sectionTypes.map(sectionType => (
                            <tr key={sectionType.id}>
                                {/* <td>{location.id}</td> */}
                                <td>{sectionType.name}</td>
                                <td>
                                    <Button onClick={() => handleShowModal(sectionType)}>Editar</Button>{' '}
                                    <Button variant="danger" onClick={() => handleDeleteSectionType(sectionType.id)}>Eliminar</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
            <FooterComponent />

            <Modal show={showModal} onHide={() => setShowModal(false)} size='xl' centered>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedSectionType ? 'Editar Criterio' : 'Crear Criterio'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSaveSectionType}>
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
                        {selectedSectionType ? 'Guardar Cambios' : 'Crear Criterio'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};
