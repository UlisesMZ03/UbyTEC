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

  // Usuario de prueba
  const testUser = {
    email: 'usuario@prueba.com',
    password: '123456',
    userId: 'testUser123',
    nombre: 'Usuario de Prueba',
    token: 'fakeToken12345'
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
  };

  const handleSubmit2 = async (e) => {
    e.preventDefault();

    // Verifica si los datos coinciden con el usuario de prueba
    if (formData.email === testUser.email && formData.password === testUser.password) {
      login({
        userId: testUser.userId,
        nombre: testUser.nombre,
        token: testUser.token
      });
      navigate("/delivery");
    } else {
      setErrorMessage("Email o contraseña incorrectos");
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
