import React, { useState } from "react";
import "../../App.css";
import { useNavigate } from "react-router-dom";
import "./Registrarse.css"; // Asegúrate de crear este archivo CSS

export default function Registrarse() {
  const navigate = useNavigate();
  
  // Manejar los valores del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    apellido1: "",
    apellido2: "",
    continente: "",
    pais: "",
    email: "",
    password: "",
    direccion: ""
  });

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  // Función para enviar los datos a la API
  const handleClick = async () => {
    try {
      const response = await fetch("https://localhost:5555/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Nombre: formData.nombre,
          Apellidos: formData.apellido1 + " " + formData.apellido2,
          Region: formData.continente + " - " + formData.pais,
          CorreoElectronico: formData.email,
          Contraseña: formData.password,
          DireccionEntrega: formData.direccion,
          Dispositivos: [] // Asumo que no se envían dispositivos en el registro inicial
        })
      });

      if (response.ok) {
        // Si la respuesta es exitosa, redirige al usuario
        alert("Registro exitoso");
        navigate("/"); // Redirigir después del registro exitoso
      } else {
        const errorData = await response.json();
        alert("Error al registrarse: " + errorData.errors || "Error desconocido");
      }
    } catch (error) {
      console.error("Error al conectarse con la API:", error);
      alert("Error al conectarse con la API");
    }
  };

  return (
    <div className="register-container">
      <h1 className="registrarse">¡Únete a Smart Home!</h1>
      <p className="description">Regístrate y empieza a controlar tu hogar de manera inteligente.</p>
      <form className="register-form">
        
        {/* Nombre */}
        <div className="input-group">
          <label>Nombre</label>
          <input id="nombre" type="text" placeholder="Ingresa tu nombre" value={formData.nombre} onChange={handleChange} />
        </div>

        {/* Primer Apellido */}
        <div className="input-group">
          <label>Primer Apellido</label>
          <input id="apellido1" type="text" placeholder="Ingresa tu primer apellido" value={formData.apellido1} onChange={handleChange} />
        </div>

        {/* Segundo Apellido */}
        <div className="input-group">
          <label>Segundo Apellido</label>
          <input id="apellido2" type="text" placeholder="Ingresa tu segundo apellido" value={formData.apellido2} onChange={handleChange} />
        </div>

        {/* Región - Continente */}
        <div className="input-group">
          <label>Continente</label>
          <select id="continente" value={formData.continente} onChange={handleChange}>
            <option value="america">América</option>
            <option value="europa">Europa</option>
            <option value="asia">Asia</option>
            <option value="africa">África</option>
            <option value="oceania">Oceanía</option>
          </select>
        </div>

        {/* Región - País */}
        <div className="input-group">
          <label>País</label>
          <input id="pais" type="text" placeholder="Ingresa tu país" value={formData.pais} onChange={handleChange} />
        </div>

        {/* Correo Electrónico */}
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="Ingresa tu correo electrónico" value={formData.email} onChange={handleChange} />
        </div>

        {/* Contraseña */}
        <div className="input-group">
          <label htmlFor="password">Contraseña</label>
          <input id="password" type="password" placeholder="Ingresa tu contraseña" value={formData.password} onChange={handleChange} />
        </div>

        {/* Dirección de Entrega */}
        <div className="input-group">
          <label>Dirección de Entrega</label>
          <input id="direccion" type="text" placeholder="Ingresa tu dirección de entrega" value={formData.direccion} onChange={handleChange} />
        </div>

        <button type="button" onClick={handleClick} className="btn-register">
          Registrarse
        </button>

        <p className="message">¡Estás a solo un paso de controlar tu hogar con Smart Home!</p>
      </form>
    </div>
  );
}
