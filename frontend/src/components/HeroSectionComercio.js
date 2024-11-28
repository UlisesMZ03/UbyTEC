import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HeroSection.css';
import '../App.css';
import { Button } from './Button'; // Si utilizas este componente, de lo contrario puedes usar el <button> estándar

function HeroSection() {
  const [user, setUser] = useState(null); // Aquí podrías obtener el usuario, si está logueado

  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();



  if (user) {
    return null; // Si ya hay un usuario logueado, no se muestra esta sección
  }

  return (
    <div className="hero-container">
      <div className="welcome-message">
        <h2>Bienvenido, administrador de comercio</h2>
        <p>Gestiona todos los aspectos de tu comercio desde esta sección.</p>
        
        <button className="login-btn-hero" onClick={() => navigate('/AdminAfiliado')}>
          Gestionar
        </button>
      </div>
    </div>
  );
}

export default HeroSection;
