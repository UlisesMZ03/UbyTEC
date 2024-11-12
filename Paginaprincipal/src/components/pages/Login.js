import React, { useState } from "react";
import "./Login.css";

function Login() {
  const [userType, setUserType] = useState("Administrador");

  const handleUserTypeChange = (event) => {
    setUserType(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Aquí puedes agregar la lógica para el inicio de sesión según el tipo de usuario
    console.log(`Iniciando sesión como: ${userType}`);
  };

  return (
    <div className="iniciar-sesion">
      <h2 className="login">Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        {/* Selección del tipo de usuario */}
        <div className="input-container">
          <label>Tipo de Usuario</label>
          <select value={userType} onChange={handleUserTypeChange}>
            <option value="Administrador">Administrador</option>
            <option value="Cliente">Cliente</option>
          </select>
        </div>

        {/* Campo de correo electrónico */}
        <div className="input-container">
          <label>Correo Electrónico</label>
          <input type="email" placeholder="Ingrese su correo" required />
        </div>

        {/* Campo de contraseña */}
        <div className="input-container">
          <label>Contraseña</label>
          <input type="password" placeholder="Ingrese su contraseña" required />
        </div>

        {/* Botón de inicio de sesión */}
        <div className="button-container">
          <button type="submit">Iniciar Sesión</button>
        </div>

        {/* Enlace para registrarse */}
        <div className="register-link">
          ¿No tienes cuenta? <a href="/register">Regístrate aquí</a>
        </div>
      </form>
    </div>
  );
}

export default Login;

