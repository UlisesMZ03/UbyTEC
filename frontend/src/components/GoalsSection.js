import React, { useEffect, useState } from "react";
import "./GoalsSection.css";
import citiesData from "./data/cities.json"; // Asegúrate de que la ruta sea correcta

function GoalsSection({ userRole }) {
  const [cities, setCities] = useState([]);

  useEffect(() => {
    setCities(citiesData);
  }, []);

  return (
    <div className="ubbytec-cities">
      <h2>Ciudades donde opera UBYTEC</h2>
      <div className="city-list">
        {cities.map((city) => (
          <div key={city.id} className="city-item">
            {city.name}
          </div>
        ))}
      </div>

      {userRole === "" && (
        <div className="options">
          <div className="option-item">
            <h3>¿Tienes un comercio?</h3>
            <p>Afíliate para que tu comercio esté disponible en nuestra plataforma.</p>
            <button>Afiliar mi comercio</button>
          </div>
          <div className="option-item">
            <h3>¿Te interesa hacer entregas?</h3>
            <p>Únete como socio repartidor y empieza a generar ganancias.</p>
            <button>Unirme como socio repartidor</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GoalsSection;
