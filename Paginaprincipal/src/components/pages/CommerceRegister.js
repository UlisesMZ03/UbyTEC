import React, { useState } from "react";
import "./CommerceRegister.css";

function CommerceRegister() {
  const [formData, setFormData] = useState({
    cedulaJuridica: "",
    nombreComercio: "",
    tipoComercio: "",
    provincia: "",
    canton: "",
    distrito: "",
    telefonos: [""], // Inicia con un campo de teléfono
    correoElectronico: "",
    sinpeMovil: "",
    administrador: "",
  });

  // Manejo de cambios en los campos de entrada
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  // Manejo de cambios en los números de teléfono
  const handlePhoneChange = (index, value) => {
    const updatedPhones = [...formData.telefonos];
    updatedPhones[index] = value;
    setFormData({ ...formData, telefonos: updatedPhones });
  };

  // Añadir un nuevo campo de teléfono
  const addPhoneField = () => {
    setFormData({ ...formData, telefonos: [...formData.telefonos, ""] });
  };

  // Eliminar un campo de teléfono específico
  const removePhoneField = (index) => {
    const updatedPhones = formData.telefonos.filter((_, i) => i !== index);
    setFormData({ ...formData, telefonos: updatedPhones });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Lógica para enviar los datos de registro al backend o API
    console.log("Datos de registro del comercio:", formData);
  };

  return (
    <div className="commerce-register-container">
      <h2>Registro Comercio </h2>
      <form onSubmit={handleSubmit} className="commerce-register-form">
        <div className="input-container">
          <label>Número de Cédula Jurídica</label>
          <input
            type="text"
            name="cedulaJuridica"
            value={formData.cedulaJuridica}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="input-container">
          <label>Nombre del Comercio</label>
          <input
            type="text"
            name="nombreComercio"
            value={formData.nombreComercio}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="input-container">
          <label>Tipo de Comercio</label>
          <input
            type="text"
            name="tipoComercio"
            value={formData.tipoComercio}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Dirección */}
        <div className="input-container">
          <label>Dirección</label>
          <div className="address-inputs">
            <input
              type="text"
              name="provincia"
              placeholder="Provincia"
              value={formData.provincia}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="canton"
              placeholder="Cantón"
              value={formData.canton}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="distrito"
              placeholder="Distrito"
              value={formData.distrito}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        {/* Teléfonos */}
        <div className="input-container">
          <label>Teléfonos</label>
          {formData.telefonos.map((telefono, index) => (
            <div key={index} className="phone-input">
              <input
                type="text"
                value={telefono}
                onChange={(e) => handlePhoneChange(index, e.target.value)}
                placeholder={`Teléfono ${index + 1}`}
                required
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removePhoneField(index)}
                  className="remove-phone-btn"
                >
                  Eliminar
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addPhoneField} className="add-phone-btn">
            Añadir Teléfono
          </button>
        </div>

        <div className="input-container">
          <label>Correo Electrónico</label>
          <input
            type="email"
            name="correoElectronico"
            value={formData.correoElectronico}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="input-container">
          <label>Número de SINPE Móvil</label>
          <input
            type="text"
            name="sinpeMovil"
            value={formData.sinpeMovil}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="input-container">
          <label>Administrador del Comercio</label>
          <input
            type="text"
            name="administrador"
            value={formData.administrador}
            onChange={handleInputChange}
            required
          />
        </div>

        <button type="submit" className="register-button">Registrarse</button>
      </form>
    </div>
  );
}

export default CommerceRegister;
