import React from "react";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/pages/Home";
import Login from "./components/pages/Login";
import Registrarse from "./components/pages/Registrarse";
import AdminDashboard from "./components/pages/AdminDashboard";
import ClientView from "./components/pages/ClientView";
import OnlineStore from "./components/pages/OnlineStore";
import ManageStore from "./components/pages/ManageStore";
import { AuthProvider } from "./AuthContext"; // Importa el AuthProvider
import ProfileManagement from "./components/pages/ProfileManagement";
import DeviceReports from "./components/pages/DeviceReports";
import UserProfilePage from './components/pages/UserProfilePage';
import ProductDetails from './components/pages/ProductDetails';

function App() {
  return (
    <>
      <AuthProvider>  {/* Envolvemos la aplicación con AuthProvider */}
        <Router>
          <Navbar />  {/* El Navbar tendrá acceso al contexto de autenticación */}
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registrarse" element={<Registrarse />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/client" element={<ClientView />} />
            <Route path="/tienda" element={<OnlineStore />} />
            <Route path="/producto/:id" element={<ProductDetails />} />
            <Route path="/gestionar-tienda" element={<ManageStore />} />
            <Route path="/profile" element={<ProfileManagement />} />
            <Route path="/reports" element={<DeviceReports />} />
            <Route path="/user-profile" element={UserProfilePage} />
            
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;
