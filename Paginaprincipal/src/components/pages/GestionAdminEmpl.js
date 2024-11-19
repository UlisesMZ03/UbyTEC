import React, { useState, useEffect, useRef } from 'react';
import './GestionAdminEmpl.css';

const GestionEmpleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [formData, setFormData] = useState({
    cedula: '',
    nombre: '',
    apellido1: '',
    apellido2: '',
    direccionProvincia: '',
    direccionCanton: '',
    direccionDistrito: '',
    telefono: '',
    usuario: '',
    password: ''
  });
  const [direccionProvinciaId, setDireccionProvinciaId] = useState('');
  const [direccionCantonId, setDireccionCantonId] = useState('');
  const [direccionDistritoId, setDireccionDistritoId] = useState('');
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'direccionProvincia') {
      setFormData((prevState) => ({
        ...prevState,
        direccionProvincia: value,
        direccionCanton: '',
        direccionDistrito: ''
      }));
      setDireccionProvinciaId(value);
      setDireccionCantonId('');
      setDireccionDistritoId('');
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value
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

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Obtener sugerencias de provincias
  useEffect(() => {
    if (formData.direccionProvincia.length > 0) {
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
          console.error('Error al obtener provincias:', error);
          setProvincias([]);
        });
    }
  }, [formData.direccionProvincia]);

  // Filtrar provincias según lo que escribe el usuario
  useEffect(() => {
    if (formData.direccionProvincia) {
      setFilteredProvincias(
        provincias.filter((provincia) =>
          provincia.nombre
            .toLowerCase()
            .includes(formData.direccionProvincia.toLowerCase())
        )
      );
    }
  }, [formData.direccionProvincia, provincias]);

  // Obtener sugerencias de cantones
  useEffect(() => {
    if (direccionProvinciaId && formData.direccionCanton.length > 0) {
      fetch(`https://ubicaciones.paginasweb.cr/provincia/${direccionProvinciaId}/cantones.json`)
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
          console.error('Error al obtener cantones:', error);
          setCantones([]);
        });
    }
  }, [formData.direccionCanton, direccionProvinciaId]);

  // Filtrar cantones según lo que escribe el usuario
  useEffect(() => {
    if (formData.direccionCanton) {
      setFilteredCantones(
        cantones.filter((canton) =>
          canton.nombre
            .toLowerCase()
            .includes(formData.direccionCanton.toLowerCase())
        )
      );
    }
  }, [formData.direccionCanton, cantones]);

  // Obtener sugerencias de distritos
  useEffect(() => {
    if (direccionProvinciaId && direccionCantonId && formData.direccionDistrito.length > 0) {
      fetch(`https://ubicaciones.paginasweb.cr/provincia/${direccionProvinciaId}/canton/${direccionCantonId}/distritos.json`)
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
          console.error('Error al obtener distritos:', error);
          setDistritos([]);
        });
    }
  }, [formData.direccionDistrito, direccionCantonId, direccionProvinciaId]);

  // Filtrar distritos según lo que escribe el usuario
  useEffect(() => {
    if (formData.direccionDistrito) {
      setFilteredDistritos(
        distritos.filter((distrito) =>
          distrito.nombre
            .toLowerCase()
            .includes(formData.direccionDistrito.toLowerCase())
        )
      );
    }
  }, [formData.direccionDistrito, distritos]);

  // Validaciones antes de agregar o actualizar empleado
  const validateForm = () => {
    let errors = {};

    if (!formData.cedula || formData.cedula.length !== 9 || isNaN(formData.cedula)) {
      errors.cedula = 'La cédula debe contener exactamente 9 dígitos numéricos.';
    }

    if (!formData.usuario || formData.usuario.length < 4) {
      errors.usuario =
        'El nombre de usuario debe tener al menos 4 caracteres y solo puede contener letras y números.';
    }

    if (!formData.password || formData.password.length < 6) {
      errors.password =
        'La contraseña debe tener al menos 6 caracteres, incluyendo una letra y un número.';
    }

    if (!formData.direccionProvincia || !formData.direccionCanton || !formData.direccionDistrito) {
      errors.direccion =
        'Debe completar todos los campos de dirección (provincia, cantón y distrito).';
    }

    return errors;
  };

  // Agregar nuevo empleado
  const handleAddEmployee = () => {
    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) {
      return;
    }

    setEmpleados([
      ...empleados,
      { ...formData, direccionProvinciaId, direccionCantonId, direccionDistritoId },
    ]);
    setFormData({
      cedula: '',
      nombre: '',
      apellido1: '',
      apellido2: '',
      direccionProvincia: '',
      direccionCanton: '',
      direccionDistrito: '',
      telefono: '',
      usuario: '',
      password: '',
    });
    setDireccionProvinciaId('');
    setDireccionCantonId('');
    setDireccionDistritoId('');
  };

  // Editar empleado
  const handleEditEmployee = (index) => {
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
      cedula: '',
      nombre: '',
      apellido1: '',
      apellido2: '',
      direccionProvincia: '',
      direccionCanton: '',
      direccionDistrito: '',
      telefono: '',
      usuario: '',
      password: '',
    });
    setDireccionProvinciaId('');
    setDireccionCantonId('');
    setDireccionDistritoId('');
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
            style={{ borderColor: errors.nombre ? 'red' : '' }}
          />
          <input
            type="text"
            name="apellido1"
            placeholder="Primer Apellido"
            value={formData.apellido1}
            onChange={handleInputChange}
            style={{ borderColor: errors.apellido1 ? 'red' : '' }}
          />
          <input
            type="text"
            name="apellido2"
            placeholder="Segundo Apellido"
            value={formData.apellido2}
            onChange={handleInputChange}
            style={{ borderColor: errors.apellido2 ? 'red' : '' }}
          />
          {errors.nombre && <small className="error-message">{errors.nombre}</small>}
          {errors.apellido1 && <small className="error-message">{errors.apellido1}</small>}
          {errors.apellido2 && <small className="error-message">{errors.apellido2}</small>}
        </div>

        <div>
          <label>Cédula</label>
          <input
            type="text"
            name="cedula"
            placeholder="Número Cédula"
            value={formData.cedula}
            onChange={handleInputChange}
            style={{ borderColor: errors.cedula ? 'red' : '' }}
          />
          {errors.cedula && <small className="error-message">{errors.cedula}</small>}
        </div>

        <div>
          <label>Dirección</label>
          <div className="dropdown-container" ref={provinceRef}>
            <input
              type="text"
              name="direccionProvincia"
              placeholder="Provincia"
              value={formData.direccionProvincia}
              onChange={handleInputChange}
              onFocus={() => setIsProvinceDropdownOpen(true)}
              style={{ borderColor: errors.direccion ? 'red' : '' }}
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
                        direccionProvincia: provincia.nombre,
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
              name="direccionCanton"
              placeholder="Cantón"
              value={formData.direccionCanton}
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
                        direccionCanton: canton.nombre,
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
              name="direccionDistrito"
              placeholder="Distrito"
              value={formData.direccionDistrito}
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
                        direccionDistrito: distrito.nombre,
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
            style={{ borderColor: errors.usuario ? 'red' : '' }}
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
            style={{ borderColor: errors.password ? 'red' : '' }}
          />
          {errors.password && <small className="error-message">{errors.password}</small>}
        </div>

        {editing ? (
          <button onClick={handleUpdateEmployee}>Actualizar Empleado</button>
        ) : (
          <button onClick={handleAddEmployee}>Agregar Empleado</button>
        )}
      </div>

      <div className="empleados-list">
        <h3>Lista de Empleados</h3>
        <ul>
          {empleados.map((empleado, index) => (
            <li key={index}>
              <span>
                {empleado.nombre} {empleado.apellido1} {empleado.apellido2} - {empleado.cedula}
              </span>
              <button onClick={() => handleEditEmployee(index)}>Editar</button>
              <button onClick={() => handleDeleteEmployee(index)}>Eliminar</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GestionEmpleados;
