// src/pages/GroupPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Table, Button, Modal, Spinner } from 'react-bootstrap';
import { NavbarComponent } from '../../components/NavbarComponent';
import { FooterComponent } from '../../components/FooterComponent';
import { getClients } from '../../api/client.api.js';
import { getLocations } from '../../api/location.api.js';
import { getSections } from '../../api/section.api.js'; // Para obtener las secciones
import { getSectionTypes } from '../../api/sectionType.api.js'; // Para obtener los tipos de secciones
import { getGroups } from '../../api/group.api.js'; // Para obtener el nombre del grupo
import '../../assets/main.css';

export const GroupPage = () => {
    const { id } = useParams(); // Obtener el ID del grupo desde la URL
    const [clients, setClients] = useState([]);
    const [locations, setLocations] = useState([]);
    const [sections, setSections] = useState([]);
    const [sectionTypes, setSectionTypes] = useState([]);
    const [groupName, setGroupName] = useState('');
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);

    useEffect(() => {
        const fetchClientsAndLocationsAndSections = async () => {
            try {
                // Obtener todos los clientes
                const clientResponse = await getClients();
                const filteredClients = clientResponse.data.filter(client => client.groupId === parseInt(id));
                setClients(filteredClients);

                // Obtener todas las ubicaciones
                const locationResponse = await getLocations();
                setLocations(locationResponse.data);

                // Obtener todas las secciones
                const sectionResponse = await getSections();
                setSections(sectionResponse.data);

                // Obtener los tipos de secciones
                const sectionTypeResponse = await getSectionTypes();
                setSectionTypes(sectionTypeResponse.data);

                // Obtener el nombre del grupo
                const groupResponse = await getGroups();
                const group = groupResponse.data.find(group => group.id === parseInt(id));
                setGroupName(group ? group.name : 'Group');

            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchClientsAndLocationsAndSections();
    }, [id]);

    const handleShowDetails = (client) => {
        setSelectedClient(client);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedClient(null);
    };

    const getLocationName = (locationId) => {
        const location = locations.find(loc => loc.id === locationId);
        return location ? location.name : 'Unknown';
    };

    const getSectionTypeName = (sectionTypeId) => {
        const sectionType = sectionTypes.find(type => type.id === sectionTypeId);
        return sectionType ? sectionType.name : 'Unknown';
    };

    const getClientSections = (clientId) => {
        return sections.filter(section => section.clientId === clientId);
    };

    if (loading) {
        return (
            <div className='text-center p-5'>
                <Spinner animation="border" />
            </div>
        );
    }

    return (
        <Container fluid className='p-0'>
            <NavbarComponent />

            <Container fluid className='mt-5 p-5'>
                <h2 className='text-center'>{groupName}</h2>
                <section id="clients">
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Responsable</th>
                                <th>Ubicación</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clients.length > 0 ? (
                                clients.map(client => (
                                    <tr key={client.id}>
                                        <td>{client.id}</td>
                                        <td>{client.name}</td>
                                        <td>{client.responsible}</td>
                                        <td>{getLocationName(client.locationId)}</td>
                                        <td>
                                            <Button onClick={() => handleShowDetails(client)}>Ver detalle</Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className='text-center'>No clients found for this group.</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </section>
            </Container>

            <FooterComponent />

            {/* Modal para mostrar los detalles del cliente */}
            <Modal show={showModal} onHide={handleCloseModal} size='xl' centered>
                <Modal.Header closeButton>
                    <Modal.Title>Detalle del Cliente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedClient && (
                        <>
                            <p><strong>ID:</strong> {selectedClient.id}</p>
                            <p><strong>Nombre:</strong> {selectedClient.name}</p>
                            <p><strong>Responsable:</strong> {selectedClient.responsible}</p>
                            <p><strong>Descripción:</strong> {selectedClient.description}</p>
                            <p><strong>Ubicación:</strong> {getLocationName(selectedClient.locationId)}</p>

                            {/* Secciones del cliente */}
                            <h5>Información clave</h5>
                            {getClientSections(selectedClient.id).length > 0 ? (
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Criterio</th>
                                            <th>Nombre</th>
                                            <th>Percepción</th>
                                            <th>KPI Name</th>
                                            <th>KPI Referencia</th>
                                            <th>KPI Value</th>
                                            {/* <th>Activo</th> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getClientSections(selectedClient.id).map(section => (
                                            <tr key={section.id}>
                                                <td>{getSectionTypeName(section.sectionTypeId)}</td>
                                                <td>{section.name}</td>
                                                <td>{section.percepcion}</td>
                                                <td>{section.kpiname}</td>
                                                <td>{section.kpireferencia}</td>
                                                <td>{section.kpivalue}</td>
                                                {/* <td>{section.active ? 'Sí' : 'No'}</td> */}
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            ) : (
                                <p>No secciones found for this client.</p>
                            )}
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>

        </Container>
    );
};
