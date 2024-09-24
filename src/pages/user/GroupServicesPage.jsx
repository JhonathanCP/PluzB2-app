import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { NavbarComponent } from '../../components/NavbarComponent';
import { FooterComponent } from '../../components/FooterComponent';
import { useNavigate } from 'react-router-dom';

export const GroupServicesPage = () => {
    const navigate = useNavigate();

    const services = [
        { id: 1, name: 'Servicio 1', description: 'Mayor estándar LED', path: '/service/1' },
        { id: 2, name: 'Servicio 2', description: 'Movimientos de redes', path: '/service/2' },
        { id: 3, name: 'Servicio 3', description: 'Estación de redes AP', path: '/service/3' },
        { id: 4, name: 'Servicio 4', description: 'Movilidad eléctrica', path: '/service/4' },
        { id: 1, name: 'Servicio 5', description: 'Mantenimiento preventivo de AP', path: '/service/1' },
        { id: 2, name: 'Servicio 6', description: 'Infraestructura Eléctrica', path: '/service/2' },
        { id: 3, name: 'Servicio 7', description: 'Mantenimiento correctivo de AP', path: '/service/3' },
        { id: 4, name: 'Servicio 8', description: 'Alquilar de infraestructura', path: '/service/4' },
    ];

    const handleServiceClick = (path) => {
        navigate(path);
    };

    return (
        <Container fluid className="p-5">
            <NavbarComponent />

            <Container className="py-5">
                <h2 className="text-center mb-4">Nuestros Servicios</h2>
                <Row>
                    {services.map((service) => (
                        <Col key={service.id} xs={12} md={6} className="mb-4">
                            <Card onClick={() => handleServiceClick(service.path)} className="service-card clickable-card">
                                <Card.Body className='p-4'>
                                    <Card.Title className="text-center text-white">{service.name}</Card.Title>
                                    <Card.Text className="text-center text-white">{service.description}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>

            <FooterComponent />
        </Container>
    );
};
