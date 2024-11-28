import React, { useState, useEffect } from "react";
import "./GestionAdminEmpl.css";

const GestionRepartidores = () => {
  const [repartidores, setRepartidores] = useState([]);
  const [formData, setFormData] = useState({
    correo: "",
    nombre: "",
    apellido1: "",
    apellido2: "",
    provincia: "",
    canton: "",
    distrito: "",
    usuario: "",
    password: "",
    estado: "Activo",
  });
  const [provincias, setProvincias] = useState([]);
  const [cantones, setCantones] = useState([]);
  const [distritos, setDistritos] = useState([]);
  const [direccionProvinciaId, setDireccionProvinciaId] = useState("");
  const [direccionCantonId, setDireccionCantonId] = useState("");
  const [errors, setErrors] = useState({});
  const [editing, setEditing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);

  // Obtener repartidores
  useEffect(() => {
    const fetchRepartidores = async () => {
      try {
        const response = await fetch("https://apisql-cwbndbaagqerg7dw.canadacentral-01.azurewebsites.net/api/repartidor/obtenerRepartidores");
        const data = await response.json();
        setRepartidores(data);
      } catch (error) {
        console.error("Error al cargar los repartidores:", error);
      }
    };
    fetchRepartidores();
  }, []);

  // Obtener provincias
  useEffect(() => {
    const fetchProvincias = async () => {
      try {
        const response = await fetch(
          "https://ubicaciones.paginasweb.cr/provincias.json"
        );
        const data = await response.json();
        setProvincias(
          Object.entries(data).map(([id, nombre]) => ({ id, nombre }))
        );
      } catch (error) {
        console.error("Error al cargar provincias:", error);
      }
    };
    fetchProvincias();
  }, []);

  // Obtener cantones
  useEffect(() => {
    if (!direccionProvinciaId) return;

    const fetchCantones = async () => {
      try {
        const response = await fetch(
          `https://ubicaciones.paginasweb.cr/provincia/${direccionProvinciaId}/cantones.json`
        );
        const data = await response.json();
        setCantones(
          Object.entries(data).map(([id, nombre]) => ({ id, nombre }))
        );
      } catch (error) {
        console.error("Error al cargar cantones:", error);
      }
    };
    fetchCantones();
  }, [direccionProvinciaId]);

  // Obtener distritos
  useEffect(() => {
    if (!direccionProvinciaId || !direccionCantonId) return;

    const fetchDistritos = async () => {
      try {
        const response = await fetch(
          `https://ubicaciones.paginasweb.cr/provincia/${direccionProvinciaId}/canton/${direccionCantonId}/distritos.json`
        );
        const data = await response.json();
        setDistritos(
          Object.entries(data).map(([id, nombre]) => ({ id, nombre }))
        );
      } catch (error) {
        console.error("Error al cargar distritos:", error);
      }
    };
    fetchDistritos();
  }, [direccionProvinciaId, direccionCantonId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "provincia") {
      setFormData((prevState) => ({
        ...prevState,
        provincia: value,
        canton: "",
        distrito: "",
      }));
      setDireccionProvinciaId(value);
      setCantones([]);
      setDistritos([]);
    } else if (name === "canton") {
      setFormData((prevState) => ({
        ...prevState,
        canton: value,
        distrito: "",
      }));
      setDireccionCantonId(value);
      setDistritos([]);
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const validateForm = () => {
    let errors = {};
    if (!formData.correo || !/\S+@\S+\.\S+/.test(formData.correo)) {
      errors.correo = "El correo es inválido.";
    }
    if (!formData.nombre) {
      errors.nombre = "El nombre no puede estar vacío.";
    }
    if (!formData.apellido1) {
      errors.apellido1 = "El primer apellido no puede estar vacío.";
    }
    if (!formData.provincia || !formData.canton || !formData.distrito) {
      errors.direccion =
        "Debe completar todos los campos de provincia, cantón y distrito.";
    }
    if (!formData.usuario) {
      errors.usuario = "El usuario no puede estar vacío.";
    }
    if (!formData.password || formData.password.length < 6) {
      errors.password = "La contraseña debe tener al menos 6 caracteres.";
    }
    return errors;
  };

  const handleAddRepartidor = async () => {
    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) return;

    try {
      const response = await fetch("https://apisql-cwbndbaagqerg7dw.canadacentral-01.azurewebsites.net/api/repartidor/registrarRepartidor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (response.ok) {
        setRepartidores([...repartidores, data]);
        setFormData({
          correo: "",
          nombre: "",
          apellido1: "",
          apellido2: "",
          provincia: "",
          canton: "",
          distrito: "",
          usuario: "",
          password: "",
          estado: "Activo",
        });
      } else {
        console.error("Error al crear el repartidor:", data.error);
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

  const handleEditRepartidor = async (index) => {
    setEditing(true);
    setCurrentIndex(index);
    setFormData(repartidores[index]);
  };

  const handleUpdateRepartidor = async () => {
    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) return;

    try {
      const response = await fetch(
        `https://apisql-cwbndbaagqerg7dw.canadacentral-01.azurewebsites.net/api/repartidor/editarRepartidor/${formData.correo}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();

      if (response.ok) {
        const updatedRepartidores = [...repartidores];
        updatedRepartidores[currentIndex] = formData;
        setRepartidores(updatedRepartidores);
        setEditing(false);
        setFormData({
          correo: "",
          nombre: "",
          apellido1: "",
          apellido2: "",
          provincia: "",
          canton: "",
          distrito: "",
          usuario: "",
          password: "",
          estado: "Activo",
        });
      } else {
        console.error("Error al actualizar el repartidor:", data.error);
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

  const handleDeleteRepartidor = async (correo) => {
    try {
      const response = await fetch(
        `https://apisql-cwbndbaagqerg7dw.canadacentral-01.azurewebsites.net/api/repartidor/eliminarRepartidor/${correo}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setRepartidores(repartidores.filter((r) => r.correo !== correo));
      } else {
        console.error("Error al eliminar el repartidor.");
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

  return (
    <div className="gestion-repartidores">
      <h2>Gestión de Repartidores</h2>
      <div className="form-container">
      <input
          type="text"
          name="correo"
          placeholder="Correo"
          value={formData.correo}
          onChange={handleInputChange}
          style={{ borderColor: errors.correo ? "red" : "" }}
        />
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={handleInputChange}
          style={{ borderColor: errors.nombre ? "red" : "" }}
        />
        <input
          type="text"
          name="apellido1"
          placeholder="Primer Apellido"
          value={formData.apellido1}
          onChange={handleInputChange}
          style={{ borderColor: errors.apellido1 ? "red" : "" }}
        />
        <input
          type="text"
          name="apellido2"
          placeholder="Segundo Apellido"
          value={formData.apellido2}
          onChange={handleInputChange}
        />
        <select
          name="provincia"
          value={formData.provincia}
          onChange={handleInputChange}
        >
          <option value="">Seleccione Provincia</option>
          {provincias.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre}
            </option>
          ))}
        </select>
        <select
          name="canton"
          value={formData.canton}
          onChange={handleInputChange}
          disabled={!direccionProvinciaId}
        >
          <option value="">Seleccione Cantón</option>
          {cantones.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
        <select
          name="distrito"
          value={formData.distrito}
          onChange={handleInputChange}
          disabled={!direccionCantonId}
        >
          <option value="">Seleccione Distrito</option>
          {distritos.map((d) => (
            <option key={d.id} value={d.id}>
              {d.nombre}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="usuario"
          placeholder="Usuario"
          value={formData.usuario}
          onChange={handleInputChange}
          style={{ borderColor: errors.usuario ? "red" : "" }}
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleInputChange}
          style={{ borderColor: errors.password ? "red" : "" }}
        />
        <select
          name="estado"
          value={formData.estado}
          onChange={handleInputChange}
        >
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
        </select>

        {editing ? (
          <button onClick={handleUpdateRepartidor}>Actualizar Repartidor</button>
        ) : (
          <button onClick={handleAddRepartidor}>Agregar Repartidor</button>
        )}
      </div>

      <div className="empleados-list">
  <h3>Lista de Repartidores</h3>
  <table className="empleados-table">
    <thead>
      <tr>
        <th>Correo</th>
        <th>Nombre</th>
        <th>Apellido 1</th>
        <th>Apellido 2</th>
        <th>Provincia</th>
        <th>Cantón</th>
        <th>Distrito</th>
        <th>Usuario</th>
        <th>Estado</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      {repartidores.map((r, index) => (
        <tr key={index}>
          <td>{r.correo}</td>
          <td>{r.nombre}</td>
          <td>{r.apellido1}</td>
          <td>{r.apellido2}</td>
          <td>{r.provincia}</td>
          <td>{r.canton}</td>
          <td>{r.distrito}</td>
          <td>{r.usuario}</td>
          <td>{r.estado}</td>
          <td>
            <div className="btn-acciones">
              <button onClick={() => handleEditRepartidor(index)}>Editar</button>
              <button onClick={() => handleDeleteRepartidor(r.correo)}>Eliminar</button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

    </div>
  );
};

export default GestionRepartidores;
