import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faBox, faShoppingCart, faTruck } from '@fortawesome/free-solid-svg-icons';
import './AdminAfiliado.css';
import GestionAdminAfiliado from './AdminAfiliadoGestion';
import GestionProductos from './GestionProductos'
import PedidosComercio from './PedidosComercio';
const Sidebar = ({ sections, activeSection, setActiveSection }) => (
  <div className="sidebar">
    <div className="sidebar-header">
      <h4>Panel de Comercio</h4>
    </div>
    <Nav className="flex-column">
      {sections.map((section) => (
        <Nav.Item key={section.name} className={`nav-item ${activeSection === section.name ? 'active' : ''}`}>
          <Nav.Link
            as="button"
            className="nav-link"
            onClick={() => setActiveSection(section.name)}
          >
            <FontAwesomeIcon icon={section.icon} className="me-2" />
            {section.name}
          </Nav.Link>
        </Nav.Item>
      ))}
    </Nav>
  </div>
);

export default function AdminAfiliado() {
  const sections = [
    { name: 'Gestión de Administradores', icon: faCog },
    { name: 'Gestión de Productos', icon: faBox },
    { name: 'Gestión de Pedidos', icon: faShoppingCart },
    { name: 'Asignación de Pedidos', icon: faTruck },
  ];

  const [activeSection, setActiveSection] = useState(sections[0].name);

  return (
    <div className="dashboardd-container">
      <Sidebar
        sections={sections}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      <div className="content-adminDashboard">

          <h1>{activeSection}</h1>
          {/* Renderizar contenido basado en la sección activa */}
          {activeSection === 'Gestión de Administradores' && <GestionAdminAfiliado />}
          {activeSection === 'Gestión de Productos' && <GestionProductos/>}
          {activeSection === 'Gestión de Pedidos' && <PedidosComercio/>}
          {activeSection === 'Asignación de Pedidos' && (
            <section className="section">
              <h2>Asignación de Pedidos a Repartidor</h2>
              <p>Asigna pedidos a repartidores disponibles según su cercanía.</p>
              <button className="btn btn-primary">Asignar Pedidos</button>
            </section>
          )}
        </div>
      </div>

  );
}
