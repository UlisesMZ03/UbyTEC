import React, { useState } from 'react';
import "../../App.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../../AuthContext"; // Importar el contexto de autenticación
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); // Usar la función login del contexto

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Hacer la solicitud al servidor para verificar las credenciales
      const response = await fetch('https://apisql-cwbndbaagqerg7dw.canadacentral-01.azurewebsites.net/api/users/login', {  // Asegúrate de poner la URL correcta de tu API
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Si la respuesta es exitosa, iniciar sesión con el token
        login({
          userId: formData.email, // Puedes cambiar esto según la respuesta de la API
          nombre: 'Usuario', // Aquí también puedes incluir el nombre si lo recibes en la respuesta
          token: data.token, // Si la API devuelve un token JWT
          role: 'client' // Define el rol dependiendo de la lógica que necesites
        });

        // Redirigir al usuario según su rol (por ejemplo, en este caso 'client')
        navigate("/");
      } else {
        // Mostrar mensaje de error si las credenciales son incorrectas
        setErrorMessage(data.message || "Email o contraseña incorrectos");
      }
    } catch (error) {
      setErrorMessage("Hubo un error al intentar iniciar sesión. Intenta de nuevo.");
    }
  };

  return (
    <div className="iniciar-sesion">
      <h1 className="login">INICIAR SESIÓN</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="text"
            placeholder="Introduce tu email"
            value={formData.email}
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
        {errorMessage && <p className="error-message">{errorMessage}</p>}
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
