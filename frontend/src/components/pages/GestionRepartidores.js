import React, { useState, useEffect, useRef } from 'react';
import './GestionAdminEmpl.css';

const GestionRepartidores = () => {
  const [repartidores, setRepartidores] = useState([]);
  const [formData, setFormData] = useState({
    correo: '',
    nombre: '',
    apellido1: '',
    apellido2: '',
    usuario: '',
    direccionProvincia: '',
    direccionCanton: '',
    direccionDistrito: '',
    estado: ''
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

  // Validaciones antes de agregar o actualizar repartidor
  const validateForm = () => {
    let errors = {};

    if (!formData.correo || !/\S+@\S+\.\S+/.test(formData.correo)) {
      errors.correo = 'El correo electrónico es obligatorio y debe ser válido.';
    }

    if (!formData.nombre) {
      errors.nombre = 'El nombre es obligatorio.';
    }

    if (!formData.apellido1) {
      errors.apellido1 = 'El primer apellido es obligatorio.';
    }

    if (!formData.apellido2) {
      errors.apellido2 = 'El segundo apellido es obligatorio.';
    }

    if (!formData.usuario || formData.usuario.length < 4) {
      errors.usuario =
        'El nombre de usuario debe tener al menos 4 caracteres y solo puede contener letras y números.';
    }

    if (!formData.direccionProvincia || !formData.direccionCanton || !formData.direccionDistrito) {
      errors.direccion =
        'Debe completar todos los campos de dirección (provincia, cantón y distrito).';
    }

    if (!formData.estado) {
      errors.estado = 'El estado es obligatorio.';
    }

    return errors;
  };

  // Agregar nuevo repartidor
  const handleAddMessenger = () => {
    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) {
      return;
    }

    setRepartidores([
      ...repartidores,
      { ...formData, direccionProvinciaId, direccionCantonId, direccionDistritoId },
    ]);
    setFormData({
      correo: '',
      nombre: '',
      apellido1: '',
      apellido2: '',
      usuario: '',
      direccionProvincia: '',
      direccionCanton: '',
      direccionDistrito: '',
      estado: ''
    });
    setDireccionProvinciaId('');
    setDireccionCantonId('');
    setDireccionDistritoId('');
  };

  // Editar repartidor
  const handleEditMessenger = (index) => {
    setEditing(true);
    setCurrentIndex(index);
    setFormData(repartidores[index]);
    setDireccionProvinciaId(repartidores[index].direccionProvinciaId);
    setDireccionCantonId(repartidores[index].direccionCantonId);
    setDireccionDistritoId(repartidores[index].direccionDistritoId);
  };

  // Actualizar repartidor
  const handleUpdateMessenger = () => {
    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) {
      return;
    }

    const updatedMessengers = [...repartidores];
    updatedMessengers[currentIndex] = {
      ...formData,
      direccionProvinciaId,
      direccionCantonId,
      direccionDistritoId,
    };
    setRepartidores(updatedMessengers);
    setFormData({
      correo: '',
      nombre: '',
      apellido1: '',
      apellido2: '',
      usuario: '',
      direccionProvincia: '',
      direccionCanton: '',
      direccionDistrito: '',
      estado: ''
    });
    setDireccionProvinciaId('');
    setDireccionCantonId('');
    setDireccionDistritoId('');
    setEditing(false);
    setCurrentIndex(null);
  };

  // Eliminar repartidor
  const handleDeleteMessenger = (index) => {
    const updatedMessengers = repartidores.filter((_, i) => i !== index);
    setRepartidores(updatedMessengers);
  };

  return (
    <div className="gestion-repartidores">
      <h2>Gestión de Repartidores</h2>
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
          <label>Correo</label>
          <input
            type="email"
            name="correo"
            placeholder="Correo"
            value={formData.correo}
            onChange={handleInputChange}
            style={{ borderColor: errors.correo ? 'red' : '' }}
          />
          {errors.correo && <small className="error-message">{errors.correo}</small>}
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
          <label>Estado</label>
          <input
            type="text"
            name="estado"
            placeholder="Estado"
            value={formData.estado}
            onChange={handleInputChange}
            style={{ borderColor: errors.estado ? 'red' : '' }}
          />
          {errors.estado && <small className="error-message">{errors.estado}</small>}
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

        {editing ? (
          <button onClick={handleUpdateMessenger}>Actualizar Repartidor</button>
        ) : (
          <button onClick={handleAddMessenger}>Agregar Repartidor</button>
        )}
      </div>

      <div className="repartidores-list">
        <h3>Lista de Repartidores</h3>
        <ul>
          {repartidores.map((repartidor, index) => (
            <li key={index}>
              <span>
                {repartidor.nombre} {repartidor.apellido1} {repartidor.apellido2} - {repartidor.correo}
              </span>
              <button onClick={() => handleEditMessenger(index)}>Editar</button>
              <button onClick={() => handleDeleteMessenger(index)}>Eliminar</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GestionRepartidores;
