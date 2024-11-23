import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify"; // Importar react-toastify
import "react-toastify/dist/ReactToastify.css"; // Estilos para las notificaciones
import "./GestionAdminEmpl.css";

const GestionTiposComercio = () => {
  const [tiposComercio, setTiposComercio] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    nombre: "",
  });
  const [editing, setEditing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [errors, setErrors] = useState({});

  const handleCancelEdit = () => {
    setFormData({
      id: "",
      nombre: "",
    });
    setEditing(false);
    setCurrentIndex(null);
  };

  // Obtener los tipos de comercio desde la API
  const obtenerTiposComercio = async () => {
    try {
      const response = await fetch(
        "https://sqlapi-hshshrdbaba8gbgd.canadacentral-01.azurewebsites.net/api/tiposdecomercio/obtenerTiposDeComercio"
      );
      const data = await response.json();
      console.log("Datos recibidos de tipos de comercio:", data);
      setTiposComercio(data);
    } catch (error) {
      console.error("Error al obtener los tipos de comercio:", error);
    }
  };

  useEffect(() => {
    obtenerTiposComercio();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let errors = {};

    if (!formData.nombre) {
      errors.nombre = "El nombre no puede estar vacío.";
    }

    return errors;
  };

  const handleAddTipoComercio = async () => {
    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) {
      console.log("Errores de formulario:", formErrors);
      return;
    }

    const newTipoComercio = {
      nombre: formData.nombre, // Solo el nombre al agregar
    };

    console.log("Datos del nuevo tipo de comercio que se van a insertar:", newTipoComercio);

    try {
      const response = await fetch('https://sqlapi-hshshrdbaba8gbgd.canadacentral-01.azurewebsites.net/api/tiposdecomercio/insertar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTipoComercio)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Tipo de comercio insertado correctamente.', { position: 'top-right' });

        // Actualiza la lista de tipos de comercio
        setTiposComercio((prev) => [...prev, newTipoComercio]);

        // Limpiar el formulario
        setFormData({
          nombre: '',
        });
      } else {
        console.error("Error de la respuesta:", data.error);
        toast.error('Error al insertar el tipo de comercio.', { position: 'top-right' });
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      toast.error('Hubo un error al realizar la solicitud.', { position: 'top-right' });
    }
  };

  const handleEditTipoComercio = (index) => {
    setEditing(true);
    setCurrentIndex(index);
    setFormData(tiposComercio[index]);
  };

  const handleUpdateTipoComercio = async () => {
    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) {
      return;
    }

    const updatedTiposComercio = [...tiposComercio];
    updatedTiposComercio[currentIndex] = formData;

    // Enviar los datos actualizados al backend
    try {
      const response = await fetch(
        `https://sqlapi-hshshrdbaba8gbgd.canadacentral-01.azurewebsites.net/api/tiposdecomercio/editar/${tiposComercio[currentIndex].id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success('Tipo de comercio actualizado correctamente.', { position: 'top-right' });
        setTiposComercio(updatedTiposComercio);
        setFormData({
          nombre: "",
        });
        setEditing(false);
        setCurrentIndex(null);
      } else {
        console.error("Error de la respuesta:", data.error);
        toast.error('Error al actualizar el tipo de comercio.', { position: 'top-right' });
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      toast.error('Hubo un error al realizar la solicitud.', { position: 'top-right' });
    }
  };

  const handleDeleteTipoComercio = async (index) => {
    const tipoComercioToDelete = tiposComercio[index];

    try {
      const response = await fetch(
        `https://sqlapi-hshshrdbaba8gbgd.canadacentral-01.azurewebsites.net/api/tiposdecomercio/eliminar/${tipoComercioToDelete.id}`,
        {
          method: 'DELETE'
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success('Tipo de comercio eliminado correctamente.', { position: 'top-right' });

        const updatedTiposComercio = tiposComercio.filter((_, i) => i !== index);
        setTiposComercio(updatedTiposComercio);
      } else {
        console.error("Error de la respuesta:", data.error);
        toast.error('Error al eliminar el tipo de comercio.', { position: 'top-right' });
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      toast.error('Hubo un error al realizar la solicitud.', { position: 'top-right' });
    }
  };

  return (
    <div className="gestion-tipos-comercio">
      <h2>Gestión de Tipos de Comercio</h2>
      <div className="form-container">
        {editing && (
          <div>
            <label>ID</label>
            <input
              type="text"
              name="id"
              value={formData.id}
              readOnly
              style={{ borderColor: errors.id ? "red" : "" }}
            />
          </div>
        )}

        <div>
          <label>Nombre</label>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            style={{ borderColor: errors.nombre ? "red" : "" }}
          />
          {errors.nombre && (
            <small className="error-message">{errors.nombre}</small>
          )}
        </div>

        {editing ? (
          <button className="actualizar-tipo-comercio" onClick={handleUpdateTipoComercio}>Actualizar Tipo de Comercio</button>
        ) : (
          <button onClick={handleAddTipoComercio}>Agregar Tipo de Comercio</button>
        )}
        {editing && <button className="cancelar-edicion" onClick={handleCancelEdit}>Cancelar</button>}
      </div>

      <div className="tipos-comercio-list">
        <h3>Lista de Tipos de Comercio</h3>
        <table className="tipos-comercio-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tiposComercio.map((tipoComercio, index) => (
              <tr key={index}>
                <td>{tipoComercio.id}</td>
                <td>{tipoComercio.nombre}</td>
                <td>
                  <div className="btn-acciones">
                    <button onClick={() => handleEditTipoComercio(index)}>
                      Editar
                    </button>
                    <button onClick={() => handleDeleteTipoComercio(index)}>
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ToastContainer /> {/* Aquí se muestra el contenedor de las notificaciones */}
    </div>
  );
};

export default GestionTiposComercio;
