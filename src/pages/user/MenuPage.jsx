// src/pages/MenuPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Carousel, Button, Row, Col } from 'react-bootstrap';
import { NavbarComponent } from '../../components/NavbarComponent';
import { FooterComponent } from '../../components/FooterComponent';
import { getGroups } from '../../api/group.api.js';
import '../../assets/main.css'; // Opcional para estilos adicionales
import Img from '../../assets/street.jpg'; // Importa la imagen correctamente
import Logo from '../../assets/Logo-blanco.png';
import InformativeImage from '../../assets/client.png'; // Imagen para la sección informativa
import 'aos/dist/aos.css';
import AOS from 'aos';

export const MenuPage = () => {
    const navigate = useNavigate();
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        AOS.init();
        const fetchGroups = async () => {
            try {
                const response = await getGroups();
                setGroups(response.data);
            } catch (error) {
                console.error('Error fetching clients:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchGroups();
    }, []);

    const handleViewMore = (groupId) => {
        navigate(`/groups/${groupId}`);
    };

    return (
        <Container fluid className='p-0'>
            
            <NavbarComponent />

            <Container fluid className='banner-container'>
                <Row className='px-5 py-5 d-flex banner'>
                    <Col xs={12} md={12} xl={7} className='px-2 text-white ' data-aos="fade-in" data-aos-delay="250">
                        <div className='d-flex justify-content-center d-xl-none'><img className='' style={{ height: '35px' }} src={Logo}></img></div>
                        <div className='d-none d-xl-block pb-3'><img style={{ height: '50px' }} src={Logo}></img></div>
                        <h2 className='d-xl-none text-center fw-bold'>Buyer Profile</h2>
                        <h4 className='d-xl-none text-center'>Es hora de conocer más sobre nuestros potenciales clientes.</h4>
                        <h2 className='d-none d-xl-block fw-bold'>Buyer Profile</h2>
                        <h4 className='d-none d-xl-block'>Es hora de conocer más sobre nuestros potenciales clientes.</h4>
                    </Col>
                    <Col xs={12} md={12} xl={5} className='py-0 d-flex align-items-center justify-content-center'>
                        <img src={InformativeImage} className="img-fluid img-banner" alt="" data-aos="zoom-out" data-aos-delay="250" />
                    </Col>
                </Row>
            </Container>

            <Container fluid className='pb-5'>
                <section id="services" className='services'>
                    <div className="row d-flex align-items-center justify-content-center px-0">
                        {groups.sort((a, b) => a.id - b.id).map((group) => (
                            <div
                                key={group.id}
                                className="col-sm-12 col-md-6 col-lg-4 col-xxl-3 mt-4 d-flex align-items-center justify-content-center"
                                onClick={() => navigate(`/group/${group.id}`)}
                            >
                                <div className="service-item">
                                    <div className="icon">
                                        <i className={`bi bi-${group.icon}`} style={{ color: '#3058a1' }}></i>
                                    </div>
                                    <h3>{group.name}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </Container>
            <FooterComponent />
        </Container>
    );
};
