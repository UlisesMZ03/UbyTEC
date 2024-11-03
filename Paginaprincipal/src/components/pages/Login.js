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

  const handleSubmit2 = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://localhost:5555/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        if (data.userId) {
          // Usar la función login del contexto para guardar el estado global
          login({
            userId: data.userId,
            nombre: data.nombre,
            token: data.token // Si tienes un token, también puedes guardarlo
          });
          
          // Redirigir a la página de inicio o dashboard
          navigate("/");
        }
      } else {
        setErrorMessage(data.message || "Error al iniciar sesión");
      }
    } catch (error) {
      console.error("Error al conectarse con la API:", error);
      setErrorMessage("Error al conectarse con la API");
    }
  };

  return (
    <div className="iniciar-sesion">
      <h1 className="login">INICIAR SESIÓN</h1>
      <form onSubmit={handleSubmit2}>
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
