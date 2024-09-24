import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Table, Button, Modal, Spinner, Row, Col, Card } from 'react-bootstrap';
import { NavbarComponent } from '../../components/NavbarComponent.jsx';
import { FooterComponent } from '../../components/FooterComponent.jsx';
import { getClients } from '../../api/client.api.js';
import { getLocations } from '../../api/location.api.js';
import { getSections } from '../../api/section.api.js'; // Para obtener las secciones
import { getSectionTypes } from '../../api/sectionType.api.js'; // Para obtener los tipos de secciones
import { getGroups } from '../../api/group.api.js'; // Para obtener el nombre del grupo
import { getGroupServices } from '../../api/groupservices.api';
import { getServiceSections } from '../../api/servicesection.api'; // API para ServiceSection
import '../../assets/main.css';

export const GroupServiceDetailPage = () => {
    const { groupId, serviceId } = useParams(); // Obtener los IDs desde la URL
    const [clients, setClients] = useState([]);
    const [locations, setLocations] = useState([]);
    const [sections, setSections] = useState([]);
    const [sectionTypes, setSectionTypes] = useState([]);
    const [groupName, setGroupName] = useState('');
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [services, setServices] = useState([]);
    const [serviceDetails, setServiceDetails] = useState([]);

    useEffect(() => {
        const fetchClientsAndLocationsAndSections = async () => {
            try {
                // Obtener todos los clientes
                const clientResponse = await getClients();
                const filteredClients = clientResponse.data.filter(client => client.groupId === parseInt(groupId));
                setClients(filteredClients);

                // Obtener los servicios del grupo
                const servicesResponse = await getGroupServices();
                const filteredServices = servicesResponse.data.filter(service => service.id === parseInt(serviceId));
                setServices(filteredServices);

                // Obtener los detalles del servicio (ServiceSections)
                const serviceDetailsResponse = await getServiceSections();
                const filteredServiceDetails = serviceDetailsResponse.data.filter(
                    serviceDetail => serviceDetail.groupServiceId === parseInt(serviceId)
                );
                setServiceDetails(filteredServiceDetails);

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
                const group = groupResponse.data.find(group => group.id === parseInt(groupId));
                setGroupName(group ? group.name : 'Group');

            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchClientsAndLocationsAndSections();
    }, [groupId, serviceId]);

    const getBackgroundColor = (percepcion) => {
        const clampedPercepcion = Math.max(0, Math.min(percepcion, 100));
        const green = { r: 102, g: 174, b: 94 };
        const yellow = { r: 251, g: 198, b: 59 };
        const gray = { r: 211, g: 211, b: 211 };

        let color;

        if (clampedPercepcion < 50) {
            const ratio = clampedPercepcion / 50;
            color = {
                r: Math.round(gray.r + ratio * (yellow.r - gray.r)),
                g: Math.round(gray.g + ratio * (yellow.g - gray.g)),
                b: Math.round(gray.b + ratio * (yellow.b - gray.b)),
            };
        } else {
            const ratio = (clampedPercepcion - 50) / 50;
            color = {
                r: Math.round(yellow.r + ratio * (green.r - yellow.r)),
                g: Math.round(yellow.g + ratio * (green.g - yellow.g)),
                b: Math.round(yellow.b + ratio * (green.b - yellow.b)),
            };
        }

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
            sections: clientSections.filter(section => section.sectionTypeId === type.id && section.percepcion > 0),
        }));
        return groupedByType;
    };

    // Función para agrupar los ServiceSections por SectionType
    const getServiceSectionsByType = () => {
        return sectionTypes.map(type => ({
            sectionType: type.name,
            sections: serviceDetails.filter(section => section.sectionTypeId === type.id)
        })).filter(group => group.sections.length > 0);
    };

    if (loading) {
        return (
            <div className="text-center p-5">
                <Spinner animation="border" />
            </div>
        );
    }

    return (
        <Container fluid className="p-0">
            <NavbarComponent />
            <Container fluid className="mt-5 p-5">
                {services.length > 0 ? (
                    services.map(service => (
                        <Container fluid key={service.id}>
                            <Card className="service-card ">
                                <Card.Body className='p-2'>
                                    <Card.Title className="text-center text-white">Buyer profile de {service.name}</Card.Title>
                                </Card.Body>
                            </Card>
                            <section id="service-details">
                                <div className="mt-5 pb-5">
                                    <Row>
                                        {/* Columna para el ícono */}
                                        <Col lg={3} md={6} sm={12} className="d-flex align-items-center justify-content-center">
                                            <i className="bi bi-person-circle" style={{ fontSize: '200px', color: '#3058a1' }}></i>
                                        </Col>

                                        {/* Columna para las tarjetas */}
                                        <Col lg={9} md={6} sm={12}>
                                            <Row className="justify-content-center">
                                                {getServiceSectionsByType().map(group => (
                                                    <Col key={group.sectionType} lg={6} md={6} sm={12} className='py-2'>
                                                        <Card className="h-100">
                                                            <Card.Body>
                                                                <Card.Title className='text-center fw-bold'>{group.sectionType}</Card.Title>
                                                                {group.sections.map(section => (
                                                                    <Card.Text key={section.id}><i className='bi bi-vignette'></i> {section.name}</Card.Text>
                                                                ))}
                                                            </Card.Body>
                                                        </Card>
                                                    </Col>
                                                ))}
                                            </Row>
                                        </Col>
                                    </Row>
                                </div>
                            </section>
                        </Container>
                    ))
                ) : (
                    <p className="text-center">No se encontró el servicio especificado.</p>
                )}

                <Card className="service-card ">
                    <Card.Body className='p-2'>
                        <Card.Title className="text-center text-white">Buyer profile de Clientes {groupName}</Card.Title>
                    </Card.Body>
                </Card>
                <section id="clients" className='pt-3'>
                    <Table responsive striped bordered hover>
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
                                    <td colSpan="5" className="text-center">No se encontraron clientes para este grupo.</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </section>
            </Container>
            <FooterComponent />

            {/* Modal para mostrar los detalles del cliente */}
            <Modal show={showModal} onHide={handleCloseModal} size="xl" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Detalle del Cliente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedClient && (
                        <>
                            <h5><strong>Nombre:</strong> {selectedClient.name}</h5>
                            <h5><strong>Responsable:</strong> {selectedClient.responsible}</h5>
                            <h5><strong>Ubicación:</strong> {getLocationName(selectedClient.locationId)}</h5>

                            <h5 className="fw-bold">Información clave:</h5>
                            {getSectionsByType(selectedClient.id).map(group => (
                                group.sections.length > 0 && (
                                    <div key={group.sectionType} className="pt-2">
                                        <h5 className="fw-bold">{group.sectionType}</h5>
                                        <div className="row g-3 justify-content-center">
                                            {group.sections.sort((a, b) => b.percepcion - a.percepcion).map(section => (
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
