import React, { useState, useEffect } from "react";
import "./DeliveryHome.css";
import RestaurantDetail from "./RestaurantDetail";

function DeliveryHome() {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const urlAPI = "https://apisql-cwbndbaagqerg7dw.canadacentral-01.azurewebsites.net"; // URL base de la API

  // Recupera el restaurante seleccionado de localStorage cuando se monta el componente
  useEffect(() => {
    const savedRestaurant = localStorage.getItem("selectedRestaurant");
    if (savedRestaurant) {
      setSelectedRestaurant(JSON.parse(savedRestaurant));
    }

    // Fetch restaurantes desde la API
    const fetchRestaurants = async () => {
      try {
        // Parámetros de la zona que se pueden modificar dinámicamente
        const provincia = "San José";  // Puedes usar un estado o cambiar por la zona deseada
        const canton = "Central";      // Lo mismo aquí

        // Llamada a la API para obtener los restaurantes
        const response = await fetch(`${urlAPI}/api/comercios/buscarZona?provincia=${provincia}&canton=${canton}`);
      
        if (!response.ok) {
          throw new Error("Error al obtener los restaurantes");
        }

        const data = await response.json();  // Aquí se obtiene la lista de restaurantes
        console.log("Restaurantes obtenidos:", data);  // Console log para verificar los datos
        setRestaurants(data);  // Guarda los restaurantes en el estado
      } catch (error) {
        console.error("Error al obtener los restaurantes:", error);
        setErrorMessage("No se pudo cargar la lista de restaurantes.");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);  // Solo se ejecuta una vez cuando el componente se monta

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
            {loading ? (
              <p>Cargando restaurantes...</p>
            ) : (
              <>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <div className="restaurantes">
                  {restaurants.map((restaurante) => (
                    <div
                      key={restaurante.correo} // Usamos Correo como clave única
                      className="restaurante-item"
                      onClick={() => handleRestaurantClick(restaurante)}
                    >
                      <img src={restaurante.imagen} alt={restaurante.nombre} />
                      <h2>{restaurante.nombre}</h2>
                      <p>{restaurante.direccion}</p> {/* Dirección del restaurante */}
                      <p>📍 {restaurante.canton} ,{restaurante.distrito}</p> {/* Distrito del restaurante */}
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default DeliveryHome;
