import React, { useState } from "react";
import { Link } from "react-router-dom"; // Importa Link para la navegación
import "./CommerceLogin.css";

function CommerceLogin() {
  const [cedulaJuridica, setCedulaJuridica] = useState("");

  const handleInputChange = (event) => {
    setCedulaJuridica(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Aquí se podría enviar el número de cédula jurídica al backend para autenticar el comercio
    console.log("Número de Cédula Jurídica:", cedulaJuridica);
  };

  return (
    <div className="commerce-login-container">
      <h2>Login Comercio Afiliado</h2>
      <form onSubmit={handleSubmit} className="commerce-login-form">
        <div className="input-container">
          <label>Número de Cédula Jurídica</label>
          <input
            type="text"
            value={cedulaJuridica}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="login-button">Iniciar Sesión</button>
      </form>

      {/* Enlace para registrarse */}
      <p className="register-link">
        ¿No tienes una cuenta? <Link to="/registerCommerce">Regístrate aquí</Link>
      </p>
    </div>
  );
}

export default CommerceLogin;

