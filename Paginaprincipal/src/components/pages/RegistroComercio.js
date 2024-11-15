import React, { useState } from 'react';
import "../../App.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./RegistroComercio.css";

export default function RegistroComercio() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    correo: '',
    nombre: '',
    cedulaJuridica: '',
    numeroSINPE: '',
    correoAdmin: '',
    tipoID: ''
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que todos los campos estén llenos
    if (Object.values(formData).some(field => !field)) {
      setErrorMessage("Por favor completa todos los campos.");
      return;
    }

    try {
      const response = await fetch("https://apisql-cwbndbaagqerg7dw.canadacentral-01.azurewebsites.net/api/comercios/registrar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSuccessMessage("Comercio registrado exitosamente.");
        setErrorMessage('');
        setFormData({
          correo: '',
          nombre: '',
          cedulaJuridica: '',
          numeroSINPE: '',
          correoAdmin: '',
          tipoID: ''
        });
        navigate("/"); // Redirige a la página principal o a una página de confirmación
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || "Error al registrar el comercio.");
        setSuccessMessage('');
      }
    } catch (error) {
      console.error("Error al registrar comercio:", error);
      setErrorMessage("Error de conexión. No se pudo registrar el comercio.");
      setSuccessMessage('');
    }
  };

  return (
    <div className="registro-comercio">
      <h1 className="register">REGISTRAR COMERCIO</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label htmlFor="correo">Correo</label>
          <input
            id="correo"
            type="email"
            placeholder="Introduce el correo del comercio"
            value={formData.correo}
            onChange={handleInputChange}
          />
        </div>
        <div className="input-container">
          <label htmlFor="nombre">Nombre del Comercio</label>
          <input
            id="nombre"
            type="text"
            placeholder="Introduce el nombre del comercio"
            value={formData.nombre}
            onChange={handleInputChange}
          />
        </div>
        <div className="input-container">
          <label htmlFor="cedulaJuridica">Cédula Jurídica</label>
          <input
            id="cedulaJuridica"
            type="text"
            placeholder="Introduce la cédula jurídica"
            value={formData.cedulaJuridica}
            onChange={handleInputChange}
          />
        </div>
        <div className="input-container">
          <label htmlFor="numeroSINPE">Número SINPE</label>
          <input
            id="numeroSINPE"
            type="text"
            placeholder="Introduce el número SINPE"
            value={formData.numeroSINPE}
            onChange={handleInputChange}
          />
        </div>
        <div className="input-container">
          <label htmlFor="correoAdmin">Correo del Administrador</label>
          <input
            id="correoAdmin"
            type="email"
            placeholder="Introduce el correo del administrador"
            value={formData.correoAdmin}
            onChange={handleInputChange}
          />
        </div>
        <div className="input-container">
          <label htmlFor="tipoID">Tipo de Comercio</label>
          <select id="tipoID" value={formData.tipoID} onChange={handleInputChange}>
            <option value="" disabled>Seleccione un tipo</option>
            <option value="1">Tipo 1</option>
            <option value="2">Tipo 2</option>
            {/* Agregar más opciones según sea necesario */}
          </select>
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <div className="button-container">
          <button type="submit">Registrar Comercio</button>
        </div>
      </form>
      <div className="login-link">
        <Link to="/login">Volver al inicio de sesión</Link>
      </div>
    </div>
  );
}
