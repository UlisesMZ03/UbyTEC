import React, { useState } from 'react';
import { useLocation } from 'react-router-dom'; // Usamos useLocation para acceder al estado pasado
import { useCart } from '../../CartContext'; // Asegúrate de importar el contexto del carrito
import restaurants from '../data/restaurants.json'; // Asegúrate de que la ruta sea correcta
import './CheckOut.css'; // Agrega tus estilos

const Checkout = () => {
  const { state } = useLocation(); // Obtener restaurantId desde el estado pasado
  const { cart } = useCart(); // Obtener el carrito desde el contexto
  const { restaurantId } = state;

  // Estado para manejar el método de pago seleccionado
  const [paymentMethod, setPaymentMethod] = useState('');

  // Verifica si el restaurantId está llegando correctamente
  console.log("restaurantId recibido:", restaurantId);

  // Filtra los productos del carrito según el restaurantId
  const productos = cart.filter(item => {
    console.log("Comparando item.restaurantId:", item.restaurantId, "con restaurantId:", restaurantId); // Verifica la comparación
    return item.restaurantId === parseInt(restaurantId); // Asegúrate de comparar como número
  });

  // Función para obtener el nombre del restaurante usando el restaurantId
  const getRestaurantName = (restaurantId) => {
    const restaurant = restaurants.find((r) => r.id === parseInt(restaurantId)); // Convierte el id a número
    return restaurant ? restaurant.nombre : "Restaurante desconocido";
  };

  // Calcular el total de los productos
  const calcularTotal = () => {
    return productos.reduce((total, item) => total + parseFloat(item.precio) * item.cantidad, 0);
  };

  // Función para manejar el cambio de método de pago
  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  // Simular el proceso de pago
  const handlePayment = () => {
    if (paymentMethod === '') {
      alert('Por favor, elige un método de pago.');
    } else {
      alert(`Pago realizado con éxito utilizando ${paymentMethod}.`);
    }
  };

  return (
    <div className="checkout-page-container">
      <h1>Checkout</h1>
      <h2>{`Restaurante: ${getRestaurantName(restaurantId)}`}</h2> {/* Muestra el nombre del restaurante */}
      
      <div className="checkout-products-summary">
        {productos.length > 0 ? (
          productos.map((item) => (
            <div key={`${item.id}-${restaurantId}`} className="checkout-product-item"> {/* Clave única */}
              <h3>{item.nombre}</h3>
              <p>Cantidad: {item.cantidad}</p>
              <p>Precio: ₡ {item.precio}</p>
            </div>
          ))
        ) : (
          <p>No hay productos de este restaurante en el carrito.</p> // Mensaje si no hay productos para ese restaurante
        )}
      </div>

      <div className="checkout-total">
        <h3>Total: ₡ {calcularTotal().toLocaleString()}</h3> {/* Mostrar el total calculado */}
      </div>

      {/* Sección de selección de método de pago */}
      <div className="checkout-payment-method">
        <h3>Selecciona un método de pago:</h3>
        <select value={paymentMethod} onChange={handlePaymentMethodChange}>
          <option value="">Selecciona un método</option>
          <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
          <option value="PayPal">PayPal</option>
          <option value="Efectivo">Efectivo</option>
        </select>
      </div>

      <button className="checkout-button" onClick={handlePayment}>Realizar Pago</button>
    </div>
  );
};

export default Checkout;
