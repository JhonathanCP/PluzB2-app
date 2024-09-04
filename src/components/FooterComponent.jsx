// src/components/Footer.jsx

import React from 'react';
import '../assets/main.css'; // Asegúrate de crear este archivo para los estilos

export const FooterComponent = () => {
    return (
        <footer className="fixed-bottom text-white px-0 m-0 footer" style={{ minHeight: '2vh' }}>
                <div className='container-fluid'>
                    <div className='row d-flex d-sm-none px-2'>
                        <div className="col-6 text-start">© PLUZ</div>
                        <div className="col-6 text-end">Versión: 1.0.0</div>
                    </div>
                    <div className='row d-none d-md-flex px-2'>
                        <div className="col-10 text-start">© PLUZ Energía Perú S.A.A.</div>
                        <div className="col-2 text-end">Versión: 1.0.0</div>
                    </div>
                </div>
            </footer>
    );
};
