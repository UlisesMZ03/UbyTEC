import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HeroSection.css';
import '../App.css';
import { Button } from './Button';
import restaurantsData from './data/restaurants.json';

function HeroSection() {
  const [user, setUser] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();





  if (user) {
    return null; // O mostrar un loader si prefieres mientras redirige
  }

  return (
    <div className="hero-container">
      <div className="welcome-message">
        <h2>Entrega de pedidos cerca de ti</h2>
        <p>¿Qué esperas para pedir tu comida? ¡Las mejores opciones están a solo un clic de distancia!</p>
        


          <button className="login-btn-hero" onClick={() => navigate('/delivery')}>
          Buscar
        </button>
        </div>
        
      </div>
  
  );
}

export default HeroSection;
