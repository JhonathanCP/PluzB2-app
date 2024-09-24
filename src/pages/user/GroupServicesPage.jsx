import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { NavbarComponent } from '../../components/NavbarComponent';
import { FooterComponent } from '../../components/FooterComponent';
import { useNavigate, useParams } from 'react-router-dom'; // Para recibir el groupId de la URL
import { getGroupServices } from '../../api/groupservices.api'; // Importar la API de servicios

export const GroupServicesPage = () => {
    const navigate = useNavigate();
    const { groupId } = useParams(); // Obtener el groupId desde la URL
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await getGroupServices(); // Obtener todos los servicios
                const filteredServices = response.data.filter(service => service.groupId === parseInt(groupId)); // Filtrar por groupId
                setServices(filteredServices); // Asignar los servicios filtrados
                setLoading(false);
            } catch (error) {
                console.error('Error al cargar los servicios del grupo:', error);
                setLoading(false);
            }
        };

        fetchServices();
    }, [groupId]);

    return (
        <Container fluid className="p-5">
            <NavbarComponent />

            <Container className="py-5">
                <h2 className="text-center mb-4">Nuestros Servicios</h2>
                
                {loading ? (
                    <div className="text-center">
                        <Spinner animation="border" />
                    </div>
                ) : services.length === 0 ? (
                    <p className="text-center">No hay servicios disponibles para este grupo.</p>
                ) : (
                    <Row>
                        {services.map((service) => (
                            <Col key={service.id} xs={12} md={6} className="mb-4">
                                <Card onClick={() => navigate(`/group/${groupId}/service/${service.id}`)} className="service-card clickable-card">
                                    <Card.Body className='p-4'>
                                        <Card.Title className="text-center text-white">{service.name}</Card.Title>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>

            <FooterComponent />
        </Container>
    );
};
