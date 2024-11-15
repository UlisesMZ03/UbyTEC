import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { Nav } from 'react-bootstrap';
import './AdminDashboard.css';

const Sidebar = ({ sections, activeSection, setActiveSection, isOpen, toggle }) => (
  <div className={`sidebar bg-light border-right ${isOpen ? 'is-open' : ''}`} style={{ minHeight: '100vh' }}>
    <div className="sidebar-header"></div>
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
    'Gestión de Administradores del Comercio Afiliado',
    'Administración de Afiliaciones',
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

      <div className="content p-4">
        <h1 className="dashboard-title">Dashboard del Administrador</h1>

        {/* Contenido basado en la sección activa */}
        {activeSection === 'Gestión de Administradores/Empleados' && (
          <section className="section">
            <h2>Gestión de Administradores/Empleados</h2>
            <form onSubmit={handleAddAdmin}>
              <div className="form-group">
                <label>Número Cédula</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={newAdmin.cedula} 
                  onChange={(e) => setNewAdmin({ ...newAdmin, cedula: e.target.value })} 
                />
              </div>
              <div className="form-group">
                <label>Nombre Completo</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={newAdmin.nombre} 
                  onChange={(e) => setNewAdmin({ ...newAdmin, nombre: e.target.value })} 
                />
              </div>
              <div className="form-group">
                <label>Dirección</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={newAdmin.direccion} 
                  onChange={(e) => setNewAdmin({ ...newAdmin, direccion: e.target.value })} 
                />
              </div>
              <div className="form-group">
                <label>Teléfonos</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={newAdmin.telefono} 
                  onChange={(e) => setNewAdmin({ ...newAdmin, telefono: e.target.value })} 
                />
              </div>
              <div className="form-group">
                <label>Usuario</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={newAdmin.usuario} 
                  onChange={(e) => setNewAdmin({ ...newAdmin, usuario: e.target.value })} 
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input 
                  type="password" 
                  className="form-control" 
                  value={newAdmin.password} 
                  onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })} 
                />
              </div>
              <button type="submit" className="btn btn-primary">Agregar Administrador</button>
            </form>
          </section>
        )}

        {activeSection === 'Gestión de Afiliados' && (
          <section className="section">
            <h2>Gestión de Afiliados</h2>
            <form onSubmit={handleAddAffiliate}>
              <div className="form-group">
                <label>Número Cédula Jurídica</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={newAffiliate.cedulaJuridica} 
                  onChange={(e) => setNewAffiliate({ ...newAffiliate, cedulaJuridica: e.target.value })} 
                />
              </div>
              <div className="form-group">
                <label>Nombre del Comercio</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={newAffiliate.nombreComercio} 
                  onChange={(e) => setNewAffiliate({ ...newAffiliate, nombreComercio: e.target.value })} 
                />
              </div>
              <div className="form-group">
                <label>Tipo de Comercio</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={newAffiliate.tipoComercio} 
                  onChange={(e) => setNewAffiliate({ ...newAffiliate, tipoComercio: e.target.value })} 
                />
              </div>
              <div className="form-group">
                <label>Dirección</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={newAffiliate.direccion} 
                  onChange={(e) => setNewAffiliate({ ...newAffiliate, direccion: e.target.value })} 
                />
              </div>
              <div className="form-group">
                <label>Teléfonos</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={newAffiliate.telefono} 
                  onChange={(e) => setNewAffiliate({ ...newAffiliate, telefono: e.target.value })} 
                />
              </div>
              <div className="form-group">
                <label>Correo Electrónico</label>
                <input 
                  type="email" 
                  className="form-control" 
                  value={newAffiliate.correo} 
                  onChange={(e) => setNewAffiliate({ ...newAffiliate, correo: e.target.value })} 
                />
              </div>
              <div className="form-group">
                <label>Sinpe Móvil</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={newAffiliate.sinpe} 
                  onChange={(e) => setNewAffiliate({ ...newAffiliate, sinpe: e.target.value })} 
                />
              </div>
              <div className="form-group">
                <label>Administrador del Comercio</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={newAffiliate.administrador} 
                  onChange={(e) => setNewAffiliate({ ...newAffiliate, administrador: e.target.value })} 
                />
              </div>
              <button type="submit" className="btn btn-primary">Agregar Afiliado</button>
            </form>
          </section>
        )}

        {/* Implementar más secciones conforme a las demás funcionalidades */}
      </div>
    </div>
  );
}
