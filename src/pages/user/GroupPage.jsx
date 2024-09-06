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

    const getBackgroundColor = (percepcion) => {
        // Clamps the value to be between 0 and 100
        const clampedPercepcion = Math.max(0, Math.min(percepcion, 100));
        
        // Define colors
        const green = { r: 102, g: 174, b: 94 }; // #66ae5e
        const yellow = { r: 251, g: 198, b: 59 }; // #fbc63b
        const gray = { r: 211, g: 211, b: 211 }; // #d3d3d3
    
        let color;
    
        if (clampedPercepcion < 50) {
            // Transition from gray (red) to yellow
            const ratio = clampedPercepcion / 50;
            color = {
                r: Math.round(gray.r + ratio * (yellow.r - gray.r)),
                g: Math.round(gray.g + ratio * (yellow.g - gray.g)),
                b: Math.round(gray.b + ratio * (yellow.b - gray.b))
            };
        } else {
            // Transition from yellow to green
            const ratio = (clampedPercepcion - 50) / 50;
            color = {
                r: Math.round(yellow.r + ratio * (green.r - yellow.r)),
                g: Math.round(yellow.g + ratio * (green.g - yellow.g)),
                b: Math.round(yellow.b + ratio * (green.b - yellow.b))
            };
        }
    
        // Set alpha to 0.2 for transparency
        return `rgba(${color.r}, ${color.g}, ${color.b}, 0.3)`;
    };
    
    

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

    const getClientSections = (clientId) => {
        return sections.filter(section => section.clientId === clientId);
    };

    const getSectionsByType = (clientId) => {
        const clientSections = getClientSections(clientId);
        const groupedByType = sectionTypes.map(type => ({
            sectionType: type.name,
            sections: clientSections.filter(section => section.sectionTypeId === type.id),
        }));
        return groupedByType;
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
                <h2 className='text-center'>Clientes {groupName}</h2>
                <section id="clients">
                    <Table striped bordered hover>
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
                                    <td colSpan="5" className='text-center'>No se encontraron clientes para este grupo.</td>
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
                            {/* <p><strong>ID:</strong> {selectedClient.id}</p> */}
                            <p><strong>Nombre:</strong> {selectedClient.name}</p>
                            <p><strong>Responsable:</strong> {selectedClient.responsible}</p>
                            <p><strong>Ubicación:</strong> {getLocationName(selectedClient.locationId)}</p>

                            {/* Secciones agrupadas por tipo */}
                            <h5 className='fw-bold'>Información clave:</h5>
                            {getSectionsByType(selectedClient.id).map(group => (
                                group.sections.length > 0 && (
                                    <div key={group.sectionType} className='pt-2'>
                                        <h6 className='fw-bold'>{group.sectionType}</h6>
                                        <div className="row g-3 justify-content-center">
                                            {group.sections.map(section => (
                                                <div className="col-lg-4 col-md-6 col-sm-12" key={section.id}>
                                                    <div className="card h-100" style={{ background: getBackgroundColor(section.percepcion) }}>
                                                        <div className="card-body">
                                                            <h5 className="card-title">{section.name}</h5>
                                                            <p className="card-text"><strong>Percepción:</strong> {section.percepcion}%</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )
                            ))}
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
