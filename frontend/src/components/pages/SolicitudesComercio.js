import React, { useState, useEffect } from 'react';
import './SolicitudesComercio.css';

const SolicitudesComercio = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [filteredSolicitudes, setFilteredSolicitudes] = useState([]); // Estado para las solicitudes filtradas
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [comentarioRechazo, setComentarioRechazo] = useState('');
  const [cargando, setCargando] = useState(false);

  // Filtros
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroBusqueda, setFiltroBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState(''); // Filtro por estado

  // Función para obtener las solicitudes desde el servidor
  const obtenerSolicitudes = async () => {
    setCargando(true);
    try {
      const response = await fetch('https://sqlapi-hshshrdbaba8gbgd.canadacentral-01.azurewebsites.net/api/comercios/obtenerSolicitudesComercio');
      const data = await response.json();
      console.log("Datos recibidos de solicitudes: " + JSON.stringify(data, null, 2));
      setSolicitudes(data);
      setFilteredSolicitudes(data); // Inicializamos las solicitudes filtradas con todas las solicitudes
    } catch (error) {
      console.error('Error al obtener las solicitudes:', error);
    } finally {
      setCargando(false);
    }
  };

  // Función para manejar el clic en una solicitud y abrir/cerrar el panel de detalles
  const manejarSeleccionSolicitud = (solicitud) => {
    if (selectedSolicitud && selectedSolicitud.id === solicitud.id) {
      setSelectedSolicitud(null); // Cerrar detalles
    } else {
      setSelectedSolicitud(solicitud); // Abrir detalles
    }
  };

  // Función para manejar el rechazo de una solicitud
  const manejarRechazo = async () => {
    if (!comentarioRechazo) {
      alert("Por favor, ingresa un comentario para el rechazo.");
      return;
    }
    try {
      console.log("Solicitud rechazada con comentario:", comentarioRechazo);
      setSelectedSolicitud(null); // Cerrar el detalle
    } catch (error) {
      console.error('Error al rechazar la solicitud:', error);
    }
  };

  // Función para manejar la aceptación de una solicitud
  const manejarAceptacion = async () => {
    try {
      console.log("Solicitud aceptada");
      setSelectedSolicitud(null); // Cerrar el detalle
    } catch (error) {
      console.error('Error al aceptar la solicitud:', error);
    }
  };

  // Función para aplicar los filtros a las solicitudes
  const aplicarFiltros = () => {
    let solicitudesFiltradas = solicitudes;

    if (filtroNombre) {
      solicitudesFiltradas = solicitudesFiltradas.filter(solicitud =>
        solicitud.nombre.toLowerCase().includes(filtroNombre.toLowerCase())
      );
    }

    if (filtroFecha) {
      solicitudesFiltradas = solicitudesFiltradas.filter(solicitud =>
        new Date(solicitud.fechaSolicitud).toLocaleDateString() === new Date(filtroFecha).toLocaleDateString()
      );
    }

    if (filtroBusqueda) {
      solicitudesFiltradas = solicitudesFiltradas.filter(solicitud =>
        solicitud.nombre.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
        solicitud.correo.toLowerCase().includes(filtroBusqueda.toLowerCase())
      );
    }

    if (filtroEstado) {
      solicitudesFiltradas = solicitudesFiltradas.filter(solicitud =>
        solicitud.estado === parseInt(filtroEstado) // Filtramos usando el número correspondiente
      );
    }

    setFilteredSolicitudes(solicitudesFiltradas);
  };

  // UseEffect para obtener las solicitudes cuando el componente se monta
  useEffect(() => {
    obtenerSolicitudes();
  }, []);

  useEffect(() => {
    aplicarFiltros(); // Reaplicar los filtros cada vez que cambian
  }, [filtroNombre, filtroFecha, filtroBusqueda, filtroEstado, solicitudes]);

  return (
    <div className="solicitudes-container">
      <h2>Solicitudes para Registrar Comercio</h2>

      {/* Filtros */}
      <div className="filtros">
        <input
          type="text"
          placeholder="Buscar por nombre o correo"
          value={filtroBusqueda}
          onChange={(e) => setFiltroBusqueda(e.target.value)}
        />
        <input
          type="date"
          value={filtroFecha}
          onChange={(e) => setFiltroFecha(e.target.value)}
        />
        {/* Dropdown para seleccionar estado */}
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
          <option value="">Filtrar por estado</option>
          <option value="0">Pendiente</option>
          <option value="1">Aceptado</option>
          <option value="2">Rechazado</option>
        </select>
      </div>

      {cargando ? (
        <p>Cargando...</p>
      ) : (
        <div className="solicitudes-list">
          {filteredSolicitudes.map((solicitud) => (
            <div key={solicitud.id} className="solicitud-item">
              <div
                className="solicitud-summary"
                onClick={() => manejarSeleccionSolicitud(solicitud)}
              >
                <div className="solicitud-imagen-container">
                  {solicitud.imagen && (
                    <img 
                      src={solicitud.imagen} 
                      alt="Imagen de la solicitud" 
                      className="solicitud-imagen" 
                    />
                  )}
                </div>
                <div className="solicitud-datos">
                  <p>{solicitud.nombre}</p>
                  <p>{solicitud.correo}</p>
                  <p>{new Date(solicitud.fechaSolicitud).toLocaleDateString()}</p>
                </div>
              </div>

              {selectedSolicitud && selectedSolicitud.id === solicitud.id && (
                <div className="solicitud-detalle">
                  <h3>Detalles de la Solicitud</h3>
                  <div className="detalles-grid">
                    <div className="label">Correo:</div>
                    <div className="value">{solicitud.correo}</div>
                    <div className="label">Nombre:</div>
                    <div className="value">{solicitud.nombre}</div>
                    <div className="label">Cédula Jurídica:</div>
                    <div className="value">{solicitud.cedulaJuridica}</div>
                    <div className="label">Numero SINPE:</div>
                    <div className="value">{solicitud.numeroSINPE}</div>
                    <div className="label">Correo Admin:</div>
                    <div className="value">{solicitud.correoAdmin}</div>
                    <div className="label">Tipo ID:</div>
                    <div className="value">{solicitud.tipoID}</div>
                    <div className="label">Provincia:</div>
                    <div className="value">{solicitud.provincia}</div>
                    <div className="label">Cantón:</div>
                    <div className="value">{solicitud.canton}</div>
                    <div className="label">Distrito:</div>
                    <div className="value">{solicitud.distrito}</div>
                    <div className="label">Estado:</div>
                    <div className="value">{solicitud.estado === 0 ? 'Pendiente' : solicitud.estado === 1 ? 'Aceptado' : 'Rechazado'}</div>
                    <div className="label">Fecha Solicitud:</div>
                    <div className="value">{new Date(solicitud.fechaSolicitud).toLocaleDateString()}</div>
                  </div>

                  <div className="comentario-rechazo">
                    <label htmlFor="comentario">Comentario (si se rechaza):</label>
                    <textarea
                      id="comentario"
                      value={comentarioRechazo}
                      onChange={(e) => setComentarioRechazo(e.target.value)}
                    />
                  </div>

                  <div className="solicitud-actions">
                    <button className="aceptar-btn" onClick={manejarAceptacion}>Aceptar</button>
                    <button className="rechazar-btn" onClick={manejarRechazo}>Rechazar</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SolicitudesComercio;
