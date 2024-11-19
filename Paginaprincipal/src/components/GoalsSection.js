import React, { useEffect, useState } from "react";
import "./GoalsSection.css";
import citiesData from "./data/cities.json"; // Asegúrate de que la ruta sea correcta

function GoalsSection() {
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
    </div>
  );
}

export default GoalsSection;
