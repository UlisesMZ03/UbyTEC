import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { Nav } from 'react-bootstrap';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  PieController,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import './AdminDashboard.css';

// Registra los elementos
ChartJS.register(ArcElement, Tooltip, Legend, PieController);

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
    'Gestión de Dispositivos',
    'Gestión de Tipos de Dispositivos',
    'Gestión de Distribuidores',
    'Indicadores del Sistema',
    'Gestión de la Tienda en Línea'
  ];
  
  const [activeSection, setActiveSection] = useState(sections[0]);
  const [isOpen, setIsOpen] = useState(true);
  const [devices, setDevices] = useState([]);
  const [deviceTypes, setDeviceTypes] = useState([]);
  const [distributors, setDistributors] = useState([]);
  const [devicesByRegionData, setDevicesByRegionData] = useState([]);
  const [regionChartData, setRegionChartData] = useState({ labels: [], data: [] }); // Estado para el gráfico de pastel

  const [newDevice, setNewDevice] = useState({ id: '', type: '', serialNumber: '', brand: '', powerConsumption: '' });
  const [editing, setEditing] = useState(false);
  const [newDeviceType, setNewDeviceType] = useState({ id: '', name: '', description: '', warrantyPeriod: '' });
  const [newDistributor, setNewDistributor] = useState({ juridicalId: '', name: '', region: '' });

  const [errorMessage, setErrorMessage] = useState('');
  const [typeErrorMessage, setTypeErrorMessage] = useState('');
  const [distributorErrorMessage, setDistributorErrorMessage] = useState('');
    // Cambiar esto según la lógica de tu aplicación
  const totalUsers = 10; 
  const devicesWithUsers = devices.filter(device => device.asociadoAUsuario);
  const devicesWithoutUsers = devices.filter(device => !device.asociadoAUsuario);
  const averageDevicesPerUser = totalUsers ? (devices.length / totalUsers).toFixed(2) : 0; // Definido aquí

  const dataForUserDevices = {
    labels: ['Dispositivos Asociados a Usuarios', 'Dispositivos No Asociados'],
    datasets: [{
      data: [devicesWithUsers.length, devicesWithoutUsers.length],
      backgroundColor: ['#FF6384', '#36A2EB'],
    }],
  };
  const fetchDevices = async () => {
    try {
      const response = await fetch('https://localhost:5555/api/Dispositivos');
      const data = await response.json();
      setDevices(data);
    } catch (error) {
      console.error("Error fetching devices:", error);
    }
  };

  const fetchDeviceTypes = async () => {
    try {
      const response = await fetch('https://localhost:5555/api/TipoDispositivo');
      const data = await response.json();
      setDeviceTypes(data);
    } catch (error) {
      console.error("Error fetching device types:", error);
    }
  };

  const fetchDistributors = async () => {
    try {
      const response = await fetch('https://localhost:5555/api/Distribuidor');
      const data = await response.json();
      setDistributors(data);
    } catch (error) {
      console.error("Error fetching distributors:", error);
    }
  };

  const fetchDevicesByRegion = async () => {
    try {
      const response = await fetch('https://localhost:5555/api/Producto/dispositivos-por-region');
      const data = await response.json();
      
      setDevicesByRegionData(data);
  
      // Transformar datos para el gráfico de pastel
      const labels = data.map(item => item.region); // Obtener las regiones
      const chartData = data.map(item => item.cantidad); // Obtener las cantidades
  
      const totalDevices = devices.length; // Total de dispositivos
      const definedDevicesCount = chartData.reduce((acc, count) => acc + count, 0); // Contar dispositivos definidos
      const undefinedDevicesCount = totalDevices - definedDevicesCount; // Contar dispositivos no definidos
  
      // Agregar la opción "No definida"
      const updatedLabels = [...labels, 'No definida'];
      const updatedData = [...chartData, undefinedDevicesCount];
  
      setRegionChartData({
        labels: updatedLabels,
        data: updatedData,
      });
    } catch (error) {
      console.error("Error fetching devices by region:", error);
    }
  };

  useEffect(() => {
    fetchDevices();
    fetchDeviceTypes(); 
    fetchDistributors(); 
    fetchDevicesByRegion(); 
  }, []);

  const handleAddDevice = async (e) => {
    e.preventDefault();
    if (!newDevice.type || !newDevice.serialNumber || !newDevice.brand || !newDevice.powerConsumption) {
      setErrorMessage('Por favor, complete toda la información del dispositivo.');
      return;
    }

    const deviceExists = devices.some(device => device.numeroSerie === newDevice.serialNumber);
    if (deviceExists) {
      setErrorMessage('No se puede agregar el dispositivo porque ya está asociado a un cliente.');
      return;
    }

    const deviceToAdd = {
      NumeroSerie: newDevice.serialNumber,
      Marca: newDevice.brand,
      ConsumoElectrico: newDevice.powerConsumption,
      TipoDispositivoId: newDevice.type 
    };

    try {
      const response = await fetch('https://localhost:5555/api/Dispositivos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deviceToAdd),
      });

      if (!response.ok) {
        throw new Error('Error al agregar el dispositivo');
      }

      setNewDevice({ id: '', type: '', serialNumber: '', brand: '', powerConsumption: '' });
      setEditing(false);
      setErrorMessage('');
      await fetchDevices(); 
    } catch (error) {
      setErrorMessage('Error al agregar el dispositivo: ' + error.message);
    }
  };

  const handleEditDevice = (device) => {
    setNewDevice({
      id: device.id,
      type: device.tipoDispositivo.id,
      serialNumber: device.numeroSerie,
      brand: device.marca,
      powerConsumption: device.consumoElectrico
    });
    setEditing(true); 
  };

  const handleUpdateDevice = async (e) => {
    e.preventDefault();
    if (!newDevice.type || !newDevice.serialNumber || !newDevice.brand || !newDevice.powerConsumption) {
      setErrorMessage('Por favor, complete toda la información del dispositivo.');
      return;
    }

    const deviceToUpdate = {
      NumeroSerie: newDevice.serialNumber,
      Marca: newDevice.brand,
      ConsumoElectrico: newDevice.powerConsumption,
      TipoDispositivoId: newDevice.type
    };

    try {
      const response = await fetch(`https://localhost:5555/api/Dispositivos/${newDevice.serialNumber}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deviceToUpdate),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || 'Error al actualizar el dispositivo');
      }

      setNewDevice({ id: '', type: '', serialNumber: '', brand: '', powerConsumption: '' });
      setEditing(false);
      setErrorMessage('');
      await fetchDevices(); 
    } catch (error) {
      setErrorMessage('Error al actualizar el dispositivo: ' + error.message);
    }
  };

  const handleAddDeviceType = async (e) => {
    e.preventDefault();
    if (!newDeviceType.name || !newDeviceType.description || !newDeviceType.warrantyPeriod) {
      setTypeErrorMessage('Por favor, complete toda la información del tipo de dispositivo.');
      return;
    }

    const deviceTypeToAdd = {
      nombre: newDeviceType.name,
      descripcion: newDeviceType.description,
      tiempoGarantia: newDeviceType.warrantyPeriod,
    };

    try {
      const response = await fetch('https://localhost:5555/api/TipoDispositivo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deviceTypeToAdd),
      });

      if (!response.ok) {
        throw new Error('Error al agregar el tipo de dispositivo');
      }

      const addedDeviceType = await response.json();
      setDeviceTypes([...deviceTypes, addedDeviceType]);
      setNewDeviceType({ id: '', name: '', description: '', warrantyPeriod: '' });
      setTypeErrorMessage('');
      await fetchDeviceTypes(); 
    } catch (error) {
      setTypeErrorMessage('Error al agregar el tipo de dispositivo: ' + error.message);
    }
  };

  const handleEditDeviceType = (deviceType) => {
    setNewDeviceType({
      id: deviceType.id,
      name: deviceType.nombre,
      description: deviceType.descripcion,
      warrantyPeriod: deviceType.tiempoGarantia
    });
    setEditing(true); 
  };

  const handleUpdateDeviceType = async (e) => {
    e.preventDefault();
    if (!newDeviceType.name || !newDeviceType.description || !newDeviceType.warrantyPeriod) {
      setTypeErrorMessage('Por favor, complete toda la información del tipo de dispositivo.');
      return;
    }

    const deviceTypeToEdit = {
      id: newDeviceType.id,
      nombre: newDeviceType.name,
      descripcion: newDeviceType.description,
      tiempoGarantia: newDeviceType.warrantyPeriod,
    };

    try {
      const response = await fetch(`https://localhost:5555/api/TipoDispositivo/${newDeviceType.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deviceTypeToEdit),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || 'Error al actualizar el tipo de dispositivo');
      }

      setNewDeviceType({ id: '', name: '', description: '', warrantyPeriod: '' });
      setEditing(false);
      setTypeErrorMessage('');
      await fetchDeviceTypes(); 
    } catch (error) {
      setTypeErrorMessage('Error al actualizar el tipo de dispositivo: ' + error.message);
    }
  };

  const handleAddDistributor = async (e) => {
    e.preventDefault();
    if (!newDistributor.juridicalId || !newDistributor.name || !newDistributor.region) {
      setDistributorErrorMessage('Por favor, complete toda la información del distribuidor.');
      return;
    }

    const distributorToAdd = {
      CedulaJuridica: newDistributor.juridicalId,
      Nombre: newDistributor.name,
      Region: newDistributor.region,
    };

    try {
      const response = await fetch('https://localhost:5555/api/Distribuidor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(distributorToAdd),
      });

      if (!response.ok) {
        throw new Error('Error al agregar el distribuidor');
      }

      await fetchDistributors(); 
      setNewDistributor({ juridicalId: '', name: '', region: '' });
      setDistributorErrorMessage('');
    } catch (error) {
      setDistributorErrorMessage('Error al agregar el distribuidor: ' + error.message);
    }
  };

  const handleEditDistributor = (distributor) => {
    setNewDistributor({
      juridicalId: distributor.cedulaJuridica,
      name: distributor.nombre,
      region: distributor.region,
    });
    setEditing(true); 
  };

  const handleUpdateDistributor = async (e) => {
    e.preventDefault();
    if (!newDistributor.juridicalId || !newDistributor.name || !newDistributor.region) {
      setDistributorErrorMessage('Por favor, complete toda la información del distribuidor.');
      return;
    }

    const distributorToUpdate = {
      CedulaJuridica: newDistributor.juridicalId,
      Nombre: newDistributor.name,
      Region: newDistributor.region,
    };

    try {
      const response = await fetch(`https://localhost:5555/api/Distribuidor/${newDistributor.juridicalId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(distributorToUpdate),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || 'Error al actualizar el distribuidor');
      }

      await fetchDistributors(); 
      setNewDistributor({ juridicalId: '', name: '', region: '' });
      setDistributorErrorMessage('');
      setEditing(false);
    } catch (error) {
      setDistributorErrorMessage('Error al actualizar el distribuidor: ' + error.message);
    }
  };

  const goToManageStore = () => {
    navigate("/gestionar-tienda");
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleCancelEdit = () => {
    setNewDevice({ id: '', type: '', serialNumber: '', brand: '', powerConsumption: '' });
    setNewDeviceType({ id: '', name: '', description: '', warrantyPeriod: '' });
    setNewDistributor({ juridicalId: '', name: '', region: '' });
    setEditing(false); 
    setErrorMessage('');
    setTypeErrorMessage('');
    setDistributorErrorMessage('');
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
        {activeSection === 'Gestión de Dispositivos' && (
          <section className="section">
            <h2>Gestión de Dispositivos</h2>
            <p>Aquí puedes agregar dispositivos, pero no puedes editar aquellos que ya han sido asignados a un cliente.</p>

            <form className="device-form" onSubmit={editing ? handleUpdateDevice : handleAddDevice}>
              <div className="form-group">
                <label>Tipo de dispositivo</label>
                <select
                  className="form-control"
                  value={newDevice.type}
                  onChange={(e) => setNewDevice({ ...newDevice, type: e.target.value })}
                >
                  <option value="">Selecciona un tipo de dispositivo</option>
                  {deviceTypes.map((deviceType) => (
                    <option key={deviceType.id} value={deviceType.id}>
                      {deviceType.nombre} (ID: {deviceType.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Número de serie</label>
                <input
                  type="text"
                  className="form-control"
                  value={newDevice.serialNumber}
                  onChange={(e) => setNewDevice({ ...newDevice, serialNumber: e.target.value })}
                  readOnly={editing}
                />
              </div>

              <div className="form-group">
                <label>Marca</label>
                <input
                  type="text"
                  className="form-control"
                  value={newDevice.brand}
                  onChange={(e) => setNewDevice({ ...newDevice, brand: e.target.value })}
                  placeholder="Ej: Samsung"
                />
              </div>

              <div className="form-group">
                <label>Consumo eléctrico (W)</label>
                <input
                  type="text"
                  className="form-control"
                  value={newDevice.powerConsumption}
                  onChange={(e) => setNewDevice({ ...newDevice, powerConsumption: e.target.value })}
                  placeholder="Ej: 500W"
                />
              </div>

              <div className="d-flex justify-content-between mt-3">
                <button type="submit" className="btn btn-primary">
                  {editing ? 'Guardar Edición' : 'Agregar Dispositivo'}
                </button>
                {editing && (
                  <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>
                    Cancelar
                  </button>
                )}
              </div>
            </form>

            {errorMessage && <p className="text-danger">{errorMessage}</p>}

            <h3>Lista de Dispositivos:</h3>
            <div style={{ maxHeight: '300px', overflowY: 'scroll' }}>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Número de Serie</th>
                    <th>Marca</th>
                    <th>Consumo Eléctrico (W)</th>
                    <th>Tipo de Dispositivo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {devices.map((device) => (
                    <tr key={device.numeroSerie}>
                      <td>{device.numeroSerie}</td>
                      <td>{device.marca}</td>
                      <td>{device.consumoElectrico}</td>
                      <td>{device.tipoDispositivo?.nombre}</td>
                      <td>
                        <button 
                          className="btn btn-warning"
                          onClick={() => handleEditDevice(device)}
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeSection === 'Gestión de Tipos de Dispositivos' && (
          <section className="section">
            <h2>Gestión de Tipos de Dispositivos</h2>
            <p>Aquí puedes agregar y gestionar tipos de dispositivos.</p>

            <form className="device-type-form" onSubmit={editing ? handleUpdateDeviceType : handleAddDeviceType}>
              <div className="form-group">
                <label>Nombre del tipo de dispositivo</label>
                <input
                  type="text"
                  className="form-control"
                  value={newDeviceType.name}
                  onChange={(e) => setNewDeviceType({ ...newDeviceType, name: e.target.value })}
                  placeholder="Ej: Electrodoméstico"
                />
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <input
                  type="text"
                  className="form-control"
                  value={newDeviceType.description}
                  onChange={(e) => setNewDeviceType({ ...newDeviceType, description: e.target.value })}
                  placeholder="Ej: Dispositivo que se usa en el hogar para tareas cotidianas."
                />
              </div>

              <div className="form-group">
                <label>Tiempo de garantía (años)</label>
                <input
                  type="text"
                  className="form-control"
                  value={newDeviceType.warrantyPeriod}
                  onChange={(e) => setNewDeviceType({ ...newDeviceType, warrantyPeriod: e.target.value })}
                  placeholder="Ej: 2 años"
                />
              </div>

              <div className="d-flex justify-content-between mt-3">
                <button type="submit" className="btn btn-primary">
                  {editing ? 'Guardar Edición' : 'Agregar Tipo de Dispositivo'}
                </button>
                {editing && (
                  <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>
                    Cancelar
                  </button>
                )}
              </div>
            </form>

            {typeErrorMessage && <p className="text-danger">{typeErrorMessage}</p>}

            <h3>Tipos de dispositivos agregados:</h3>
            <div style={{ maxHeight: '300px', overflowY: 'scroll' }}>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Tiempo de Garantía (años)</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {deviceTypes.map((deviceType) => (
                    <tr key={deviceType.id}>
                      <td>{deviceType.id}</td>
                      <td>{deviceType.nombre}</td>
                      <td>{deviceType.descripcion}</td>
                      <td>{deviceType.tiempoGarantia}</td>
                      <td>
                        <button 
                          className="btn btn-warning"
                          onClick={() => handleEditDeviceType(deviceType)}
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeSection === 'Gestión de Distribuidores' && (
          <section className="section">
            <h2>Gestión de Distribuidores</h2>
            <p>Administra los distribuidores para ser utilizados en la tienda en línea (cédula jurídica, nombre, región).</p>

            <form className="distributor-form" onSubmit={editing ? handleUpdateDistributor : handleAddDistributor}>
              <div className="form-group">
                <label>Cédula jurídica</label>
                <input
                  type="text"
                  className="form-control"
                  value={newDistributor.juridicalId}
                  onChange={(e) => setNewDistributor({ ...newDistributor, juridicalId: e.target.value })}
                  placeholder="Ej: 123456789"
                />
              </div>

              <div className="form-group">
                <label>Nombre del distribuidor</label>
                <input
                  type="text"
                  className="form-control"
                  value={newDistributor.name}
                  onChange={(e) => setNewDistributor({ ...newDistributor, name: e.target.value })}
                  placeholder="Ej: Distribuidor XYZ"
                />
              </div>

              <div className="form-group">
                <label>Región</label>
                <input
                  type="text"
                  className="form-control"
                  value={newDistributor.region}
                  onChange={(e) => setNewDistributor({ ...newDistributor, region: e.target.value })}
                  placeholder="Ej: San José"
                />
              </div>

              <div className="d-flex justify-content-between mt-3">
                <button type="submit" className="btn btn-primary">
                  {editing ? 'Guardar Edición' : 'Agregar Distribuidor'}
                </button>
                {editing && (
                  <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>
                    Cancelar
                  </button>
                )}
              </div>
            </form>

            {distributorErrorMessage && <p className="text-danger">{distributorErrorMessage}</p>}

            <h3>Distribuidores agregados:</h3>
            <div style={{ maxHeight: '300px', overflowY: 'scroll' }}>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Cédula Jurídica</th>
                    <th>Nombre</th>
                    <th>Región</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {distributors.map((distributor) => (
                    <tr key={distributor.cedulaJuridica}>
                      <td>{distributor.cedulaJuridica}</td>
                      <td>{distributor.nombre}</td>
                      <td>{distributor.region}</td>
                      <td>
                        <button 
                          className="btn btn-warning"
                          onClick={() => handleEditDistributor(distributor)}
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
        {activeSection === 'Indicadores del Sistema' && (
          <section className="section">
            <h2>Indicadores del Sistema</h2>
            <ul className="list-group">
              <li className="list-group-item">Cantidad promedio de dispositivos por usuario: {averageDevicesPerUser}</li>
              <li className="list-group-item">Cantidad total de dispositivos gestionados por el sistema: {devices.length}</li>
            </ul>

            <div className="chart-grid">
              <div className="chart-container">
                <h3>Distribución de Dispositivos por Región</h3>
                <div style={{ width: '500px', height: '500px' }}> {/* Aumentar el tamaño */}
                <Pie
                  data={{
                    labels: regionChartData.labels,
                    datasets: [{
                      data: regionChartData.data,
                      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
                      hoverOffset: 10, // Espaciado adicional en el hover
                    }],
                  }}
                  options={{
                    plugins: {
                      tooltip: {
                        bodyFont: {
                          size: 16, // Tamaño de fuente del tooltip
                          family: 'Arial, sans-serif',
                          weight: 'bold',
                          color: 'black',
                        },
                        titleFont: {
                          size: 18,
                          family: 'Arial, sans-serif',
                          weight: 'bold',
                          color: 'black',
                        },
                        callbacks: {
                          label: (tooltipItem) => {
                            const label = tooltipItem.label || '';
                            const value = tooltipItem.raw || 0;
                            return `${label}: ${value}`;
                          },
                        },
                      },
                      legend: {
                        labels: {
                          font: {
                            size: 16,
                            family: 'Arial, sans-serif',
                            weight: 'bold',
                            color: 'black',
                          },
                          color: 'rgba(0, 0, 0, 0.7)',
                        },
                      },
                    },
                    animations: {
                      // Configuración para animar el escalado de los segmentos al pasar el mouse
                      tension: {
                        duration: 1,
                        easing: 'easeInOutQuad',
                        from: 1,
                        to: 1.5, // Escala un poco más
                        loop: true,
                        
                      },
                    },
                  }}
                />
              </div>
              </div>

              <div className="chart-container">
                <h3>Distribución de Dispositivos Asociados a Usuarios</h3>
                <div style={{ width: '500px', height: '500px' }}> {/* Aumentar el tamaño */}
                  <Pie data={dataForUserDevices} />
                </div>
              </div>
            </div>
          </section>
        )}



        {activeSection === 'Gestión de la Tienda en Línea' && (
          <section className="section">
            <h2>Gestión de la Tienda en Línea y Distribuidores</h2>
            <p>Administra los productos disponibles en la tienda en línea y asócialos con los distribuidores.</p>
            <button className="btn btn-success" onClick={goToManageStore}>
              Ir a Gestión de la Tienda
            </button>
          </section>
        )}
      </div>
    </div>
  );
}
