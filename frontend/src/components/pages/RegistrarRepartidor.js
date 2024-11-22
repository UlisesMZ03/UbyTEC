import React, { useState, useEffect } from "react";
import axios from "axios";
import "./RegistrarRepartidor.css"; // Archivo CSS para los estilos

const RegistrarRepartidor = () => {
  const [activeSection, setActiveSection] = useState("registrarRepartidor"); // Sección activa
  const [datosRepartidor, setDatosRepartidor] = useState({}); // Datos del repartidor
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para el envío del formulario
  const [message, setMessage] = useState(""); // Mensaje de éxito o error
  const [verificationStatus, setVerificationStatus] = useState(""); // Estado de la verificación
  const [email, setEmail] = useState(""); // Email del repartidor

  // Maneja la validación y el envío de datos
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Establecer estado de envío

    try {
      // Enviar datos a la API para registrar el repartidor
      const response = await axios.post('http://localhost:5133/api/repartidor/registrarRepartidor', {
        correo: datosRepartidor.correo,
        nombre: datosRepartidor.nombre,
        apellido1: datosRepartidor.apellido1,
        apellido2: datosRepartidor.apellido2,
        usuario: datosRepartidor.usuario,
        provincia: datosRepartidor.provincia,
        canton: datosRepartidor.canton,
        distrito: datosRepartidor.distrito,
        estado: datosRepartidor.estado,
      });

      // Validar respuesta del servidor
      if (response.data.message === "Repartidor registrado con éxito.") {
        setMessage("Repartidor registrado con éxito.");
        setVerificationStatus("Verificado"); // Aquí se puede cambiar dependiendo del sistema de verificación
        setActiveSection("finalizar"); // Cambiar a la sección finalizar
      } else {
        setMessage("Hubo un error al registrar el repartidor.");
      }
    } catch (error) {
      console.error("Error al registrar el repartidor:", error);
      setMessage("Hubo un error al registrar el repartidor.");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="app-container">
      <nav className="nav-menu-afiliado">
        <ul>
          <li
            onClick={() => setActiveSection("registrarRepartidor")}
            className={activeSection === "registrarRepartidor" ? "active" : ""}
          >
            Registrar Repartidor
          </li>
          <li
            onClick={() => setActiveSection("finalizar")}
            className={activeSection === "finalizar" ? "active" : ""}
          >
            Finalizar
          </li>
        </ul>
      </nav>

      <div className="content">
        {activeSection === "registrarRepartidor" && (
          <form onSubmit={handleSubmit}>
            <h3>Registrar Repartidor</h3>
            <div className="form-group">
              <label htmlFor="correo">Correo:</label>
              <input
                type="email"
                id="correo"
                value={datosRepartidor.correo || ""}
                onChange={(e) => setDatosRepartidor({ ...datosRepartidor, correo: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="nombre">Nombre:</label>
              <input
                type="text"
                id="nombre"
                value={datosRepartidor.nombre || ""}
                onChange={(e) => setDatosRepartidor({ ...datosRepartidor, nombre: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="apellido1">Apellido 1:</label>
              <input
                type="text"
                id="apellido1"
                value={datosRepartidor.apellido1 || ""}
                onChange={(e) => setDatosRepartidor({ ...datosRepartidor, apellido1: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="apellido2">Apellido 2:</label>
              <input
                type="text"
                id="apellido2"
                value={datosRepartidor.apellido2 || ""}
                onChange={(e) => setDatosRepartidor({ ...datosRepartidor, apellido2: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="usuario">Usuario:</label>
              <input
                type="text"
                id="usuario"
                value={datosRepartidor.usuario || ""}
                onChange={(e) => setDatosRepartidor({ ...datosRepartidor, usuario: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="provincia">Provincia:</label>
              <input
                type="text"
                id="provincia"
                value={datosRepartidor.provincia || ""}
                onChange={(e) => setDatosRepartidor({ ...datosRepartidor, provincia: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="canton">Cantón:</label>
              <input
                type="text"
                id="canton"
                value={datosRepartidor.canton || ""}
                onChange={(e) => setDatosRepartidor({ ...datosRepartidor, canton: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="distrito">Distrito:</label>
              <input
                type="text"
                id="distrito"
                value={datosRepartidor.distrito || ""}
                onChange={(e) => setDatosRepartidor({ ...datosRepartidor, distrito: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="estado">Estado:</label>
              <input
                type="text"
                id="estado"
                value={datosRepartidor.estado || ""}
                onChange={(e) => setDatosRepartidor({ ...datosRepartidor, estado: e.target.value })}
                required
              />
            </div>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Registrando..." : "Registrar Repartidor"}
            </button>

            {message && <p>{message}</p>}
          </form>
        )}

        {activeSection === "finalizar" && (
          <div className="finalizar-container">
            <h3>Finalizar</h3>
            <p>Correo del Repartidor: {datosRepartidor.correo}</p>
            <p>Estado de Verificación: {verificationStatus || "No verificado"}</p>
            {/* Aquí puedes agregar más detalles a mostrar al finalizar */}
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrarRepartidor;
