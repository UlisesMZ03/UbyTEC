import React, { useState, useEffect } from "react";
import "./DeliveryHome.css";
import restaurantes from "../data/restaurants.json";
import RestaurantDetail from "./RestaurantDetail";

function DeliveryHome() {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  // Recupera el restaurante seleccionado de localStorage cuando se monta el componente
  useEffect(() => {
    const savedRestaurant = localStorage.getItem("selectedRestaurant");
    if (savedRestaurant) {
      setSelectedRestaurant(JSON.parse(savedRestaurant));
    }
  }, []);

  // Guarda el restaurante seleccionado en localStorage cada vez que cambia
  const handleRestaurantClick = (restaurante) => {
    setSelectedRestaurant(restaurante);
    localStorage.setItem("selectedRestaurant", JSON.stringify(restaurante));
  };

  const handleBackToRestaurants = () => {
    setSelectedRestaurant(null);
    localStorage.removeItem("selectedRestaurant");
  };

  return (
    <div className="aspect-ratio-container">
      <div className="delivery-home">
        {selectedRestaurant ? (
          <RestaurantDetail
            restaurante={selectedRestaurant}
            onBack={handleBackToRestaurants}
          />
        ) : (
          <>
            <h2>¡Elige el restaurante donde quieres comer hoy!</h2>
            <div className="restaurantes">
              {restaurantes.map((restaurante) => (
                <div
                  key={restaurante.id}
                  className="restaurante-item"
                  onClick={() => handleRestaurantClick(restaurante)}
                >
                  <img src={restaurante.imgUrl} alt={restaurante.nombre} />
                  <h2>{restaurante.nombre}</h2>
                  <p>{restaurante.descripcion}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default DeliveryHome;
