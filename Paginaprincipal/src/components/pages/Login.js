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

  // Usuarios de prueba con roles
  const testUsers = [
    {
      email: 'admin@prueba.com',
      password: 'admin123',
      userId: 'adminUser123',
      nombre: 'Administrador de Prueba',
      token: 'fakeTokenAdmin123',
      role: 'admin' // Rol de administrador
    },
    {
      email: 'affiliate@prueba.com',
      password: 'affiliate123',
      userId: 'affiliateUser123',
      nombre: 'Afiliado de Prueba',
      token: 'fakeTokenAffiliate123',
      role: 'affiliate' // Rol de afiliado
    },
    {
      email: 'client@prueba.com',
      password: 'client123',
      userId: 'clientUser123',
      nombre: 'Cliente de Prueba',
      token: 'fakeTokenClient123',
      role: 'client' // Rol de cliente
    }
  ];

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
  };

  const handleSubmit2 = async (e) => {
    e.preventDefault();

    // Verifica si los datos coinciden con alguno de los usuarios de prueba
    const user = testUsers.find(u => u.email === formData.email && u.password === formData.password);

    if (user) {
      // Inicia sesión con el rol correspondiente
      login({
        userId: user.userId,
        nombre: user.nombre,
        token: user.token,
        role: user.role
      });

      // Redirige al usuario según su rol
      if (user.role === 'admin') {
        navigate("/");
      } else if (user.role === 'affiliate') {
        navigate("/affiliate");
      } else if (user.role === 'client') {
        navigate("/");
      }
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
