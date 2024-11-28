import React, { useState } from "react";
import axios from "axios"; // Importa axios para hacer solicitudes HTTP
import "./RegistrarAfiliado.css";

const AgregarAdministrador = () => {
  // Estado para almacenar los datos del administrador con valores iniciales
  const [datosAdministrador, setDatosAdministrador] = useState({
    nombre: '',
    apellido1: '',
    apellido2: '',
    usuario: '',
    cedula: '',
    provincia: '',
    canton: '',
    distrito: ''
  });

  const [message, setMessage] = useState(""); // Estado para mensajes de error o éxito
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para controlar el estado de envío

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Establece el estado a "enviando"
    console.log("Enviando formulario para crear cuenta de administrador");

    try {
      // Llamada al API para registrar al administrador
      const response = await axios.post('https://sqlapi-hshshrdbaba8gbgd.canadacentral-01.azurewebsites.net/api/comercios/registrarAdmin', {
        correo: datosAdministrador.usuario,
        nombre: datosAdministrador.nombre,
        apellido1: datosAdministrador.apellido1,
        apellido2: datosAdministrador.apellido2,
        usuario: datosAdministrador.usuario,
        cedula: datosAdministrador.cedula,
        provincia: datosAdministrador.provincia,
        canton: datosAdministrador.canton,
        distrito: datosAdministrador.distrito,
      });

      if (response.data.message === "Administrador afiliado insertado con éxito.") {
        setMessage("Administrador creado con éxito.");
      } else {
        setMessage("Hubo un error al crear el administrador.");
      }
    } catch (error) {
      console.error("Error al crear el administrador: ", error);
      setMessage("Hubo un error al crear el administrador.");
    }
    setIsSubmitting(false); // Restablece el estado de envío
  };

  return (
    <div className="form-container">
      <h2>Administrador Comercio</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre">Nombre</label>
          <input
            type="text"
            id="nombre"
            value={datosAdministrador.nombre}
            onChange={(e) => setDatosAdministrador({ ...datosAdministrador, nombre: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="apellido1">Primer Apellido</label>
          <input
            type="text"
            id="apellido1"
            value={datosAdministrador.apellido1}
            onChange={(e) => setDatosAdministrador({ ...datosAdministrador, apellido1: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="apellido2">Segundo Apellido</label>
          <input
            type="text"
            id="apellido2"
            value={datosAdministrador.apellido2}
            onChange={(e) => setDatosAdministrador({ ...datosAdministrador, apellido2: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="usuario">Correo Electrónico (Usuario)</label>
          <input
            type="email"
            id="usuario"
            value={datosAdministrador.usuario}
            onChange={(e) => setDatosAdministrador({ ...datosAdministrador, usuario: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="cedula">Cédula</label>
          <input
            type="text"
            id="cedula"
            value={datosAdministrador.cedula}
            onChange={(e) => setDatosAdministrador({ ...datosAdministrador, cedula: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="provincia">Provincia</label>
          <input
            type="text"
            id="provincia"
            value={datosAdministrador.provincia}
            onChange={(e) => setDatosAdministrador({ ...datosAdministrador, provincia: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="canton">Cantón</label>
          <input
            type="text"
            id="canton"
            value={datosAdministrador.canton}
            onChange={(e) => setDatosAdministrador({ ...datosAdministrador, canton: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="distrito">Distrito</label>
          <input
            type="text"
            id="distrito"
            value={datosAdministrador.distrito}
            onChange={(e) => setDatosAdministrador({ ...datosAdministrador, distrito: e.target.value })}
            required
          />
        </div>
        <button type="submit" disabled={isSubmitting}>Crear Administrador</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AgregarAdministrador;
