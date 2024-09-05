import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Spinner } from 'react-bootstrap';
import { getClients, createClient, updateClient } from '../../api/client.api';
import { getSections, createSection, deleteSection } from '../../api/section.api';
import { getLocations } from '../../api/location.api';
import { NavbarComponent } from '../../components/NavbarComponent';
import { FooterComponent } from '../../components/FooterComponent';
import { AdminNavbarComponent } from '../../components/AdminNavbarComponent';

export const AdminClientsPage = () => {
    const [clients, setClients] = useState([]);
    const [locations, setLocations] = useState([]);
    const [sections, setSections] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showSectionModal, setShowSectionModal] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const clientsResponse = await getClients();
            const locationsResponse = await getLocations();
            const sectionsResponse = await getSections();
            setClients(clientsResponse.data);
            setLocations(locationsResponse.data);
            setSections(sectionsResponse.data);
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleShowModal = (client = null) => {
        setSelectedClient(client);
        setShowModal(true);
    };

    const handleSaveClient = async () => {
        if (selectedClient.id) {
            await updateClient(selectedClient.id, selectedClient);
        } else {
            await createClient(selectedClient);
        }
        setShowModal(false);
    };

    const handleShowSectionModal = (section = null) => {
        setSelectedSection(section);
        setShowSectionModal(true);
    };

    const handleSaveSection = async () => {
        if (selectedSection.id) {
            await updateClient(selectedClient.id, selectedSection);
        } else {
            await createSection(selectedClient.id, selectedSection);
        }
        setShowSectionModal(false);
    };

    const handleDeleteSection = async (sectionId) => {
        await deleteSection(sectionId);
        // Actualizar las secciones del cliente
        const updatedSections = sections.filter(section => section.id !== sectionId);
        setSections(updatedSections);
    };

    if (loading) {
        return <Spinner animation="border" />;
    }

    return (
        <Container fluid className='p-0'>
            <AdminNavbarComponent />
            <Container className='mt-5 pt-5'>
                <h1>Administrar Clientes</h1>
                <Button onClick={() => handleShowModal()}>Crear Cliente</Button>
                <Table striped bordered hover className='mt-3'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Responsable</th>
                            <th>Ubicación</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map(client => (
                            <tr key={client.id}>
                                <td>{client.id}</td>
                                <td>{client.name}</td>
                                <td>{client.responsible}</td>
                                <td>{locations.find(loc => loc.id === client.locationId)?.name}</td>
                                <td>
                                    <Button onClick={() => handleShowModal(client)}>Editar</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
            <FooterComponent />

            {/* Modal para crear/editar cliente */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size='xl'>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedClient ? 'Editar Cliente' : 'Crear Cliente'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId='name'>
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type='text'
                                value={selectedClient?.name || ''}
                                onChange={e => setSelectedClient({ ...selectedClient, name: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId='responsible'>
                            <Form.Label>Responsable</Form.Label>
                            <Form.Control
                                type='text'
                                value={selectedClient?.responsible || ''}
                                onChange={e => setSelectedClient({ ...selectedClient, responsible: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId='location'>
                            <Form.Label>Ubicación</Form.Label>
                            <Form.Control
                                as='select'
                                value={selectedClient?.locationId || ''}
                                onChange={e => setSelectedClient({ ...selectedClient, locationId: e.target.value })}
                            >
                                <option value=''>Selecciona una ubicación</option>
                                {locations.map(location => (
                                    <option key={location.id} value={location.id}>
                                        {location.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <h5>Secciones del Cliente</h5>
                        {/* Tabla para mostrar las secciones */}
                        <Table striped bordered>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>KPI</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sections
                                    .filter(section => section.clientId === selectedClient?.id)
                                    .map(section => (
                                        <tr key={section.id}>
                                            <td>{section.name}</td>
                                            <td>{section.kpi}</td>
                                            <td>
                                                <Button onClick={() => handleShowSectionModal(section)}>Editar</Button>{' '}
                                                <Button variant='danger' onClick={() => handleDeleteSection(section.id)}>Eliminar</Button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </Table>
                        <Button onClick={() => handleShowSectionModal()}>Agregar Sección</Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={() => setShowModal(false)}>
                        Cerrar
                    </Button>
                    <Button variant='primary' onClick={handleSaveClient}>
                        {selectedClient ? 'Guardar Cambios' : 'Crear Cliente'}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal para crear/editar secciones */}
            <Modal show={showSectionModal} onHide={() => setShowSectionModal(false)} size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedSection ? 'Editar Sección' : 'Crear Sección'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId='name'>
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type='text'
                                value={selectedSection?.name || ''}
                                onChange={e => setSelectedSection({ ...selectedSection, name: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId='kpi'>
                            <Form.Label>KPI</Form.Label>
                            <Form.Control
                                type='text'
                                value={selectedSection?.kpi || ''}
                                onChange={e => setSelectedSection({ ...selectedSection, kpi: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={() => setShowSectionModal(false)}>
                        Cerrar
                    </Button>
                    <Button variant='primary' onClick={handleSaveSection}>
                        {selectedSection ? 'Guardar Cambios' : 'Crear Sección'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};
