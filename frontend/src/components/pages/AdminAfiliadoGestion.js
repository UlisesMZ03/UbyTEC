import React, { useState, useEffect, useRef } from "react";
import "./AdminAfiliadoGestion";

const GestionAF = () => {
  const [empleados, setEmpleados] = useState([]);
  const [formData, setFormData] = useState({
    correo: "", // Correo
    nombre: "", // Nombre
    apellido1: "", // Apellido 1
    apellido2: "", // Apellido 2
    usuario: "", // Usuario
    password: "", // Password
    provincia: "", // Provincia
    canton: "", // Cantón
    distrito: "", // Distrito
  });
  const [direccionProvinciaId, setDireccionProvinciaId] = useState("");
  const [direccionCantonId, setDireccionCantonId] = useState("");
  const [direccionDistritoId, setDireccionDistritoId] = useState("");
  const [editing, setEditing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [provincias, setProvincias] = useState([]);
  const [cantones, setCantones] = useState([]);
  const [distritos, setDistritos] = useState([]);
  const [filteredProvincias, setFilteredProvincias] = useState([]);
  const [filteredCantones, setFilteredCantones] = useState([]);
  const [filteredDistritos, setFilteredDistritos] = useState([]);
  const [isProvinceDropdownOpen, setIsProvinceDropdownOpen] = useState(false);
  const [isCantonDropdownOpen, setIsCantonDropdownOpen] = useState(false);
  const [isDistritoDropdownOpen, setIsDistritoDropdownOpen] = useState(false);
  const [errors, setErrors] = useState({});

  const provinceRef = useRef(null);
  const cantonRef = useRef(null);
  const distritoRef = useRef(null);

  const handleCancelEdit = () => {
    setFormData({
      correo: "",
      nombre: "",
      apellido1: "",
      apellido2: "",
      usuario: "",
      password: "",
      provincia: "",
      canton: "",
      distrito: "",
    });
    setDireccionProvinciaId("");
    setDireccionCantonId("");
    setDireccionDistritoId("");
    setEditing(false);
    setCurrentIndex(null);
  };

  const obtenerAdministrador = async (correoComercio) => {
    try {
      const response = await fetch(
        `https://apisql-cwbndbaagqerg7dw.canadacentral-01.azurewebsites.net/api/administrador/obtenerAdministradorPorComercio?correoComercio=${correoComercio}`
      );
  
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Datos del administrador recibido:", data);
  
      // Ajustar según el tipo de respuesta
      if (Array.isArray(data)) {
        setEmpleados(data);
      } else if (data) {
        setEmpleados([data]); // Convertir objeto único en array
      }
    } catch (error) {
      console.error("Error al obtener el administrador:", error);
    }
  };
  

useEffect(() => {
  const correoComercio = "mcdonalds@example.com"; // Reemplaza con el correo del comercio
  obtenerAdministrador(correoComercio);
}, []);


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
      setDireccionCantonId("");
      setDireccionDistritoId("");
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (provinceRef.current && !provinceRef.current.contains(e.target)) {
        setIsProvinceDropdownOpen(false);
      }
      if (cantonRef.current && !cantonRef.current.contains(e.target)) {
        setIsCantonDropdownOpen(false);
      }
      if (distritoRef.current && !distritoRef.current.contains(e.target)) {
        setIsDistritoDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    if (formData.provincia.length > 0) {
      fetch(`https://ubicaciones.paginasweb.cr/provincias.json`)
        .then((response) => response.json())
        .then((data) => {
          const provinciasArray = Object.entries(data).map(([id, nombre]) => ({
            id,
            nombre,
          }));
          setProvincias(provinciasArray);
          setFilteredProvincias(provinciasArray);
        })
        .catch((error) => {
          console.error("Error al obtener provincias:", error);
          setProvincias([]);
        });
    }
  }, [formData.provincia]);

  useEffect(() => {
    if (formData.provincia) {
      setFilteredProvincias(
        provincias.filter((provincia) =>
          provincia.nombre
            .toLowerCase()
            .includes(formData.provincia.toLowerCase())
        )
      );
    }
  }, [formData.provincia, provincias]);

  useEffect(() => {
    if (direccionProvinciaId && formData.canton.length > 0) {
      fetch(
        `https://ubicaciones.paginasweb.cr/provincia/${direccionProvinciaId}/cantones.json`
      )
        .then((response) => response.json())
        .then((data) => {
          const cantonesArray = Object.entries(data).map(([id, nombre]) => ({
            id,
            nombre,
          }));
          setCantones(cantonesArray);
          setFilteredCantones(cantonesArray);
        })
        .catch((error) => {
          console.error("Error al obtener cantones:", error);
          setCantones([]);
        });
    }
  }, [formData.canton, direccionProvinciaId]);

  useEffect(() => {
    if (formData.canton) {
      setFilteredCantones(
        cantones.filter((canton) =>
          canton.nombre.toLowerCase().includes(formData.canton.toLowerCase())
        )
      );
    }
  }, [formData.canton, cantones]);

  useEffect(() => {
    if (
      direccionProvinciaId &&
      direccionCantonId &&
      formData.distrito.length > 0
    ) {
      fetch(
        `https://ubicaciones.paginasweb.cr/provincia/${direccionProvinciaId}/canton/${direccionCantonId}/distritos.json`
      )
        .then((response) => response.json())
        .then((data) => {
          const distritosArray = Object.entries(data).map(([id, nombre]) => ({
            id,
            nombre,
          }));
          setDistritos(distritosArray);
          setFilteredDistritos(distritosArray);
        })
        .catch((error) => {
          console.error("Error al obtener distritos:", error);
          setDistritos([]);
        });
    }
  }, [formData.distrito, direccionCantonId, direccionProvinciaId]);

  useEffect(() => {
    if (formData.distrito) {
      setFilteredDistritos(
        distritos.filter((distrito) =>
          distrito.nombre
            .toLowerCase()
            .includes(formData.distrito.toLowerCase())
        )
      );
    }
  }, [formData.distrito, distritos]);

  const validateForm = () => {
    let errors = {};

    if (!formData.correo || !/\S+@\S+\.\S+/.test(formData.correo)) {
      errors.correo = "El correo debe ser válido.";
    }

    if (!formData.nombre) {
      errors.nombre = "El nombre no puede estar vacío.";
    }

    if (!formData.apellido1) {
      errors.apellido1 = "El primer apellido no puede estar vacío.";
    }

    if (!formData.apellido2) {
      errors.apellido2 = "El segundo apellido no puede estar vacío.";
    }

    if (!formData.usuario || formData.usuario.length < 4) {
      errors.usuario =
        "El nombre de usuario debe tener al menos 4 caracteres y solo puede contener letras y números.";
    }

    if (!formData.password || formData.password.length < 6) {
      errors.password =
        "La contraseña debe tener al menos 6 caracteres, incluyendo una letra y un número.";
    }

    if (!formData.provincia || !formData.canton || !formData.distrito) {
      errors.direccion =
        "Debe completar todos los campos de dirección (provincia, cantón y distrito).";
    }

    return errors;
  };

  const handleAddEmployee = async () => {
    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) {
      return;
    }

    const newAdmin = {
      correo: formData.correo,
      nombre: formData.nombre,
      apellido1: formData.apellido1,
      apellido2: formData.apellido2,
      usuario: formData.usuario,
      password: formData.password,
      provincia: formData.provincia,
      canton: formData.canton,
      distrito: formData.distrito,
    };

    try {
      const response = await fetch('https://sqlapi-hshshrdbaba8gbgd.canadacentral-01.azurewebsites.net/api/comercios/registrarAdmin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAdmin),
      });

      const data = await response.json();
      
      if (response.ok) {
        alert('Administrador insertado correctamente.');
        setEmpleados([...empleados, newAdmin]);
        setFormData({
          correo: "",
          nombre: "",
          apellido1: "",
          apellido2: "",
          usuario: "",
          provincia: "",
          canton: "",
          distrito: "",
        });
      } else {
        alert('Error al insertar el administrador.');
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      alert('Hubo un error al realizar la solicitud.');
    }
  };

  const handleEditEmployee = (index) => {
    setEditing(true);
    setCurrentIndex(index);
    setFormData(empleados[index]);
    setDireccionProvinciaId(empleados[index].direccionProvinciaId);
    setDireccionCantonId(empleados[index].direccionCantonId);
    setDireccionDistritoId(empleados[index].direccionDistritoId);
  };

  const handleUpdateEmployee = () => {
    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) {
      return;
    }

    const updatedEmployees = [...empleados];
    updatedEmployees[currentIndex] = {
      ...formData,
      direccionProvinciaId,
      direccionCantonId,
      direccionDistritoId,
    };
    setEmpleados(updatedEmployees);
    setFormData({
      correo: "",
      nombre: "",
      apellido1: "",
      apellido2: "",
      usuario: "",
      password: "",
      provincia: "",
      canton: "",
      distrito: "",
    });
    setDireccionProvinciaId("");
    setDireccionCantonId("");
    setDireccionDistritoId("");
    setEditing(false);
    setCurrentIndex(null);
  };

  const handleDeleteEmployee = (index) => {
    const updatedEmployees = empleados.filter((_, i) => i !== index);
    setEmpleados(updatedEmployees);
  };

  return (
    <div className="gestion-empleados">

      <div className="form-container">
        <div>
          <label>Correo</label>
          <input
            type="email"
            name="correo"
            placeholder="Correo"
            value={formData.correo}
            onChange={handleInputChange}
            style={{ borderColor: errors.correo ? "red" : "" }}
          />
          {errors.correo && <small className="error-message">{errors.correo}</small>}
        </div>

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
          {errors.nombre && <small className="error-message">{errors.nombre}</small>}
        </div>

        <div>
          <label>Apellido 1</label>
          <input
            type="text"
            name="apellido1"
            placeholder="Primer Apellido"
            value={formData.apellido1}
            onChange={handleInputChange}
            style={{ borderColor: errors.apellido1 ? "red" : "" }}
          />
          {errors.apellido1 && <small className="error-message">{errors.apellido1}</small>}
        </div>

        <div>
          <label>Apellido 2</label>
          <input
            type="text"
            name="apellido2"
            placeholder="Segundo Apellido"
            value={formData.apellido2}
            onChange={handleInputChange}
            style={{ borderColor: errors.apellido2 ? "red" : "" }}
          />
          {errors.apellido2 && <small className="error-message">{errors.apellido2}</small>}
        </div>

        <div>
          <label>Nombre De Usuario</label>
          <input
            type="text"
            name="usuario"
            placeholder="Usuario"
            value={formData.usuario}
            onChange={handleInputChange}
            style={{ borderColor: errors.usuario ? "red" : "" }}
          />
          {errors.usuario && <small className="error-message">{errors.usuario}</small>}
        </div>

        <div>
          <label>Contraseña</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            style={{ borderColor: errors.password ? "red" : "" }}
          />
          {errors.password && <small className="error-message">{errors.password}</small>}
        </div>

        <div>
          <label>Dirección</label>
          <div className="dropdown-container" ref={provinceRef}>
            <input
              type="text"
              name="provincia"
              placeholder="Provincia"
              value={formData.provincia}
              onChange={handleInputChange}
              onFocus={() => setIsProvinceDropdownOpen(true)}
              style={{ borderColor: errors.direccion ? "red" : "" }}
            />
            {errors.direccion && <small className="error-message">{errors.direccion}</small>}
            {isProvinceDropdownOpen && filteredProvincias.length > 0 && (
              <ul className="dropdown-list">
                {filteredProvincias.map((provincia, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      setFormData((prevState) => ({
                        ...prevState,
                        provincia: provincia.nombre,
                      }));
                      setDireccionProvinciaId(provincia.id);
                      setIsProvinceDropdownOpen(false);
                    }}
                  >
                    {provincia.nombre}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="dropdown-container" ref={cantonRef}>
            <input
              type="text"
              name="canton"
              placeholder="Cantón"
              value={formData.canton}
              onChange={handleInputChange}
              onFocus={() => setIsCantonDropdownOpen(true)}
            />
            {isCantonDropdownOpen && filteredCantones.length > 0 && (
              <ul className="dropdown-list">
                {filteredCantones.map((canton, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      setFormData((prevState) => ({
                        ...prevState,
                        canton: canton.nombre,
                      }));
                      setDireccionCantonId(canton.id);
                      setIsCantonDropdownOpen(false);
                    }}
                  >
                    {canton.nombre}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="dropdown-container" ref={distritoRef}>
            <input
              type="text"
              name="distrito"
              placeholder="Distrito"
              value={formData.distrito}
              onChange={handleInputChange}
              onFocus={() => setIsDistritoDropdownOpen(true)}
            />
            {isDistritoDropdownOpen && filteredDistritos.length > 0 && (
              <ul className="dropdown-list">
                {filteredDistritos.map((distrito, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      setFormData((prevState) => ({
                        ...prevState,
                        distrito: distrito.nombre,
                      }));
                      setDireccionDistritoId(distrito.id);
                      setIsDistritoDropdownOpen(false);
                    }}
                  >
                    {distrito.nombre}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {editing ? (
          <button className="actualizar-emp" onClick={handleUpdateEmployee}>Actualizar Empleado</button>
        ) : (
          <button onClick={handleAddEmployee}>Agregar Empleado</button>
        )}
        {editing && <button className="cancelar-edicion" onClick={handleCancelEdit}>Cancelar</button>}
      </div>

      <div className="empleados-list">
        <h3>Lista de Administradores/Afiliados</h3>
        <table className="empleados-table">
          <thead>
            <tr>
              <th>Correo</th>
              <th>Nombre</th>
              <th>Apellido 1</th>
              <th>Apellido 2</th>
              <th>Usuario</th>
              <th>Provincia</th>
              <th>Cantón</th>
              <th>Distrito</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empleados.map((empleado, index) => (
              <tr key={index}>
                <td>{empleado.correo}</td>
                <td>{empleado.nombre}</td>
                <td>{empleado.apellido1}</td>
                <td>{empleado.apellido2}</td>
                <td>{empleado.usuario}</td>
                <td>{empleado.provincia}</td>
                <td>{empleado.canton}</td>
                <td>{empleado.distrito}</td>
                <td>
                  <div className="btn-acciones">
                    <button onClick={() => handleEditEmployee(index)}>Editar</button>
                    <button onClick={() => handleDeleteEmployee(index)}>Eliminar</button>
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

export default GestionAF;
