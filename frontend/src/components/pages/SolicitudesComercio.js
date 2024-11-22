import React, { useState, useEffect } from 'react';
import './SolicitudesComercio.css';

const SolicitudesComercio = () => {
  const [solicitudes, setSolicitudes] = useState([]);

  // Función para obtener las solicitudes desde el servidor
  const obtenerSolicitudes = async () => {
    try {
      const response = await fetch('/api/solicitudesComercio'); // Ruta de tu API para obtener las solicitudes
      const data = await response.json();
      setSolicitudes(data);
    } catch (error) {
      console.error('Error al obtener las solicitudes:', error);
    }
  };

  // UseEffect para obtener las solicitudes cuando el componente se monta
  useEffect(() => {
    obtenerSolicitudes();
  }, []);

  return (
    <div className="solicitudes-container">
      <h2>Solicitudes para Registrar Comercio</h2>
      <table className="solicitudes-table">
        <thead>
          <tr>
            <th>Correo</th>
            <th>Nombre</th>
            <th>Cedula Juridica</th>
            <th>Numero SINPE</th>
            <th>Correo Admin</th>
            <th>Tipo ID</th>
            <th>Provincia</th>
            <th>Canton</th>
            <th>Distrito</th>
            <th>Imagen</th>
            <th>Estado</th>
            <th>Fecha Solicitud</th>
          </tr>
        </thead>
        <tbody>
          {solicitudes.map((solicitud) => (
            <tr key={solicitud.Id}>
              <td>{solicitud.Correo}</td>
              <td>{solicitud.Nombre}</td>
              <td>{solicitud.CedulaJuridica}</td>
              <td>{solicitud.NumeroSINPE}</td>
              <td>{solicitud.CorreoAdmin}</td>
              <td>{solicitud.TipoID}</td>
              <td>{solicitud.Provincia}</td>
              <td>{solicitud.Canton}</td>
              <td>{solicitud.Distrito}</td>
              <td><img src={solicitud.Imagen} alt="Imagen comercio" width="50" /></td>
              <td>{solicitud.Estado}</td>
              <td>{new Date(solicitud.FechaSolicitud).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SolicitudesComercio;
