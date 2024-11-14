import React, { useEffect } from "react";
import "./RestaurantDetail.css";
import { useCart } from "../../CartContext"; // Importa el contexto del carrito

function RestaurantDetail({ restaurante, onBack }) {
  const { addToCart, cart = [] } = useCart(); // Asegura que cart sea un array vacío si es undefined

  useEffect(() => {
    // Función para manejar el retroceso en el navegador
    const handlePopState = (event) => {
      onBack();
    };

    // Agregar evento de escucha para el retroceso
    window.addEventListener("popstate", handlePopState);

    // Limpiar el evento de escucha cuando el componente se desmonte
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [onBack]);

  // Función para obtener la cantidad de un platillo específico en el carrito
  const getCartQuantity = (platilloId) => {
    const item = cart.find(
      (item) => item.id === platilloId && item.restaurantId === restaurante.id
    );
    return item ? item.cantidad : 0;
  };

  // Función para agregar un platillo al carrito
  const handleAddToCart = (platillo) => {
    addToCart({ ...platillo, restaurantId: restaurante.id });
  };

  return (
    <div className="restaurant-detail">
      <button onClick={onBack}>Volver a los restaurantes</button>
      <h2>{restaurante.nombre}</h2>
      <p>{restaurante.descripcion}</p>

      <div className="platillos">
        {restaurante.platillos.map((platillo) => (
          <div key={platillo.id} className="platillo-item">
            <div className="platillo-info">
              <h4>{platillo.nombre}</h4>
              <p className="precio">₡ {platillo.precio}</p>
              <p className="descripcion">{platillo.descripcion}</p>
            </div>
            <div className="image-container">
              <img src={platillo.imgUrl} alt={platillo.nombre} />
              <button
                className="add-button"
                onClick={() => handleAddToCart(platillo)}
              >
                {getCartQuantity(platillo.id) > 0 ? getCartQuantity(platillo.id) : "+"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RestaurantDetail;
