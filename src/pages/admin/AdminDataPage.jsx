import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Container, Button, Spinner, Row, Col, Form } from 'react-bootstrap';
import { updateData, getOldData, uploadNewData } from '../../api/data.api'; // Funciones API
import { NavbarComponent } from '../../components/NavbarComponent';
import { FooterComponent } from '../../components/FooterComponent';

export const AdminDataPage = () => {
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);

    // Función para actualizar los datos (ejecuta el script de carga masiva)
    const handleUpdateInfo = async () => {
        setLoading(true);
        try {
            await updateData();
            toast.success('Datos actualizados correctamente!');
        } catch (error) {
            toast.error('Error actualizando los datos. Por favor, revise el archivo.');
        } finally {
            setLoading(false);
        }
    };

    // Función para descargar los datos actuales (old_data)
    const handleDownloadData = async () => {
        setLoading(true);
        try {
            const response = await getOldData();
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'old_data.xlsx';
            document.body.appendChild(a);
            a.click();
            a.remove();
            toast.success('Descarga de datos completa!');
        } catch (error) {
            toast.error('Error descargando los datos.');
        } finally {
            setLoading(false);
        }
    };

    // Función para manejar la carga de archivos
    const handleFileUpload = (e) => {
        setFile(e.target.files[0]); // Guardar el archivo en el estado
    };

    /// Función para subir el archivo
    const handleUploadExcel = async () => {
        if (!file) {
            toast.error('Por favor, selecciona un archivo para subir.');
            return;
        }
        const formData = new FormData();
        formData.append('file', file); // El campo 'file' debe coincidir con el backend

        setLoading(true);
        try {
            await uploadNewData(formData); // Enviar el archivo con FormData
            toast.success('Archivo subido y procesado correctamente!');
        } catch (error) {
            console.error('Error subiendo el archivo:', error);
            toast.error('Error subiendo el archivo.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <Container fluid className='p-0'>
            <NavbarComponent />
            <Container fluid className='p-5 mt-5'>
                <Row className="mb-4">
                    <Col xs={7} md={10}>
                        <h1>Administrar información del sistema</h1>
                    </Col>
                    <Col xs={5} md={2}>
                        <Button onClick={handleUpdateInfo} disabled={loading}>
                            {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Actualizar'}
                        </Button>
                    </Col>
                </Row>

                <h3>Datos actuales</h3>
                <Button variant="info" onClick={handleDownloadData} disabled={loading}>
                    {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Descargar datos actuales'}
                </Button>

                <hr />

                <h3>Cargar nuevo archivo Excel</h3>
                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Selecciona el archivo Excel para cargar</Form.Label>
                    <Form.Control type="file" accept=".xlsx" onChange={handleFileUpload} />
                </Form.Group>
                <Button variant="primary" onClick={handleUploadExcel} disabled={loading}>
                    {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Subir archivo'}
                </Button>
            </Container>
            <FooterComponent />
        </Container>
    );
};
