import { useState } from 'react'
import React from 'react';
import { Toaster } from 'react-hot-toast';
import { LoginPage } from './pages/LoginPage';
import { MenuPage } from './pages/user/MenuPage';
import { GroupPage } from './pages/user/GroupPage';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import PrivateRoutes from './components/PrivateRoutes';
import AdminRoutes from './components/AdminRoutes';
import "bootstrap-icons/font/bootstrap-icons.css";


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/*" element={<Navigate to="/login" />} />
                <Route element={<PrivateRoutes />}>
                    <Route path="/menu" element={<MenuPage />} />
                    <Route path="/group/:id" element={<GroupPage />} />
                    <Route element={<AdminRoutes />}>
                    </Route>
                </Route>
            </Routes>
            <Toaster position="top-center" reverseOrder={false} />
        </BrowserRouter>
    )
}
export default App