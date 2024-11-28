import React, { useState, useEffect } from "react";
import "./SolicitudesComercio.css";

const SolicitudesComercio = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [filteredSolicitudes, setFilteredSolicitudes] = useState([]); // Estado para las solicitudes filtradas
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);

  const [cargando, setCargando] = useState(false);
  const [comentarioRechazo, setComentarioRechazo] = useState(""); // Estado para el comentario
  const [fechaRechazo, setFechaRechazo] = useState(null); // Estado para la fecha de rechazo

  // Filtros
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");
  const [filtroBusqueda, setFiltroBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState(""); // Filtro por estado

  // Función para obtener las solicitudes desde el servidor
  const obtenerSolicitudes = async () => {
    setCargando(true);
    try {
      const response = await fetch(
        "https://sqlapi-hshshrdbaba8gbgd.canadacentral-01.azurewebsites.net/api/comercios/obtenerSolicitudesComercio"
      );
      const data = await response.json();
      console.log(
        "Datos recibidos de solicitudes: " + JSON.stringify(data, null, 2)
      );
      setSolicitudes(data);
      setFilteredSolicitudes(data); // Inicializamos las solicitudes filtradas con todas las solicitudes
    } catch (error) {
      console.error("Error al obtener las solicitudes:", error);
    } finally {
      setCargando(false);
    }
  };
  // Función para obtener el comentario de rechazo de una solicitud
  const obtenerComentarioRechazo = async (solicitudId) => {
    try {
      const response = await fetch(
        `https://apisql-cwbndbaagqerg7dw.canadacentral-01.azurewebsites.net/api/comercios/obtenerComentarioRechazo/${solicitudId}`
      );

      if (!response.ok) {
        throw new Error("Error al obtener el comentario de rechazo");
      }

      const data = await response.json();
      console.log("Comentario recibido: " + data);
      return {
        comentario: data.comentario,
        fechaRechazo: data.fechaRechazo,
      };
    } catch (error) {
      console.error("Error al obtener el comentario:", error);
      alert("Error al obtener el comentario de rechazo");
    }
  };

  const manejarSeleccionSolicitud = async (solicitud) => {
    if (selectedSolicitud && selectedSolicitud.id === solicitud.id) {
      setSelectedSolicitud(null); // Cerrar detalles
    } else {
      setSelectedSolicitud(solicitud); // Abrir detalles

      // Si la solicitud está rechazada, obtener el comentario y la fecha
      if (solicitud.estado === 2) {
        const comentarioData = await obtenerComentarioRechazo(solicitud.id);
        setComentarioRechazo(comentarioData.comentario);
        setFechaRechazo(comentarioData.fechaRechazo); // Establecer la fecha de rechazo
      } else {
        setComentarioRechazo(""); // Limpiar el comentario si no está rechazada
        setFechaRechazo(null); // Limpiar la fecha si no está rechazada
      }
    }
  };

  const manejarRechazo = async () => {
    if (!comentarioRechazo) {
      alert("Por favor, ingresa un comentario para el rechazo.");
      return;
    }

    const solicitudAcep = selectedSolicitud;

    try {
      // Enviar el Id de la solicitud y el comentario a la API para rechazarla
      const response = await fetch(
        "https://apisql-cwbndbaagqerg7dw.canadacentral-01.azurewebsites.net/api/comercios/rechazarSolicitud",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            SolicitudId: solicitudAcep.id,
            Comentario: comentarioRechazo,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error al rechazar la solicitud");
      }

      console.log(result);

      // Limpiar y cerrar el detalle de la solicitud
      setSelectedSolicitud(null);
      alert("Solicitud rechazada correctamente.");
    } catch (error) {
      console.error("Error al rechazar la solicitud:", error);
      alert(error.message || "Error inesperado");
    }
  };

  // Función para manejar la aceptación de una solicitud
  // Función para manejar la aceptación de una solicitud
  const manejarAceptacion = async () => {
    if (!selectedSolicitud) {
      alert("No se ha seleccionado ninguna solicitud.");
      return;
    }

    const solicitudAcep = selectedSolicitud;

    try {
      // Enviar solo el Id de la solicitud a la API para insertarlo en la base de datos
      const response = await fetch(
        "https://apisql-cwbndbaagqerg7dw.canadacentral-01.azurewebsites.net/api/comercios/insertarDesdeSolicitud",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(solicitudAcep.id), // Enviar solo el Id de la solicitud
        }
      );

      const result = await response.json();

      if (!response.ok) {
        // Si la respuesta no es 200, mostrar el error que vino del backend
        throw new Error(result.error || "Error al procesar la solicitud");
      }

      console.log(result);

      // Aquí se actualiza el estado de la solicitud y se cierra el detalle
      setSelectedSolicitud(null); // Cerrar el detalle
      alert("Comercio insertado y solicitud aceptada correctamente.");
    } catch (error) {
      console.error("Error al aceptar la solicitud:", error);
      alert(error.message || "Error inesperado");
    }
  };

  // Función para aplicar los filtros a las solicitudes
  const aplicarFiltros = () => {
    let solicitudesFiltradas = solicitudes;

    if (filtroNombre) {
      solicitudesFiltradas = solicitudesFiltradas.filter((solicitud) =>
        solicitud.nombre.toLowerCase().includes(filtroNombre.toLowerCase())
      );
    }

    if (filtroFecha) {
      solicitudesFiltradas = solicitudesFiltradas.filter(
        (solicitud) =>
          new Date(solicitud.fechaSolicitud).toLocaleDateString() ===
          new Date(filtroFecha).toLocaleDateString()
      );
    }

    if (filtroBusqueda) {
      solicitudesFiltradas = solicitudesFiltradas.filter(
        (solicitud) =>
          solicitud.nombre
            .toLowerCase()
            .includes(filtroBusqueda.toLowerCase()) ||
          solicitud.correo.toLowerCase().includes(filtroBusqueda.toLowerCase())
      );
    }

    if (filtroEstado) {
      solicitudesFiltradas = solicitudesFiltradas.filter(
        (solicitud) => solicitud.estado === parseInt(filtroEstado) // Filtramos usando el número correspondiente
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
                  <p>
                    {new Date(solicitud.fechaSolicitud).toLocaleDateString()}
                  </p>
                  <p
                    className={
                      solicitud.estado === 0
                        ? "estado-pendiente"
                        : solicitud.estado === 1
                        ? "estado-aceptado"
                        : "estado-rechazado"
                    }
                  >
                    {solicitud.estado === 0
                      ? "Pendiente"
                      : solicitud.estado === 1
                      ? "Aceptado"
                      : "Rechazado"}
                  </p>
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
                    <div className="value">
                      {solicitud.estado === 2 && (
                        <div className="comentario-rechazo">
                          <label className="label">
                            Comentario de Rechazo:
                          </label>
                          <p className="comentario-text">{comentarioRechazo}</p>
                          <label className="label">Fecha de Rechazo:</label>
                          <p className="fecha-text">
                            {new Date(fechaRechazo).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                      
                    </div>

                    <div className="label">Fecha Solicitud:</div>
                    <div className="value">
                      {new Date(solicitud.fechaSolicitud).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Mostrar los botones solo si el estado es Pendiente */}
                  {solicitud.estado === 0 && (
                    <>
                      <div className="comentario-rechazo">
                        <label htmlFor="comentario">
                          Comentario (si se rechaza):
                        </label>
                        <textarea
                          id="comentario"
                          value={comentarioRechazo}
                          onChange={(e) => setComentarioRechazo(e.target.value)}
                        />
                      </div>

                      <div className="solicitud-actions">
                        <button
                          className="aceptar-btn"
                          onClick={manejarAceptacion}
                        >
                          Aceptar
                        </button>
                        <button
                          className="rechazar-btn"
                          onClick={manejarRechazo}
                        >
                          Rechazar
                        </button>
                      </div>
                    </>
                  )}
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
