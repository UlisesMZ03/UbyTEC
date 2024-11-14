import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useCart } from '../../CartContext';
import restaurants from '../data/restaurants.json';
import './CheckOut.css';

const Checkout = () => {
  const { state } = useLocation();
  const { cart } = useCart();
  const { restaurantId } = state;

  const [paymentMethod, setPaymentMethod] = useState('');
  const [feedback, setFeedback] = useState('');

  const productos = cart.filter(item => item.restaurantId === parseInt(restaurantId));

  const getRestaurantName = (restaurantId) => {
    const restaurant = restaurants.find((r) => r.id === parseInt(restaurantId));
    return restaurant ? restaurant.nombre : "Restaurante desconocido";
  };

  const calcularTotal = () => {
    return productos.reduce((total, item) => total + parseFloat(item.precio) * item.cantidad, 0);
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleFeedbackChange = (event) => {
    setFeedback(event.target.value);
  };

  const handlePayment = () => {
    if (paymentMethod === '') {
      alert('Por favor, elige un método de pago.');
    } else {
      alert(`Pago realizado con éxito utilizando ${paymentMethod}.`);
    }
  };

  const dejarFeedback = async () => {
    if (!feedback) {
      alert("Por favor, escribe un comentario antes de enviar.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ feedback }), // Enviar el feedback como JSON
      });
  
      if (response.ok) {
        alert("Gracias por tu feedback");
        setFeedback(""); // Limpiar el campo de texto después de enviar
      } else {
        alert("Hubo un problema al enviar el feedback");
      }
    } catch (error) {
      console.error("Error al enviar feedback:", error);
      alert("Error de conexión. No se pudo enviar el feedback.");
    }
  };

  return (
    <div className="checkout-page-container">
      <h1>Checkout</h1>
      <h2>{`Restaurante: ${getRestaurantName(restaurantId)}`}</h2>
      
      <div className="checkout-products-summary">
        {productos.length > 0 ? (
          productos.map((item) => (
            <div key={`${item.id}-${restaurantId}`} className="checkout-product-item">
              <h3>{item.nombre}</h3>
              <p>Cantidad: {item.cantidad}</p>
              <p>Precio: ₡ {item.precio}</p>
            </div>
          ))
        ) : (
          <p>No hay productos de este restaurante en el carrito.</p>
        )}
      </div>

      <div className="checkout-total">
        <h3>Total: ₡ {calcularTotal().toLocaleString()}</h3>
      </div>

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

      {/* Sección de comentario del pedido */}
      <div className="checkout-comment">
        <h3>Comentario del pedido:</h3>
        <textarea
          value={feedback}
          onChange={handleFeedbackChange}
          placeholder="Escribe aquí cualquier comentario o instrucción especial para el pedido"
        />
        <button className="feedback-button" onClick={dejarFeedback}>Enviar Comentario</button>
      </div>
    </div>
  );
};

export default Checkout;
