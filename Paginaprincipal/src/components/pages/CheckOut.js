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

  // Función para calcular el total antes de IVA
  const calcularTotalBase = () => {
    return productos.reduce((total, item) => total + parseFloat(item.precio) * item.cantidad, 0);
  };

  // Función para calcular el IVA (5%)
  const calcularIVA = (totalBase) => {
    return totalBase * 0.05;
  };



  // Función para calcular el total con IVA incluido y costos adicionales
  const calcularTotalConIVA = () => {
    const totalBase = calcularTotalBase();
    const iva = calcularIVA(totalBase);
    return totalBase + iva ;
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
      const response = await fetch("https://apimongo-c5esbwe4bfhxf2gy.canadacentral-01.azurewebsites.net/api/feedback", { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ feedback }), 
      });

      if (response.ok) {
        alert("Gracias por tu feedback");
        setFeedback(""); 
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
          <table className="checkout-product-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((item) => (
                <tr key={`${item.id}-${restaurantId}`}>
                  <td>{item.nombre}</td>
                  <td>{item.cantidad}</td>
                  <td>₡ {item.precio}</td>
                  <td>₡ {(item.precio * item.cantidad).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay productos de este restaurante en el carrito.</p>
        )}
      </div>

      {/* Toda la sección de resumen de costos dentro de checkout-total */}
      <div className="checkout-total">
        <div className="checkout-summary-item">
          <span>Subtotal</span>
          <span>₡ {calcularTotalBase().toLocaleString()}</span>
        </div>

        <div className="checkout-summary-item">
          <span>IVA (5%)</span>
          <span>₡ {calcularIVA(calcularTotalBase()).toLocaleString()}</span>
        </div>
        <div className="checkout-summary-item">
          <h3>Total del pedido</h3>
          <h3>₡ {calcularTotalConIVA().toLocaleString()}</h3>
        </div>
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
