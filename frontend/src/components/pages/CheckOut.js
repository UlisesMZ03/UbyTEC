import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Importamos useNavigate
import { useCart } from '../../CartContext';
import { useAuth } from '../../AuthContext';  // Importamos el hook useAuth
import './CheckOut.css';

const Checkout = () => {
  const { state } = useLocation();
  const { cart, setCart, actualizarCarritoEnBaseDeDatos } = useCart();  // Destructura setCart y actualizarCarritoEnBaseDeDatos desde useCart
  const { user, loggedIn } = useAuth();  // Usamos useAuth para acceder a los datos del usuario
  const navigate = useNavigate();  // Inicializamos el hook useNavigate

  const { restaurantName } = state;

  const [paymentMethod, setPaymentMethod] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);  // Estado para controlar la pantalla de carga
  const [paymentStatus, setPaymentStatus] = useState(null);  // Estado para el resultado del pago
  const [statusMessage, setStatusMessage] = useState('');  // Mensaje de estado

  // Filtrar los productos que corresponden al restaurante actual
  const productos = cart.filter(item => item.nombreComercio === restaurantName);

  // Imprimir todos los productos del carrito en consola
  useEffect(() => {
    console.log('Datos del carrito:', cart);
  }, [cart]);

  // Imprimir lo que hay dentro de userAuth en consola
  useEffect(() => {
    console.log('Datos del usuario autenticado:', user);  // Imprime los datos del usuario
    console.log('¿Está logueado?', loggedIn);  // Imprime si el usuario está logueado
  }, [user, loggedIn]); // Se ejecuta cuando user o loggedIn cambian

  const getRestaurantName = () => {
    return restaurantName || "Restaurante desconocido";
  };

  const calcularTotalBase = () => {
    return productos.reduce((total, item) => total + parseFloat(item.precio) * item.cantidad, 0);
  };

  const calcularIVA = (totalBase) => {
    return totalBase * 0.05;
  };

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

  const handlePayment = async () => {
    if (paymentMethod === '') {
      alert('Por favor, elige un método de pago.');
      return;
    }
  
    // Mostrar "Verificando Pedido" y la rueda de carga durante 2 segundos
    setStatusMessage('Verificando Pedido');
    setPaymentStatus(null);  // Reseteamos el estado del pago
    setIsLoading(true);  // Mostrar la pantalla de carga
  
    // Esperar 2 segundos para mostrar "Verificando Pedido" antes de continuar
    setTimeout(async () => {
      const totalPedido = calcularTotalConIVA(); // Total con IVA calculado
      const productosParaEnviar = productos.map(item => ({
        ProductID: item.productoID,
        Cantidad: item.cantidad,
      }));
  
      const pedidoData = {
        Estado: "Pendiente",
        CorreoCliente: user.userId,
        CorreoComercio: null,
        CorreoMensajero: null,
        Provincia: "San José",
        Canton: "Central",
        Distrito: "Catedral",
        Productos: JSON.stringify(productosParaEnviar),
        Total: totalPedido,
      };
  
      console.log('Datos del pedido:', JSON.stringify(pedidoData, null, 2));
  
      try {
        const response = await fetch('https://apisql-cwbndbaagqerg7dw.canadacentral-01.azurewebsites.net/api/pedidos/realizar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(pedidoData),
        });
  
        if (response.ok) {
          const data = await response.json();
          setStatusMessage(`Pago realizado con éxito.`);
          setPaymentStatus('success');  // Cambio al estado de éxito
  
          // Eliminar los productos del carrito después de realizar el pago
          const productosRestantes = cart.filter(item => item.nombreComercio !== restaurantName);
          setCart(productosRestantes); // Actualizar el carrito en el estado local
  
          // Eliminar el carrito en la base de datos haciendo una solicitud al API
          const eliminarCarritoResponse = await fetch(`https://apisql-cwbndbaagqerg7dw.canadacentral-01.azurewebsites.net/api/carrito/eliminar`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ CorreoCliente: user.userId, ProductIDs: productos.map(item => item.productoID) }),
          });
  
          if (eliminarCarritoResponse.ok) {
            console.log('Carrito eliminado exitosamente de la base de datos');
          } else {
            console.error('Hubo un problema al eliminar el carrito de la base de datos');
          }
  
          // Actualizar el carrito en la base de datos después de eliminar los productos
          actualizarCarritoEnBaseDeDatos(productosRestantes);
          
          // Redirigir a la página de pedidos después de que el pago se haya completado
          setTimeout(() => {
            navigate('/pedidos'); // Redirige a /pedidos
          }, 2000); // Espera 2 segundos antes de la redirección
        } else {
          setStatusMessage('Hubo un problema al procesar el pago.');
          setPaymentStatus('error');  // Cambio al estado de error
        }
      } catch (error) {
        setStatusMessage('Error al realizar el pago.');
        setPaymentStatus('error');  // Cambio al estado de error
      } finally {
        // Esperar 2 segundos antes de ocultar el overlay
        setTimeout(() => setIsLoading(false), 2000);  // Cambio a 2000 milisegundos (2 segundos)
      }
    }, 2000);  // Esperar 2 segundos antes de continuar con el pago
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
      <h2>{`Restaurante: ${getRestaurantName()}`}</h2>

      {/* Pantalla de carga */}
      {isLoading && (
  <div className="loading-overlay">
    <div className="loading-content">
      <p>{statusMessage}</p>
      {paymentStatus === 'success' && (
        <div className="check-icon">&#10004;</div>  // Check icon
      )}
      {paymentStatus === 'error' && (
        <div className="error-icon">&#10060;</div>  // Error icon
      )}
      {paymentStatus === null && (
        <div className="loader"></div>  // Loading wheel
      )}
    </div>
  </div>
)}

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
                <tr key={`${item.productoID}-${restaurantName}`}>
                  <td>{item.nombreProducto}</td>
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
