import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Spinner, Row, Col } from 'react-bootstrap';
import { getClients, createClient, updateClient } from '../../api/client.api';
import { getSections, createSection, deleteSection, updateSection } from '../../api/section.api';
import { getLocations } from '../../api/location.api';
import { getSectionTypes } from '../../api/sectionType.api'; // Para obtener los tipos de secciones
import { NavbarComponent } from '../../components/NavbarComponent';
import { FooterComponent } from '../../components/FooterComponent';

export const AdminClientsPage = () => {
    const [clients, setClients] = useState([]);
    const [locations, setLocations] = useState([]);
    const [sections, setSections] = useState([]);
    const [sectionTypes, setSectionTypes] = useState([]); // Lista de tipos de secciones
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
            const sectionTypesResponse = await getSectionTypes(); // Obtener tipos de secciones
            setClients(clientsResponse.data);
            setLocations(locationsResponse.data);
            setSections(sectionsResponse.data);
            setSectionTypes(sectionTypesResponse.data); // Guardar tipos de secciones
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
            // Actualizar la lista de clientes después de la edición
            setClients(clients.map(client => client.id === selectedClient.id ? selectedClient : client));
        } else {
            const newClient = await createClient(selectedClient);
            // Agregar el nuevo cliente a la lista de clientes
            setClients([...clients, newClient.data]);
        }
        setShowModal(false);
    };

    const handleShowSectionModal = (section = null, sectionTypeId = null) => {
        if (section) {
            setSelectedSection(section);
        } else {
            setSelectedSection({ sectionTypeId }); // Preseleccionar el sectionTypeId cuando sea una nueva sección
        }
        setShowSectionModal(true);
    };

    const handleSaveSection = async () => {
        const sectionData = { ...selectedSection, clientId: selectedClient.id }; // Incluir el clientId en la data

        if (selectedSection.id) {
            // Si la sección ya existe (es una actualización)
            await updateSection(selectedSection.id, sectionData);
            // Actualizar la lista de secciones después de la edición
            setSections(sections.map(section => section.id === selectedSection.id ? sectionData : section));
        } else {
            // Si es una nueva sección (es creación)
            const newSection = await createSection(sectionData);
            // Agregar la nueva sección a la lista de secciones
            setSections([...sections, newSection.data]);
        }
        setShowSectionModal(false);
    };

    const handleDeleteSection = async (sectionId) => {
        await deleteSection(sectionId);
        // Eliminar la sección de la lista de secciones
        setSections(sections.filter(section => section.id !== sectionId));
    };

    if (loading) {
        return <Spinner animation="border" />;
    }

    return (
        <Container fluid className='p-0'>
            <NavbarComponent />
            <Container fluid className='p-5 mt-5'>
                <Row>
                    <Col xs={7} md={10}>
                        <h1>Administrar clientes</h1>
                    </Col>
                    <Col xs={5} md={2}>
                        <Button onClick={() => handleShowModal()}>Crear Cliente</Button>
                    </Col>
                </Row>
                <Table responsive striped bordered hover className='mt-3'>
                    <thead>
                        <tr>
                            {/* <th>ID</th> */}
                            <th className='w-25'>Nombre</th>
                            <th className='w-25'>Responsable</th>
                            <th className='w-25'>Ubicación</th>
                            <th className='w-25'>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map(client => (
                            <tr key={client.id}>
                                {/* <td>{client.id}</td> */}
                                <td className='w-25'>{client.name}</td>
                                <td className='w-25'>{client.responsible}</td>
                                <td className='w-25'>{locations.find(loc => loc.id === client.locationId)?.name}</td>
                                <td className='w-25'>
                                    <Button onClick={() => handleShowModal(client)}>Editar</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
            <FooterComponent />

            {/* Modal para crear/editar cliente */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size='xl' centered>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedClient ? 'Editar Cliente' : 'Crear Cliente'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {/* Campos de edición de cliente */}
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

                        {/* Agrupación de secciones por sectionType */}
                        <h5 className='pt-3'>Información clave del cliente</h5>
                        {sectionTypes.map(type => (
                            <div key={type.id}>
                                <Row className='py-2'>
                                    <Col xs={6} lg={10}>
                                        <h6>{type.name}</h6>
                                    </Col>
                                    <Col xs={6} lg={2}>
                                        {/* Botón para agregar sección por sectionType */}
                                        <Button onClick={() => handleShowSectionModal(null, type.id)}>Agregar Indicador</Button>
                                    </Col>
                                </Row>
                                <Table striped bordered responsive>
                                    <thead>
                                        <tr>
                                            <th>Nombre</th>
                                            <th>KPI</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sections
                                            .filter(section => section.clientId === selectedClient?.id && section.sectionTypeId === type.id)
                                            .map(section => (
                                                <tr key={section.id}>
                                                    <td className='w-50'>{section.name}</td>
                                                    <td className='w-25'>{section.percepcion}</td>
                                                    <td className='text-center w-25'>
                                                        <Button onClick={() => handleShowSectionModal(section)}>Editar</Button>{' '}
                                                        <Button variant='danger' onClick={() => handleDeleteSection(section.id)}>Eliminar</Button>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </Table>
                            </div>
                        ))}
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
            <Modal show={showSectionModal} onHide={() => setShowSectionModal(false)} size='lg' centered>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedSection ? 'Editar Sección' : 'Crear Sección'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId='sectionType'>
                            <Form.Label>Criterio</Form.Label>
                            <Form.Control
                                as='select'
                                value={selectedSection?.sectionTypeId || ''}
                                onChange={e => setSelectedSection({ ...selectedSection, sectionTypeId: e.target.value })}
                                disabled={!!selectedSection?.sectionTypeId}  // Deshabilitar selección si ya está preseleccionado
                            >
                                <option value=''>Selecciona un criterio</option>
                                {sectionTypes.map(type => (
                                    <option key={type.id} value={type.id}>
                                        {type.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId='name'>
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type='text'
                                value={selectedSection?.name || ''}
                                onChange={e => setSelectedSection({ ...selectedSection, name: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId='percepcion'>
                            <Form.Label>Valor</Form.Label>
                            <Form.Control
                                type='text'
                                value={selectedSection?.percepcion || ''}
                                onChange={e => setSelectedSection({ ...selectedSection, percepcion: e.target.value })}
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
