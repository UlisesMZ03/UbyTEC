import React, { useState } from 'react';
import './GestionAdminEmpl.css';

const GestionTiposDeComercio = () => {
  const [tiposDeComercio, setTiposDeComercio] = useState([]);
  const [formData, setFormData] = useState({
    nombre: ''
  });
  const [editing, setEditing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  // Validaciones antes de agregar o actualizar tipo de comercio
  const validateForm = () => {
    let errors = {};

    if (!formData.nombre) {
      errors.nombre = 'El nombre del tipo de comercio es obligatorio.';
    }

    return errors;
  };

  // Agregar nuevo tipo de comercio
  const handleAddTipoDeComercio = () => {
    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) {
      return;
    }

    setTiposDeComercio([
      ...tiposDeComercio,
      { nombre: formData.nombre }
    ]);
    setFormData({
      nombre: ''
    });
  };

  // Editar tipo de comercio
  const handleEditTipoDeComercio = (index) => {
    setEditing(true);
    setCurrentIndex(index);
    setFormData(tiposDeComercio[index]);
  };

  // Actualizar tipo de comercio
  const handleUpdateTipoDeComercio = () => {
    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) {
      return;
    }

    const updatedTiposDeComercio = [...tiposDeComercio];
    updatedTiposDeComercio[currentIndex] = formData;
    setTiposDeComercio(updatedTiposDeComercio);
    setFormData({
      nombre: ''
    });
    setEditing(false);
    setCurrentIndex(null);
  };

  // Eliminar tipo de comercio
  const handleDeleteTipoDeComercio = (index) => {
    const updatedTiposDeComercio = tiposDeComercio.filter((_, i) => i !== index);
    setTiposDeComercio(updatedTiposDeComercio);
  };

  return (
    <div className="gestion-tipos-de-comercio">
      <h2>Gestión de Tipos de Comercio</h2>
      <div className="form-container">
        <div>
          <label>Nombre</label>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre del tipo de comercio"
            value={formData.nombre}
            onChange={handleInputChange}
            style={{ borderColor: errors.nombre ? 'red' : '' }}
          />
          {errors.nombre && <small className="error-message">{errors.nombre}</small>}
        </div>

        {editing ? (
          <button onClick={handleUpdateTipoDeComercio}>Actualizar Tipo de Comercio</button>
        ) : (
          <button onClick={handleAddTipoDeComercio}>Agregar Tipo de Comercio</button>
        )}
      </div>

      <div className="tipos-de-comercio-list">
        <h3>Lista de Tipos de Comercio</h3>
        <ul>
          {tiposDeComercio.map((tipo, index) => (
            <li key={index}>
              <span>{tipo.nombre}</span>
              <button onClick={() => handleEditTipoDeComercio(index)}>Editar</button>
              <button onClick={() => handleDeleteTipoDeComercio(index)}>Eliminar</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GestionTiposDeComercio;
