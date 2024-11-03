import React, { useEffect, useState } from 'react';


import "./HeroSection.css";

import "../App.css";

import { Button } from "./Button";
import { Link } from "react-router-dom";

// Importa las imágenes locales (asegúrate de agregar imágenes relacionadas a dispositivos inteligentes)
import smartHomeImage1 from "../images/casa.png";
import smartHomeImage2 from "../images/berries.png";
function HeroSection() {
  const [user, setUser] = useState(null);

  // Verificar si el usuario ha iniciado sesión
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Si el usuario está logueado, obtenemos su información
    }
  }, []);

  return (
    <div className="hero-container">
      <div className="welcome-message">
        {user ? (
          <>
            <h2>Bienvenido de nuevo, {user.nombre}</h2>
            <p>La plataforma que te permitirá gestionar todos tus dispositivos inteligentes.</p>
          </>
        ) : (
          <>
            <h2>Bienvenido a SmartHomeTEC!</h2>
            <p>La plataforma que te permitirá gestionar todos tus dispositivos inteligentes desde un solo lugar.</p>
          </>
        )}
      </div>

      {/* Texto principal del Hero */}
      <div className="hero-text">
        <h1>Controla tu hogar inteligente de manera eficiente.</h1>
        <p>¿Quieres administrar tus dispositivos de forma centralizada? Monitorea y controla todos tus dispositivos con SmartHomeTEC.</p>
        <div className="hero-btns">
          <Button className="btns" buttonStyle="btn--primary" buttonSize="btn--large">
            EMPIEZA AHORA
          </Button>
        </div>
      </div>

      {/* Imágenes de apoyo */}
      <div className="hero-images">
        <img src={smartHomeImage1} alt="Dispositivo inteligente" className="hero-image" />
      </div>
    </div>
  );
}

export default HeroSection;
