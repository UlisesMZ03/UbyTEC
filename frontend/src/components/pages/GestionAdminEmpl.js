import React, { useState, useEffect, useRef } from "react";
import "./GestionAdminEmpl.css";

const GestionEmpleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [formData, setFormData] = useState({
    cedula: "",
    nombre: "",
    apellido1: "",
    apellido2: "",
    provincia: "",
    canton: "",
    distrito: "",
    telefono: "",
    usuario: "",
    password: "",
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
    // Restablecer el formulario a su estado original
    setFormData({
      cedula: "",
      nombre: "",
      apellido1: "",
      apellido2: "",
      provincia: "",
      canton: "",
      distrito: "",
      telefono: "",
      usuario: "",
      password: "",
    });
    setDireccionProvinciaId("");
    setDireccionCantonId("");
    setDireccionDistritoId("");
    setEditing(false); // Salir del modo de edición
    setCurrentIndex(null); // Limpiar el índice del empleado actual
  };
  // Función para obtener los administradores desde el servidor
  const obtenerAdministradores = async () => {
    try {
      const response = await fetch(
        "https://sqlapi-hshshrdbaba8gbgd.canadacentral-01.azurewebsites.net/api/administrador/obtenerAdministradores"
      ); // Cambia la URL si es necesario
      const data = await response.json();
      console.log("Datos recibidos de administradores:", data);

      setEmpleados(data); // Actualiza el estado con los administradores obtenidos
    } catch (error) {
      console.error("Error al obtener los administradores:", error);
    }
  };

  // Llamar a la API cuando el componente se monte
  useEffect(() => {
    obtenerAdministradores();
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

  // Detectar clics fuera de los dropdowns para cerrarlos
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

  // Obtener sugerencias de provincias
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

  // Filtrar provincias según lo que escribe el usuario
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

  // Obtener sugerencias de cantones
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

  // Filtrar cantones según lo que escribe el usuario
  useEffect(() => {
    if (formData.canton) {
      setFilteredCantones(
        cantones.filter((canton) =>
          canton.nombre.toLowerCase().includes(formData.canton.toLowerCase())
        )
      );
    }
  }, [formData.canton, cantones]);

  // Obtener sugerencias de distritos
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

  // Filtrar distritos según lo que escribe el usuario
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

  // Validaciones antes de agregar o actualizar empleado
  const validateForm = () => {
    let errors = {};

    // Validación de la cédula
    if (
      !formData.cedula ||
      formData.cedula.length !== 9 ||
      isNaN(formData.cedula)
    ) {
      errors.cedula =
        "La cédula debe contener exactamente 9 dígitos numéricos.";
    }

    // Validación de los campos de nombre, apellido1 y apellido2
    if (!formData.nombre) {
      errors.nombre = "El nombre no puede estar vacío.";
    }

    if (!formData.apellido1) {
      errors.apellido1 = "El primer apellido no puede estar vacío.";
    }

    if (!formData.apellido2) {
      errors.apellido2 = "El segundo apellido no puede estar vacío.";
    }

    // Validación del nombre de usuario
    if (!formData.usuario || formData.usuario.length < 4) {
      errors.usuario =
        "El nombre de usuario debe tener al menos 4 caracteres y solo puede contener letras y números.";
    }

    // Validación de la contraseña
    if (!formData.password || formData.password.length < 6) {
      errors.password =
        "La contraseña debe tener al menos 6 caracteres, incluyendo una letra y un número.";
    }

    // Validación de la dirección
    if (!formData.provincia || !formData.canton || !formData.distrito) {
      errors.direccion =
        "Debe completar todos los campos de dirección (provincia, cantón y distrito).";
    }

    return errors;
  };

  // Agregar nuevo empleado
const handleAddEmployee = async () => {
  const formErrors = validateForm();
  setErrors(formErrors);

  if (Object.keys(formErrors).length > 0) {
    console.log("Errores de formulario:", formErrors);
    return;
  }

  // Crear un objeto con los datos del nuevo administrador
  const newAdmin = {
    cedula: formData.cedula,
    nombre: formData.nombre,
    apellido1: formData.apellido1,
    apellido2: formData.apellido2,
    usuario: formData.usuario,
    password: formData.password,
    provincia: formData.provincia,
    canton: formData.canton,
    distrito: formData.distrito
  };

  console.log("Datos del nuevo administrador que se van a insertar:", newAdmin);

  try {
    // Llamada al backend para insertar el nuevo administrador
    console.log("Realizando la solicitud para insertar el administrador...");
    const response = await fetch('https://sqlapi-hshshrdbaba8gbgd.canadacentral-01.azurewebsites.net/api/administrador/insertar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newAdmin)
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log("Respuesta del backend:", data.message);
      alert('Administrador insertado correctamente.');

      // Si la inserción fue exitosa, agregarlo a la lista de empleados
      setEmpleados([
        ...empleados,
        { ...formData, direccionProvinciaId, direccionCantonId, direccionDistritoId },
      ]);

      // Limpiar el formulario después de la inserción
      setFormData({
        cedula: '',
        nombre: '',
        apellido1: '',
        apellido2: '',
        provincia: '',
        canton: '',
        distrito: '',
        telefono: '',
        usuario: '',
        password: ''
      });
      setDireccionProvinciaId('');
      setDireccionCantonId('');
      setDireccionDistritoId('');
    } else {
      console.error("Error de la respuesta:", data.error);
      alert('Error al insertar el administrador.');
    }
  } catch (error) {
    console.error("Error al realizar la solicitud:", error);
    alert('Hubo un error al realizar la solicitud.');
  }
};

  

  // Editar empleado
  const handleEditEmployee = (index) => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Desplazamiento suave hacia arriba en toda la página
    });
  
    // Desplazar el contenedor de contenido (asegurándote de que tenga un id o una clase)
    const contentElement = document.querySelector('.content-adminDashboard'); // Asegúrate de que el contenedor tenga esta clase o id
    if (contentElement) {
      contentElement.scrollTo({
        top: 0,
        behavior: 'smooth', // Desplazamiento suave dentro del contenedor
      });
    }
    setEditing(true);
    setCurrentIndex(index);
    setFormData(empleados[index]);
    setDireccionProvinciaId(empleados[index].direccionProvinciaId);
    setDireccionCantonId(empleados[index].direccionCantonId);
    setDireccionDistritoId(empleados[index].direccionDistritoId);
  };

  // Actualizar empleado
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
      cedula: "",
      nombre: "",
      apellido1: "",
      apellido2: "",
      provincia: "",
      canton: "",
      distrito: "",
      telefono: "",
      usuario: "",
      password: "",
    });
    setDireccionProvinciaId("");
    setDireccionCantonId("");
    setDireccionDistritoId("");
    setEditing(false);
    setCurrentIndex(null);
  };

  // Eliminar empleado
  const handleDeleteEmployee = (index) => {
    const updatedEmployees = empleados.filter((_, i) => i !== index);
    setEmpleados(updatedEmployees);
  };

  return (
    <div className="gestion-empleados">
      <h2>Gestión de Administradores/Empleados</h2>
      <div className="form-container">
        <div>
          <label>Nombre Completo</label>
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
            style={{ borderColor: errors.apellido2 ? "red" : "" }}
          />
          {errors.nombre && (
            <small className="error-message">{errors.nombre}</small>
          )}
          {errors.apellido1 && (
            <small className="error-message">{errors.apellido1}</small>
          )}
          {errors.apellido2 && (
            <small className="error-message">{errors.apellido2}</small>
          )}
        </div>

        <div>
          <label>Cédula</label>
          <input
            type="text"
            name="cedula"
            placeholder="Número Cédula"
            value={formData.cedula}
            onChange={handleInputChange}
            style={{ borderColor: errors.cedula ? "red" : "" }}
            readOnly={editing} // La cédula será solo lectura cuando se está editando un empleado
          />

          {errors.cedula && (
            <small className="error-message">{errors.cedula}</small>
          )}
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
            {errors.direccion && (
              <small className="error-message">{errors.direccion}</small>
            )}
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
          {errors.usuario && (
            <small className="error-message">{errors.usuario}</small>
          )}
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
          {errors.password && (
            <small className="error-message">{errors.password}</small>
          )}
        </div>
        
        {editing ? (
          <button className="actualizar-emp" onClick={handleUpdateEmployee}>Actualizar Empleado</button>
        ) : (
          <button onClick={handleAddEmployee}>Agregar Empleado</button>
        )}
        {editing && <button className="cancelar-edicion" onClick={handleCancelEdit}>Cancelar</button>}

      </div>

      <div className="empleados-list">
        <h3>Lista de Administradores/Empleados</h3>
        <table className="empleados-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido 1</th>
              <th>Apellido 2</th>
              <th>Cédula</th>
              <th>Provincia</th>
              <th>Cantón</th>
              <th>Distrito</th>
              <th>Usuario</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empleados.map((empleado, index) => (
              <tr key={index}>
                <td>{empleado.nombre}</td>
                <td>{empleado.apellido1}</td>
                <td>{empleado.apellido2}</td>
                <td>{empleado.cedula}</td>
                <td>{empleado.provincia}</td>
                <td>{empleado.canton}</td>
                <td>{empleado.distrito}</td>
                <td>{empleado.usuario}</td>
                <td>
                  <div className="btn-acciones">
                    <button onClick={() => handleEditEmployee(index)}>
                      Editar
                    </button>
                    <button onClick={() => handleDeleteEmployee(index)}>
                      Eliminar
                    </button>
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

export default GestionEmpleados;
