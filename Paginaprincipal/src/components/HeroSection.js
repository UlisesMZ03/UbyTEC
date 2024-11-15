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



  // Función para obtener sugerencias de Nominatim
  const fetchSuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}&countrycodes=CR&addressdetails=1&limit=5`
      );
      const data = await response.json();
      if (data) {
        setSuggestions(data.map(item => item.display_name));
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    }
  };

  // Función para actualizar las sugerencias basadas en la entrada
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);
    fetchSuggestions(value);
  };

  // Función para seleccionar una sugerencia
  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    setSuggestions([]);
  };

  if (user) {
    return null; // O mostrar un loader si prefieres mientras redirige
  }

  return (
    <div className="hero-container">
      <div className="welcome-message">
        <h2>Entrega de pedidos cerca de ti</h2>
        <p>Ingresa la dirección de entrega y encuentra las mejores opciones de comida a tu alcance.</p>
        <div className="search-bar">
          <div className="autocomplete">
            <input
              type="text"
              placeholder="Ingresa la dirección de entrega"
              value={input}
              onChange={handleInputChange}
            />
            {suggestions.length > 0 && (
              <ul className="suggestions">
                {suggestions.map((suggestion, index) => (
                  <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <select>
            <option>Entregar ahora</option>
            <option>Programar entrega</option>
          </select>
          <button className="login-btn-hero" onClick={() => navigate('/delivery')}>
          Buscar
        </button>
        </div>
        <p className="or-login">O <span className="login-link" onClick={() => navigate('/login')}>iniciar sesión</span></p>
      </div>
    </div>
  );
}

export default HeroSection;
