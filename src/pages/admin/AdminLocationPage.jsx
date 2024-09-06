import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Spinner, Row,Col } from 'react-bootstrap';
import { getLocations, createLocation, updateLocation, deleteLocation } from '../../api/location.api';
import { NavbarComponent } from '../../components/NavbarComponent';
import { FooterComponent } from '../../components/FooterComponent';

export const AdminLocationsPage = () => {
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const locationsResponse = await getLocations();
            setLocations(locationsResponse.data);
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleShowModal = (location = null) => {
        setSelectedLocation(location);
        setShowModal(true);
    };

    const handleSaveLocation = async () => {
        if (selectedLocation.id) {
            await updateLocation(selectedLocation.id, selectedLocation);
        } else {
            await createLocation(selectedLocation);
        }
        setShowModal(false);
        // Refresh locations
        const locationsResponse = await getLocations();
        setLocations(locationsResponse.data);
    };

    const handleDeleteLocation = async (locationId) => {
        await deleteLocation(locationId);
        const updatedLocations = locations.filter(location => location.id !== locationId);
        setLocations(updatedLocations);
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
                        <h1>Administrar Ubicaciones</h1>
                    </Col>
                    <Col xs={5} md={2}>
                        <Button onClick={() => handleShowModal()}>Crear Ubicación</Button>
                    </Col>
                </Row>
                <Table striped bordered hover className='mt-3'>
                    <thead>
                        <tr>
                            {/* <th>ID</th> */}
                            <th>Nombre</th>
                            <th>Codigo</th>
                            <th>Alcalde</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {locations.map(location => (
                            <tr key={location.id}>
                                {/* <td>{location.id}</td> */}
                                <td>{location.name}</td>
                                <td>{location.code}</td>
                                <td>{location.responsible}</td>
                                <td>
                                    <Button onClick={() => handleShowModal(location)}>Editar</Button>{' '}
                                    <Button variant="danger" onClick={() => handleDeleteLocation(location.id)}>Eliminar</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
            <FooterComponent />

            <Modal show={showModal} onHide={() => setShowModal(false)} size='xl' centered>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedLocation ? 'Editar Ubicación' : 'Crear Ubicación'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId='name'>
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type='text'
                                value={selectedLocation?.name || ''}
                                onChange={e => setSelectedLocation({ ...selectedLocation, name: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId='code'>
                            <Form.Label>Código</Form.Label>
                            <Form.Control
                                type='text'
                                value={selectedLocation?.code || ''}
                                onChange={e => setSelectedLocation({ ...selectedLocation, code: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId='responsible'>
                            <Form.Label>Alcalde</Form.Label>
                            <Form.Control
                                type='text'
                                value={selectedLocation?.responsible || ''}
                                onChange={e => setSelectedLocation({ ...selectedLocation, responsible: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={() => setShowModal(false)}>
                        Cerrar
                    </Button>
                    <Button variant='primary' onClick={handleSaveLocation}>
                        {selectedLocation ? 'Guardar Cambios' : 'Crear Ubicación'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};