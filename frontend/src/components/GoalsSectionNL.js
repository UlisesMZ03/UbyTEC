import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Importa Link desde react-router-dom
import "./GoalsSection.css";
import citiesData from "./data/cities.json"; // Asegúrate de que la ruta sea correcta

function GoalsSectionNL() {
  const [cities, setCities] = useState([]);

  useEffect(() => {
    setCities(citiesData);
  }, []);

  return (
    <div className="ubbytec-cities">
      {/* Opciones */}
      <div className="options">
        <div className="option-item">
          <h3>¿Tienes un comercio?</h3>
          <p>Afíliate para que tu comercio esté disponible en nuestra plataforma.</p>
          {/* Usamos Link para redirigir a la página /reg-afiliado */}
          <Link to="/reg-afiliado">
            <button>Afiliar mi comercio</button>
          </Link>
        </div>
        <div className="option-item">
          <h3>¿Te interesa hacer entregas?</h3>
          <p>Únete como socio repartidor y empieza a generar ganancias.</p>
          <Link to="/reg-repartidor">
          <button>Unirme como socio repartidor</button>
          </Link>
        </div>
      </div>

      {/* Lista de ciudades */}
      <h2>Ciudades donde opera UBYTEC</h2>
      <div className="city-list">
        {cities.map((city) => (
          <div key={city.id} className="city-item">
            {city.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default GoalsSectionNL;
