import React, { useState, useEffect, useContext } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';  // Importamos los íconos
import './PedidoPage.css';

// Asegúrate de tener el AuthContext correctamente configurado
import { useAuth } from '../../AuthContext';

const PedidoPage = () => {
  const { user } = useAuth(); // Obtener el user.Id (correo) desde el AuthContext
  const [pedidos, setPedidos] = useState([]);  // Estado para almacenar los pedidos
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [feedback, setFeedback] = useState("");  // Estado para almacenar el feedback
  const [mostrarFormularioFeedback, setMostrarFormularioFeedback] = useState(false);  // Estado para mostrar el formulario de feedback
  const [pedidoSeleccionadoFeedback, setPedidoSeleccionadoFeedback] = useState(null);  // Estado para saber cuál pedido calificar

  // Llamada a la API para obtener los pedidos basados en el correo del usuario
  useEffect(() => {
    if (user && user.userId) {
      const fetchPedidos = async () => {
        try {
          console.log("Usuario: " + user.userId);
          const response = await fetch(`https://apisql-cwbndbaagqerg7dw.canadacentral-01.azurewebsites.net/api/pedidos/obtenerPorCorreo?correoCliente=${user.userId}`);
          const data = await response.json();

          // Verifica si la respuesta tiene los datos esperados
          console.log("Datos recibidos de la API:", data);

          // Asegurarse de que la estructura de los datos se acomode al estado
          if (data && data.pedidos && data.productos && data.comercios) {
            const pedidosConDetalles = data.pedidos.map(pedido => {
              // Obtener los productos asociados al pedido
              const productos = data.productos.filter(producto => producto.pedidoID === pedido.pedidoID);
              // Obtener el comercio asociado al pedido
              const comercio = data.comercios.find(comercio => comercio.pedidoID === pedido.pedidoID);
              return {
                ...pedido,
                productos,
                comercio
              };
            });

            // Mostrar los datos combinados de pedidos
            console.log("Pedidos con productos y comercios:", pedidosConDetalles);

            setPedidos(pedidosConDetalles);  // Asignar los pedidos con productos y comercios asociados
          }
        } catch (error) {
          console.error('Error al obtener los pedidos:', error);
        }
      };

      fetchPedidos();
    }
  }, [user]);  // Se vuelve a ejecutar si cambia el user

  const handleItemClick = (pedidoId) => {
    if (pedidoSeleccionado === pedidoId) {
      setPedidoSeleccionado(null);
    } else {
      setPedidoSeleccionado(pedidoId);
    }
  };

  // Función para manejar el envío de feedback
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
        body: JSON.stringify({ feedback, pedidoId: pedidoSeleccionadoFeedback }), 
      });

      if (response.ok) {
        alert("Gracias por tu feedback");
        setFeedback(""); 
        setMostrarFormularioFeedback(false);  // Ocultar el formulario de feedback después de enviar
        setPedidoSeleccionadoFeedback(null);  // Limpiar el pedido seleccionado
      } else {
        alert("Hubo un problema al enviar el feedback");
      }
    } catch (error) {
      console.error("Error al enviar feedback:", error);
      alert("Error de conexión. No se pudo enviar el feedback.");
    }
  };

  return (
    <div className="pedido-container">
      <h2>Historial de Pedidos</h2>
      {pedidos.length === 0 ? (
        <p>No tienes pedidos registrados.</p>
      ) : (
        pedidos.map((pedido) => (
          <div key={pedido.pedidoID} className="pedido-item">
            <div className="restaurante-logo-container">
              <img
                src={pedido.comercio.comercioImagen}
                alt={pedido.comercio.comercioNombre}
                className="restaurante-logo"
              />
            </div>
            <div className="pedido-info">
              <h3>{pedido.comercio.comercioNombre}</h3>
              <p className="pedido-details">
                {pedido.productos.length} artículos de ₡{pedido.total.toLocaleString()} • {new Date(pedido.fechaCreacion).toLocaleString()}
              </p>
              <p className="estado">{pedido.estado} ({pedido.productos.length})</p> {/* Mostrar el estado */}
              <div className="productos">
                {pedidoSeleccionado === pedido.pedidoID ? (
                  <ul>
                    {pedido.productos.map((producto, index) => (
                      <li key={index}>
                        <p>
                          <span className="cantidad">{producto.cantidad}</span> {producto.productoNombre}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul>
                    {pedido.productos.slice(0, 2).map((producto, index) => (
                      <li key={index}>
                        <p>
                          <span className="cantidad">{producto.cantidad}</span> {producto.productoNombre}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mostrar-mas">
                  <button className="mostrar-mas-button" onClick={() => handleItemClick(pedido.pedidoID)}>
                    {pedidoSeleccionado === pedido.pedidoID ? 'Mostrar menos' : 'Mostrar más'}
                    {pedidoSeleccionado === pedido.pedidoID ? (
                      <FaChevronUp />
                    ) : (
                      <FaChevronDown />
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div className="acciones">
              <button className="ver-tienda">Ver tienda</button>
              <button 
                className="calificar" 
                onClick={() => {
                  setMostrarFormularioFeedback(true);
                  setPedidoSeleccionadoFeedback(pedido.pedidoID); // Establecer el pedido que se va a calificar
                }}
              >
                Califica el pedido
              </button>
            </div>

            {/* Formulario para dejar el feedback */}
            {mostrarFormularioFeedback && pedido.pedidoID === pedidoSeleccionadoFeedback && (
              <div className="feedback-form">
                <textarea 
                  placeholder="Escribe tu comentario aquí..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
                <button onClick={dejarFeedback}>Enviar Feedback</button>
                <button onClick={() => setMostrarFormularioFeedback(false)}>Cancelar</button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default PedidoPage;
