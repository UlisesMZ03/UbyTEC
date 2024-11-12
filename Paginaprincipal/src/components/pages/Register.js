import React, { useState } from "react";
import "./Register.css";

function Register() {
  const [role, setRole] = useState("cliente"); // Estado para el rol seleccionado
  const [formData, setFormData] = useState({
    cedula: "",
    nombre: "",
    apellidos: "",
    direccion: "",
    provincia: "",
    canton: "",
    distrito: "",
    fechaNacimiento: "",
    telefonos: [""], // Inicia con un solo campo para el primer teléfono
    usuario: "",
    password: "",
  });

  const handleRoleChange = (event) => {
    setRole(event.target.value);
    setFormData({
      cedula: "",
      nombre: "",
      apellidos: "",
      direccion: "",
      provincia: "",
      canton: "",
      distrito: "",
      fechaNacimiento: "",
      telefonos: [""],
      usuario: "",
      password: "",
    });
  };

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
    console.log("Datos de registro:", formData);
    // Lógica de envío de datos al backend o API
  };

  return (
    <div className="register-container">
      <h2>Registro de Usuario</h2>

      {/* Selección de rol */}
      <div className="role-selection">
        <label>Seleccione el Rol:</label>
        <select value={role} onChange={handleRoleChange}>
          <option value="cliente">Cliente</option>
          <option value="administrador">Administrador</option>
        </select>
      </div>

      <form onSubmit={handleSubmit} className="register-form">
        {/* Campos comunes */}
        <div className="input-container">
          <label>Número Cédula</label>
          <input
            type="text"
            name="cedula"
            value={formData.cedula}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="input-container">
          <label>Nombre Completo</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            required
          />
        </div>

        {role === "cliente" && (
          <div className="input-container">
            <label>Apellidos</label>
            <input
              type="text"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleInputChange}
              required
            />
          </div>
        )}

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

        {role === "cliente" && (
          <div className="input-container">
            <label>Fecha de Nacimiento</label>
            <input
              type="date"
              name="fechaNacimiento"
              value={formData.fechaNacimiento}
              onChange={handleInputChange}
              required
            />
          </div>
        )}

        {/* Teléfonos para Administrador */}
        {role === "administrador" && (
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
        )}

        {/* Usuario y contraseña */}
        <div className="input-container">
          <label>Usuario</label>
          <input
            type="text"
            name="usuario"
            value={formData.usuario}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="input-container">
          <label>Contraseña</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>

        <button type="submit" className="register-button">Registrarse</button>
      </form>
    </div>
  );
}

export default Register;

