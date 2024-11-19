import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../App.css";
import { useAuth } from "../../AuthContext"; // Importar el contexto de autenticación
import "./Login.css";
import { Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); // Usar la función login del contexto
  const urlAPI = "http://localhost:5133"; // URL base de la API

  const [formData, setFormData] = useState({
    correo: '',
    password: '',
    role: 'client' // Valor predeterminado: 'client'
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
  };

  const handleRoleChange = (e) => {
    setFormData({
      ...formData,
      role: e.target.value // Actualizamos el rol seleccionado
    });
  };

  const loginClient = async () => {
    try {
      const response = await fetch(`${urlAPI}/api/login/client`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          correo: formData.correo,
          password: formData.password,
        })
      });
  
      if (response.ok) {
        const data = await response.json();
  
        // Imprimir los datos recibidos desde la API
        console.log("Datos recibidos de la API:", data);
  
        // Suponiendo que la respuesta incluye un token y nombre de usuario
        login({
          userId: formData.correo, // Usamos el correo o un identificador único
          token: data.token, // Suponiendo que la API devuelve un token JWT
          nombre: data.nombre || 'Usuario', // Asumiendo que la respuesta incluye el nombre
          role: 'client', // Establecemos el rol como 'client'
          correo: data.correo, // Guardar correo
          apellido1: data.apellido1, // Guardar apellido1
          apellido2: data.apellido2, // Guardar apellido2
          cedula: data.cedula, // Guardar cedula
          canton: data.canton, // Guardar canton
          distrito: data.distrito, // Guardar distrito
          provincia: data.provincia, // Guardar provincia
          telefono: data.telefono, // Guardar telefono
          usuario: data.usuario, // Guardar nombre de usuario
        });
  
        setSuccessMessage("Login exitoso.");
        setErrorMessage('');
  
        // Redirigir a la ruta para cliente
        navigate("/"); // Ruta para cliente
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || "Email o contraseña incorrectos.");
        setSuccessMessage('');
      }
    } catch (error) {
      console.error("Error al intentar iniciar sesión:", error);
      setErrorMessage("Error de conexión. No se pudo iniciar sesión.");
      setSuccessMessage('');
    }
  };
  

  const loginAdmin = async () => {
    try {
      const response = await fetch(`${urlAPI}/api/login/admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          usuario: formData.correo,
          password: formData.password,
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Datos recibidos de la API:", data);

        login({
          userId: formData.correo, // Usamos el correo o un identificador único
          token: data.token,
          nombre: data.nombre || 'Admin',
          role: 'admin'
        });

        setSuccessMessage("Login exitoso.");
        setErrorMessage('');
        navigate("/"); // Ruta para administrador
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || "Email o contraseña incorrectos.");
        setSuccessMessage('');
      }
    } catch (error) {
      console.error("Error al intentar iniciar sesión:", error);
      setErrorMessage("Error de conexión. No se pudo iniciar sesión.");
      setSuccessMessage('');
    }
  };

  const loginComercioAdmin = async () => {
    try {
      const response = await fetch(`${urlAPI}/api/login/adminComercio`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          correo: formData.correo,
          password: formData.password,
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Datos recibidos de la API:", data);

        login({
          userId: formData.correo, 
          token: data.token,
          nombre: data.nombre || 'Comercio Admin',
          role: 'comercio_admin'
        });

        setSuccessMessage("Login exitoso.");
        setErrorMessage('');
        navigate("/"); // Ruta para admin de comercio
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || "Email o contraseña incorrectos.");
        setSuccessMessage('');
      }
    } catch (error) {
      console.error("Error al intentar iniciar sesión:", error);
      setErrorMessage("Error de conexión. No se pudo iniciar sesión.");
      setSuccessMessage('');
    }
  };

  const loginComercio = async () => {
    try {
      const response = await fetch(`${urlAPI}/api/login/comercio`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          correo: formData.correo,
          password: formData.password,
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Datos recibidos de la API:", data);

        login({
          userId: formData.correo, 
          token: data.token,
          nombre: data.nombre || 'Comercio',
          role: 'comercio'
        });

        setSuccessMessage("Login exitoso.");
        setErrorMessage('');
        navigate("/"); // Ruta para comercio
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || "Email o contraseña incorrectos.");
        setSuccessMessage('');
      }
    } catch (error) {
      console.error("Error al intentar iniciar sesión:", error);
      setErrorMessage("Error de conexión. No se pudo iniciar sesión.");
      setSuccessMessage('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validar que todos los campos estén llenos
    if (Object.values(formData).some(field => !field)) {
      setErrorMessage("Por favor completa todos los campos.");
      setSuccessMessage('');
      return;
    }

    // Llamada a la función de login correspondiente según el rol
    if (formData.role === 'client') {
      loginClient();
    } else if (formData.role === 'admin') {
      loginAdmin();
    } else if (formData.role === 'comercio_admin') {
      loginComercioAdmin();
    } else if (formData.role === 'comercio') {
      loginComercio();
    }
  };

  return (
    <div className="iniciar-sesion">
      <h1 className="login">INICIAR SESIÓN</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label htmlFor="correo">Email</label>
          <input
            id="correo"
            type="text"
            placeholder="Introduce tu email"
            value={formData.correo}
            onChange={handleInputChange}
          />
        </div>
        <div className="input-container">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            placeholder="Introduce tu contraseña"
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>

        {/* Selector de tipo de usuario */}
        <div className="input-container">
          <label htmlFor="role">Selecciona el tipo de usuario</label>
          <select id="role" value={formData.role} onChange={handleRoleChange}>
            <option value="client">Cliente</option>
            <option value="admin">Administrador</option>
            <option value="comercio_admin">Administrador de Comercio</option>
            <option value="comercio">Comercio</option>
          </select>
        </div>

        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <div className="button-container">
          <button type="submit">
            Iniciar Sesión
          </button>
        </div>
      </form>
      <div className="register-link">
        <Link to="/registrarse">O registrarse</Link>
      </div>
    </div>
  );
}
