import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Container, Table, Button, Modal, Form, Spinner, Row, Col } from 'react-bootstrap';
import { getGroups, createGroup, updateGroup, deleteGroup } from '../../api/group.api';
import { getGroupServices, createGroupService, updateGroupService, deleteGroupService } from '../../api/groupservices.api';
import { getServiceSections, createServiceSection } from '../../api/servicesection.api'; // API para ServiceSection
import { getSectionTypes } from '../../api/sectionType.api'; // API para SectionTypes
import { NavbarComponent } from '../../components/NavbarComponent';
import { FooterComponent } from '../../components/FooterComponent';

export const AdminGroupsPage = () => {
    const [groups, setGroups] = useState([]);
    const [groupServices, setGroupServices] = useState([]);
    const [serviceSections, setServiceSections] = useState([]); // Manejar ServiceSections
    const [sectionTypes, setSectionTypes] = useState([]); // Manejar SectionTypes
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedSectionType, setSelectedSectionType] = useState(null); // Para seleccionar el SectionType
    const [showModal, setShowModal] = useState(false);
    const [showServiceModal, setShowServiceModal] = useState(false); // Para los servicios
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const groupsResponse = await getGroups();
            const sectionTypesResponse = await getSectionTypes(); // Obtener los tipos de secciones
            setGroups(groupsResponse.data);
            setSectionTypes(sectionTypesResponse.data); // Guardar los SectionTypes
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleShowModal = (group = null) => {
        setSelectedGroup(group);
        if (group) {
            fetchGroupServices(group.id); // Cargar los servicios del grupo seleccionado
        }
        setShowModal(true);
    };

    const fetchGroupServices = async (groupId) => {
        const servicesResponse = await getGroupServices(groupId);
        setGroupServices(servicesResponse.data);
    };

    const handleSaveGroup = async (event) => {
        event.preventDefault();

        // Validar que todos los campos del grupo estén completos
        if (!selectedGroup?.name || !selectedGroup?.description || !selectedGroup?.icon) {
            toast.error('Por favor, completa todos los campos del grupo.');
            return;
        }

        if (selectedGroup.id) {
            await updateGroup(selectedGroup.id, selectedGroup);
            toast.success('Grupo actualizado correctamente!');
        } else {
            await createGroup(selectedGroup);
            toast.success('Grupo creado correctamente!');
        }

        setShowModal(false);
        const groupsResponse = await getGroups();
        setGroups(groupsResponse.data);
    };

    const handleDeleteGroup = async (groupId) => {
        await deleteGroup(groupId);
        const updatedGroups = groups.filter(group => group.id !== groupId);
        setGroups(updatedGroups);
        toast.success('Grupo eliminado correctamente!');
    };

    // Funciones para los servicios del grupo
    const handleShowServiceModal = (service = null) => {
        setSelectedService(service);
        setShowServiceModal(true);
    };

    const handleSaveService = async (event) => {
        event.preventDefault();

        // Validar que todos los campos del servicio estén completos
        if (!selectedService?.name || !selectedService?.description) {
            toast.error('Por favor, completa todos los campos del servicio.');
            return;
        }

        const serviceData = { ...selectedService, groupId: selectedGroup.id };

        if (selectedService.id) {
            await updateGroupService(selectedService.id, serviceData);
            toast.success('Servicio actualizado correctamente!');
        } else {
            const createdService = await createGroupService(serviceData);
            toast.success('Servicio creado correctamente!');

            // Crear una sección de servicio vinculada al nuevo servicio
            if (selectedSectionType) {
                const serviceSectionData = {
                    name: `${createdService.data.name} - Sección`,
                    groupId: selectedGroup.id,
                    serviceId: createdService.data.id,
                    sectionTypeId: selectedSectionType.id, // Usar el tipo de sección seleccionado
                };
                await createServiceSection(serviceSectionData);
                toast.success('Sección de servicio creada correctamente!');
            }
        }

        setShowServiceModal(false);
        fetchGroupServices(selectedGroup.id);
    };

    const handleDeleteService = async (serviceId) => {
        await deleteGroupService(serviceId);
        const updatedServices = groupServices.filter(service => service.id !== serviceId);
        setGroupServices(updatedServices);
        toast.success('Servicio eliminado correctamente!');
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
                        <h1>Administrar Grupos</h1>
                    </Col>
                    <Col xs={5} md={2}>
                        <Button onClick={() => handleShowModal()}>Crear Grupo</Button>
                    </Col>
                </Row>
                <Table striped bordered hover className='mt-3'>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Icono</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {groups.map(group => (
                            <tr key={group.id}>
                                <td>{group.name}</td>
                                <td>{group.description}</td>
                                <td><i className={`bi bi-${group.icon}`}></i></td>
                                <td>
                                    <Button onClick={() => handleShowModal(group)}>Editar</Button>{' '}
                                    <Button variant="danger" onClick={() => handleDeleteGroup(group.id)}>Eliminar</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
            <FooterComponent />

            {/* Modal para crear/editar grupo */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size='xl' centered>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedGroup ? 'Editar Grupo' : 'Crear Grupo'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId='name'>
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type='text'
                                value={selectedGroup?.name || ''}
                                onChange={e => setSelectedGroup({ ...selectedGroup, name: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId='description'>
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control
                                type='text'
                                value={selectedGroup?.description || ''}
                                onChange={e => setSelectedGroup({ ...selectedGroup, description: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId='icon'>
                            <Form.Label>Icono</Form.Label>
                            <Form.Control
                                type='text'
                                value={selectedGroup?.icon || ''}
                                onChange={e => setSelectedGroup({ ...selectedGroup, icon: e.target.value })}
                            />
                        </Form.Group>

                        {/* Sección para los servicios del grupo */}
                        {selectedGroup?.id && (
                            <>
                                <h5 className='mt-4'>Servicios del Grupo</h5>
                                <Button onClick={() => handleShowServiceModal()}>Agregar Servicio</Button>
                                <Table striped bordered hover className='mt-3'>
                                    <thead>
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Descripción</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {groupServices.map(service => (
                                            <tr key={service.id}>
                                                <td>{service.name}</td>
                                                <td>{service.description}</td>
                                                <td>
                                                    <Button onClick={() => handleShowServiceModal(service)}>Editar</Button>{' '}
                                                    <Button variant="danger" onClick={() => handleDeleteService(service.id)}>Eliminar</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </>
                        )}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={() => setShowModal(false)}>
                        Cerrar
                    </Button>
                    <Button variant='primary' onClick={handleSaveGroup}>
                        {selectedGroup ? 'Guardar Cambios' : 'Crear Grupo'}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal para crear/editar servicio */}
            <Modal show={showServiceModal} onHide={() => setShowServiceModal(false)} size='lg' centered>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedService ? 'Editar Servicio' : 'Crear Servicio'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId='name'>
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type='text'
                                value={selectedService?.name || ''}
                                onChange={e => setSelectedService({ ...selectedService, name: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId='description'>
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control
                                type='text'
                                value={selectedService?.description || ''}
                                onChange={e => setSelectedService({ ...selectedService, description: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId='sectionType'>
                            <Form.Label>Tipo de Sección</Form.Label>
                            <Form.Control
                                as='select'
                                value={selectedSectionType?.id || ''}
                                onChange={e => setSelectedSectionType(sectionTypes.find(type => type.id === e.target.value))}
                            >
                                <option value=''>Selecciona un tipo de sección</option>
                                {sectionTypes.map(type => (
                                    <option key={type.id} value={type.id}>
                                        {type.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={() => setShowServiceModal(false)}>
                        Cerrar
                    </Button>
                    <Button variant='primary' onClick={handleSaveService} disabled={!selectedGroup?.id}>
                        {selectedService ? 'Guardar Cambios' : 'Crear Servicio'}
                    </Button>
                </Modal.Footer>
            </Modal>

        </Container>
    );
};
