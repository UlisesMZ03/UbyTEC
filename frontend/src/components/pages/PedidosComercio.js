import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';  // Importamos los íconos
import './PedidoPage.css';

const PedidosComercio = () => {
  const [pedidos, setPedidos] = useState([]);  // Estado para almacenar los pedidos del comercio
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);  // Estado para el pedido seleccionado

  const [cargando, setCargando] = useState(false);  // Estado para manejar la carga de datos
  const [filtroEstado, setFiltroEstado] = useState("");  // Filtro por estado de los pedidos
  const [pedidosFiltrados, setPedidosFiltrados] = useState([]);  // Estado para los pedidos filtrados

  // Llamada a la API para obtener los pedidos basados en el correo del comercio
  const obtenerPedidos = async (correoComercio) => {
    setCargando(true);
    try {
      const response = await fetch(
        `https://apisql-cwbndbaagqerg7dw.canadacentral-01.azurewebsites.net/api/pedidos/obtenerPorCorreoComercio?correoComercio=${correoComercio}`
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Datos recibidos de pedidos: ", data);

        // Combinamos los datos de los pedidos y productos
        if (Array.isArray(data.pedidos) && Array.isArray(data.productos)) {
          const pedidosConDetalles = data.pedidos.map(pedido => {
            // Obtener los productos asociados al pedido
            const productos = data.productos.filter(producto => producto.pedidoID === pedido.pedidoID);
            return {
              ...pedido,
              productos,
            };
          });

          // Asignar los pedidos combinados a nuestro estado
          setPedidos(pedidosConDetalles);
        } else {
          console.error("Los datos recibidos no son el formato esperado.");
          setPedidos([]);  // Asignamos un array vacío en caso de error
        }
      } else {
        const errorData = await response.json();
        console.error("Error al obtener los pedidos:", errorData.error);
        alert(errorData.error || "Error inesperado");
      }
    } catch (error) {
      console.error("Error al obtener los pedidos:", error);
      setPedidos([]);  // Asignamos un array vacío en caso de error
    } finally {
      setCargando(false);
    }
  };

  // Función para manejar la selección de un pedido
  const manejarSeleccionPedido = (pedido) => {
    if (pedidoSeleccionado && pedidoSeleccionado.pedidoID === pedido.pedidoID) {
      setPedidoSeleccionado(null);  // Cerrar detalles
    } else {
      setPedidoSeleccionado(pedido);  // Abrir detalles
    }
  };

 // Función para manejar el cambio de estado del pedido
const manejarCambioEstado = async (pedidoID, nuevoEstado) => {
    try {
      const response = await fetch("https://apisql-cwbndbaagqerg7dw.canadacentral-01.azurewebsites.net/api/pedidos/cambiarEstadoPedido", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          PedidoID: pedidoID,
          NuevoEstado: nuevoEstado,
        }),
      });
  
      if (response) {
        const result = await response.json();
        console.log(result);
  
        // Actualizar el estado local del pedido
        setPedidos((prevPedidos) =>
          prevPedidos.map((pedido) =>
            pedido.pedidoID === pedidoID ? { ...pedido, estado: nuevoEstado } : pedido
          )
        );
        alert("Estado del pedido actualizado correctamente.");
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Error al cambiar el estado del pedido");
      }
    } catch (error) {
      console.error("Error al cambiar el estado del pedido:", error);
      alert(error.message || "Error inesperado");
    }
  };
  

  // useEffect para obtener los pedidos cuando el componente se monta
  useEffect(() => {
    obtenerPedidos("correo_restaurante_satay@ejemplo.com"); // Correo del comercio
  }, []);

  // useEffect para aplicar los filtros a los pedidos
  useEffect(() => {
    // Filtrar los pedidos según el estado
    if (filtroEstado) {
      const pedidosFiltrados = pedidos.filter(
        (pedido) => pedido.estado.toLowerCase() === filtroEstado.toLowerCase()
      );
      setPedidosFiltrados(pedidosFiltrados);
    } else {
      setPedidosFiltrados(pedidos);  // Si no hay filtro, mostrar todos los pedidos
    }
  }, [filtroEstado, pedidos]);  // Este efecto depende de filtroEstado y pedidos

  return (
    <div className="pedidos-container">
      <h2>Pedidos Recibidos por el Comercio</h2>

      {/* Filtros */}
      <div className="filtros">
        <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
          <option value="">Filtrar por estado</option>
          <option value="pendiente">Pendiente</option>
          <option value="completado">Completado</option>
          <option value="rechazado">Rechazado</option>
        </select>
      </div>

      {cargando ? (
        <p>Cargando...</p>
      ) : (
        <div className="pedidos-list">
          {pedidosFiltrados.map((pedido) => (
            <div key={pedido.pedidoID} className="pedido-item">
              <div className="pedido-info">
                <h3>Pedido {pedido.pedidoID}</h3>
                <p className="pedido-details">
                  {pedido.productos.length} artículos de ₡{pedido.total.toLocaleString()} • {new Date(pedido.fechaCreacion).toLocaleDateString()}
                </p>
                <p className="estado">{pedido.estado.charAt(0).toUpperCase() + pedido.estado.slice(1)}</p>
                <div className="productos">
                  {pedidoSeleccionado && pedidoSeleccionado.pedidoID === pedido.pedidoID ? (
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
                    <button className="mostrar-mas-button" onClick={() => manejarSeleccionPedido(pedido)}>
                      {pedidoSeleccionado && pedidoSeleccionado.pedidoID === pedido.pedidoID ? 'Mostrar menos' : 'Mostrar más'}
                      {pedidoSeleccionado && pedidoSeleccionado.pedidoID === pedido.pedidoID ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="acciones">
                {pedido.estado === "Pendiente" && (
                  <button
                    className="poner-en-preparacion"
                    onClick={() => manejarCambioEstado(pedido.pedidoID, "en preparación")}
                  >
                    Poner en preparación
                  </button>
                )}

                {pedido.estado === "en preparación" && (
                  <button
                    className="marcar-como-preparado"
                    onClick={() => manejarCambioEstado(pedido.pedidoID, "preparado")}
                  >
                    Marcar como preparado
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PedidosComercio;
