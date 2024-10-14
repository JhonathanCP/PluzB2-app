import { useState } from 'react'
import React from 'react';
import { Toaster } from 'react-hot-toast';
import { LoginPage } from './pages/LoginPage';
import { MenuPage } from './pages/user/MenuPage';
import { GroupServiceDetailPage } from './pages/user/GroupServiceDetailPage';
import { AdminGroupsPage } from './pages/admin/AdminGroupsPage';
import { AdminClientsPage } from './pages/admin/AdminClientsPage';
import { AdminSectionTypesPage } from './pages/admin/AdminSectionTypesPage';
import { AdminLocationsPage } from './pages/admin/AdminLocationPage';
import { AdminUsersPage } from './pages/admin/AdminUserPage';
import { GroupServicesPage } from './pages/user/GroupServicesPage';
import { ChangePasswordPage } from './pages/user/ChangePasswordPage';
import { AdminDataPage } from './pages/admin/AdminDataPage';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { PrivateRoutes } from './components/PrivateRoutes';
import { AdminRoutes } from './components/AdminRoutes';
import "bootstrap-icons/font/bootstrap-icons.css";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/*" element={<Navigate to="/menu" />} />
                <Route element={<PrivateRoutes />}>
                    <Route path="/menu" element={<MenuPage />} />
                    <Route path="/group/:groupId" element={<GroupServicesPage />}/>
                    <Route path="/group/:groupId/service/:serviceId" element={<GroupServiceDetailPage />} />
                    <Route path="/change-password" element={<ChangePasswordPage></ChangePasswordPage>} />
                    <Route element={<AdminRoutes />}>
                        <Route path="/admin/user" element={<AdminUsersPage />} />
                        <Route path="/admin/groups" element={<AdminGroupsPage />} />
                        <Route path="/admin/clients" element={<AdminClientsPage />} />
                        <Route path="/admin/section-types" element={<AdminSectionTypesPage />} />
                        <Route path="/admin/locations" element={<AdminLocationsPage />} />
                        <Route path="/admin/data" element={<AdminDataPage />} />
                    </Route>    
                </Route>
            </Routes>
            <Toaster position="top-center" reverseOrder={false} />
        </BrowserRouter>
    )
}
export default App