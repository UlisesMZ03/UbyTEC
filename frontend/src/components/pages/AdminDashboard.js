import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { Nav } from 'react-bootstrap';
import './AdminDashboard.css';
import GoalsSection from '../GoalsSection';
import GestionAdminEmpl from './GestionAdminEmpl';
import GestionAfiliados from './GestionAfiliados';
import GestionAdminAfiliado from './GestionAdminAfiliado'
import GestionRepartidores from './GestionRepartidores';
import GestionTiposDeComercio from './GestionTipoComercio';
import SolicitudesComercio from './SolicitudesComercio';
import ReporteConsolidadoVentas from './ReporteConsolidadoVentas';
import ReporteVentasPorAfiliado from './ReporteVentasPorAfiliado';
const Sidebar = ({ sections, activeSection, setActiveSection, isOpen, toggle }) => (
  <div className={`sidebar  ${isOpen ? 'is-open' : ''}`} style={{ minHeight: '100vh' }}>
    <div className="sidebar-header">
      <h4>Panel de Administrador</h4>
    </div>
    <Nav className="flex-column pt-2">
      {sections.map((section) => (
        <Nav.Item key={section} className={activeSection === section ? 'active' : ''}>
          <Nav.Link 
            as="button" 
            className="nav-link" 
            onClick={() => setActiveSection(section)}
          >
            <FontAwesomeIcon icon={faHome} className="mr-2" /> 
            {section}
          </Nav.Link>
        </Nav.Item>
      ))}
    </Nav>
  </div>
);

export default function AdminDashboard() {
  const navigate = useNavigate();
  const sections = [
    'Gestión de Administradores/Empleados',
    'Gestión de Afiliados',
    'Gestión de Administradores de Comercios',
    'Solicitudes de Afiliaciones',
    'Gestión de Tipos de Comercio',
    'Gestión de Repartidores',
    'Reportes Consolidado de Ventas',
    'Reportes Ventas por Afiliado',
  ];
  
  const [activeSection, setActiveSection] = useState(sections[0]);
  const [isOpen, setIsOpen] = useState(true);

  // Estados para los formularios
  const [newAdmin, setNewAdmin] = useState({ cedula: '', nombre: '', direccion: '', telefono: '', usuario: '', password: '' });
  const [newAffiliate, setNewAffiliate] = useState({ cedulaJuridica: '', nombreComercio: '', tipoComercio: '', direccion: '', telefono: '', correo: '', sinpe: '', administrador: '' });
  const [newDistributor, setNewDistributor] = useState({ cedulaJuridica: '', nombre: '', region: '' });
  const [newTypeOfCommerce, setNewTypeOfCommerce] = useState({ id: '', nombre: '', descripcion: '' });
  const [newCourier, setNewCourier] = useState({ nombre: '', direccion: '', telefono: '', correo: '', usuario: '' });

  const [errorMessage, setErrorMessage] = useState('');

  // Funciones de manejo de formularios
  const handleAddAdmin = (e) => {
    e.preventDefault();
    if (!newAdmin.cedula || !newAdmin.nombre || !newAdmin.direccion || !newAdmin.telefono || !newAdmin.usuario || !newAdmin.password) {
      setErrorMessage('Por favor, complete toda la información del administrador.');
      return;
    }

    // Lógica de backend para agregar administrador (ejemplo de envío de datos)
    console.log(newAdmin);
    setNewAdmin({ cedula: '', nombre: '', direccion: '', telefono: '', usuario: '', password: '' });
  };

  const handleAddAffiliate = (e) => {
    e.preventDefault();
    if (!newAffiliate.cedulaJuridica || !newAffiliate.nombreComercio || !newAffiliate.tipoComercio || !newAffiliate.direccion || !newAffiliate.telefono || !newAffiliate.correo || !newAffiliate.sinpe || !newAffiliate.administrador) {
      setErrorMessage('Por favor, complete toda la información del afiliado.');
      return;
    }

    // Lógica de backend para agregar afiliado
    console.log(newAffiliate);
    setNewAffiliate({ cedulaJuridica: '', nombreComercio: '', tipoComercio: '', direccion: '', telefono: '', correo: '', sinpe: '', administrador: '' });
  };

  const handleAddDistributor = (e) => {
    e.preventDefault();
    if (!newDistributor.cedulaJuridica || !newDistributor.nombre || !newDistributor.region) {
      setErrorMessage('Por favor, complete toda la información del distribuidor.');
      return;
    }

    // Lógica de backend para agregar distribuidor
    console.log(newDistributor);
    setNewDistributor({ cedulaJuridica: '', nombre: '', region: '' });
  };

  const handleAddTypeOfCommerce = (e) => {
    e.preventDefault();
    if (!newTypeOfCommerce.nombre || !newTypeOfCommerce.descripcion) {
      setErrorMessage('Por favor, complete toda la información del tipo de comercio.');
      return;
    }

    // Lógica de backend para agregar tipo de comercio
    console.log(newTypeOfCommerce);
    setNewTypeOfCommerce({ id: '', nombre: '', descripcion: '' });
  };

  const handleAddCourier = (e) => {
    e.preventDefault();
    if (!newCourier.nombre || !newCourier.direccion || !newCourier.telefono || !newCourier.correo || !newCourier.usuario) {
      setErrorMessage('Por favor, complete toda la información del repartidor.');
      return;
    }

    // Lógica de backend para agregar repartidor
    console.log(newCourier);
    setNewCourier({ nombre: '', direccion: '', telefono: '', correo: '', usuario: '' });
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="dashboard-container d-flex">
      <Sidebar 
        sections={sections} 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        isOpen={isOpen} 
        toggle={toggleSidebar} 
      />

      <div className="content-adminDashboard p-4">
       

        {/* Contenido basado en la sección activa */}
        {activeSection === 'Gestión de Administradores/Empleados' && <GestionAdminEmpl />}
        {activeSection === 'Gestión de Afiliados' && <GestionAfiliados />}
        {activeSection === 'Gestión de Administradores de Comercios' && <GestionAdminAfiliado/>}
        {activeSection === 'Gestión de Repartidores' && <GestionRepartidores/>}
        {activeSection === 'Gestión de Tipos de Comercio' && <GestionTiposDeComercio/>}
        {activeSection === 'Solicitudes de Afiliaciones' && <SolicitudesComercio/>}
        {activeSection === 'Reportes Consolidado de Ventas' && <ReporteConsolidadoVentas/>}
        {activeSection === 'Reportes Ventas por Afiliado' && <ReporteVentasPorAfiliado/>}
        
        
        
        {/* Implementar más secciones conforme a las demás funcionalidades */}
      </div>
    </div>
  );
}
