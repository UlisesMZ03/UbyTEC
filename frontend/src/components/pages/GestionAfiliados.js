import React, { useState, useEffect, useRef } from "react";
import "./GestionAdminEmpl.css";
import { ToastContainer, toast } from "react-toastify"; // Importar react-toastify
import "react-toastify/dist/ReactToastify.css"; // Estilos para las notificaciones
const GestionEmpleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [formData, setFormData] = useState({
    correo: "",
    nombre: "",
    cedulaJuridica: "",
    numeroSINPE: "",
    correoAdmin: "",
    tipoID: "",
    provincia: "",
    canton: "",
    distrito: "",
    imagen: "",
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
      cedulaJuridica: "",
      numeroSINPE: "",
      correoAdmin: "",
      tipoID: "",
      provincia: "",
      canton: "",
      distrito: "",
      imagen: "",
    });
    setDireccionProvinciaId("");
    setDireccionCantonId("");
    setDireccionDistritoId("");
    setEditing(false);
    setCurrentIndex(null);
  };

  const obtenerAdministradores = async () => {
    try {
      const response = await fetch(
        "https://sqlapi-hshshrdbaba8gbgd.canadacentral-01.azurewebsites.net/api/comercios/obtenerComercios"
      );
      const data = await response.json();
      console.log("Datos recibidos de administradores:", data);

      setEmpleados(data);
    } catch (error) {
      console.error("Error al obtener los administradores:", error);
    }
  };

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

    if (!formData.correo) {
      errors.correo = "El correo no puede estar vacío.";
    }

    if (!formData.nombre) {
      errors.nombre = "El nombre no puede estar vacío.";
    }

    if (!formData.cedulaJuridica) {
      errors.cedulaJuridica = "La cédula jurídica no puede estar vacía.";
    }

    if (!formData.numeroSINPE) {
      errors.numeroSINPE = "El número SINPE no puede estar vacío.";
    }

    if (!formData.correoAdmin) {
      errors.correoAdmin = "El correo del administrador no puede estar vacío.";
    }

    if (!formData.tipoID) {
      errors.tipoID = "El tipo de ID no puede estar vacío.";
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
      console.log("Errores de formulario:", formErrors);
      return;
    }

    const newAdmin = {
      correo: formData.correo,
      nombre: formData.nombre,
      cedulaJuridica: formData.cedulaJuridica,
      numeroSINPE: formData.numeroSINPE,
      correoAdmin: formData.correoAdmin,
      tipoID: formData.tipoID,
      provincia: formData.provincia,
      canton: formData.canton,
      distrito: formData.distrito,
      imagen: formData.imagen,
    };

    console.log("Datos del nuevo administrador que se van a insertar:", newAdmin);

    try {
      const response = await fetch('http://sqlapi-hshshrdbaba8gbgd.canadacentral-01.azurewebsites.net/api/comercios/insertar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAdmin)
      });

      const data = await response.json();
    
      if (response.ok) {
        toast.success('Administrador insertado correctamente.', { position: 'top-right' });

        setEmpleados([
          ...empleados,
          { ...formData, direccionProvinciaId, direccionCantonId, direccionDistritoId },
        ]);

        setFormData({
          correo: '',
          nombre: '',
          cedulaJuridica: '',
          numeroSINPE: '',
          correoAdmin: '',
          tipoID: '',
          provincia: '',
          canton: '',
          distrito: '',
          imagen: '',
        });
        setDireccionProvinciaId('');
        setDireccionCantonId('');
        setDireccionDistritoId('');
      } else {
        console.error("Error de la respuesta:", data.error);
        toast.error('Error al insertar el administrador.', { position: 'top-right' });
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      toast.error('Hubo un error al realizar la solicitud.', { position: 'top-right' });
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
      cedulaJuridica: "",
      numeroSINPE: "",
      correoAdmin: "",
      tipoID: "",
      provincia: "",
      canton: "",
      distrito: "",
      imagen: "",
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
      <h2>Gestión de Afiliados</h2>
      <div className="form-container">
        <div>
          <label>Correo</label>
          <input
            type="text"
            name="correo"
            placeholder="Correo"
            value={formData.correo}
            onChange={handleInputChange}
            style={{ borderColor: errors.correo ? "red" : "" }}
          />
          {errors.correo && (
            <small className="error-message">{errors.correo}</small>
          )}
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
          {errors.nombre && (
            <small className="error-message">{errors.nombre}</small>
          )}
        </div>

        <div>
          <label>Cédula Jurídica</label>
          <input
            type="text"
            name="cedulaJuridica"
            placeholder="Cédula Jurídica"
            value={formData.cedulaJuridica}
            onChange={handleInputChange}
            style={{ borderColor: errors.cedulaJuridica ? "red" : "" }}
          />
          {errors.cedulaJuridica && (
            <small className="error-message">{errors.cedulaJuridica}</small>
          )}
        </div>

        <div>
          <label>Número SINPE</label>
          <input
            type="text"
            name="numeroSINPE"
            placeholder="Número SINPE"
            value={formData.numeroSINPE}
            onChange={handleInputChange}
            style={{ borderColor: errors.numeroSINPE ? "red" : "" }}
          />
          {errors.numeroSINPE && (
            <small className="error-message">{errors.numeroSINPE}</small>
          )}
        </div>

        <div>
          <label>Correo del Administrador</label>
          <input
            type="text"
            name="correoAdmin"
            placeholder="Correo Admin"
            value={formData.correoAdmin}
            onChange={handleInputChange}
            style={{ borderColor: errors.correoAdmin ? "red" : "" }}
          />
          {errors.correoAdmin && (
            <small className="error-message">{errors.correoAdmin}</small>
          )}
        </div>

        <div>
          <label>Tipo de ID</label>
          <input
            type="text"
            name="tipoID"
            placeholder="Tipo de ID"
            value={formData.tipoID}
            onChange={handleInputChange}
            style={{ borderColor: errors.tipoID ? "red" : "" }}
          />
          {errors.tipoID && (
            <small className="error-message">{errors.tipoID}</small>
          )}
        </div>

        <div>
          <label>Imagen</label>
          <input
            type="text"
            name="imagen"
            placeholder="URL de la Imagen"
            value={formData.imagen}
            onChange={handleInputChange}
            style={{ borderColor: errors.imagen ? "red" : "" }}
          />
          {errors.imagen && (
            <small className="error-message">{errors.imagen}</small>
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

        {editing ? (
          <button className="actualizar-emp" onClick={handleUpdateEmployee}>Actualizar Empleado</button>
        ) : (
          <button onClick={handleAddEmployee}>Agregar Empleado</button>
        )}
        {editing && <button className="cancelar-edicion" onClick={handleCancelEdit}>Cancelar</button>}
      </div>

      <div className="empleados-list">
        <h3>Lista de Comercios</h3>
        <table className="empleados-table">
          <thead>
            <tr>
              <th>Correo</th>
              <th>Nombre</th>
              <th>Cédula Jurídica</th>
              <th>Sinpe</th>
              <th>Correo Admin</th>
              <th>Tipo ID</th>
              <th>Provincia</th>
              <th>Cantón</th>
              <th>Distrito</th>
              <th>Imagen</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empleados.map((empleado, index) => (
              <tr key={index}>
                <td>{empleado.correo}</td>
                <td>{empleado.nombre}</td>
                <td>{empleado.cedulaJuridica}</td>
                <td>{empleado.numeroSINPE}</td>
                <td>{empleado.correoAdmin}</td>
                <td>{empleado.tipoID}</td>
                <td>{empleado.provincia}</td>
                <td>{empleado.canton}</td>
                <td>{empleado.distrito}</td>
                <td>{empleado.imagen}</td>
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
      <ToastContainer /> {/* Contenedor para las notificaciones */}
    </div>
  );
};

export default GestionEmpleados;
