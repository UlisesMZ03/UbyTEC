import React, { useState } from 'react';
import { useCart } from '../../CartContext'; // Importa el contexto del carrito
import restaurants from '../data/restaurants.json'; // Importa el archivo JSON de restaurantes
import { useNavigate } from 'react-router-dom'; // Usamos React Router para la navegación
import './CarritoPage.css'; // Importa el archivo de estilos

const CarritoPage = () => {
  const { cart, setCart } = useCart(); // Obtiene el carrito y la función setCart del contexto
  const [selectedRestaurant, setSelectedRestaurant] = useState(null); // Estado para el restaurante seleccionado
  const navigate = useNavigate(); // Para navegar a la página de checkout

  // Función para obtener el nombre del restaurante usando el restaurantId
  const getRestaurantName = (restaurantId) => {
    const restaurant = restaurants.find((r) => r.id === restaurantId);
    return restaurant ? restaurant.nombre : "Restaurante desconocido";
  };

  // Función para actualizar la cantidad de un producto
  const actualizarCantidad = (id, restaurantId, nuevaCantidad) => {
    setCart(
      cart.map((item) =>
        item.id === id && item.restaurantId === restaurantId
          ? { ...item, cantidad: nuevaCantidad }
          : item
      )
    );
  };

  const eliminarProducto = (id, restaurantId) => {
    setCart(cart.filter((item) => !(item.id === id && item.restaurantId === restaurantId)));
  };

  // Agrupar productos por restaurantId
  const pedidosPorRestaurante = cart.reduce((result, item) => {
    const { restaurantId } = item;
    const restaurantName = getRestaurantName(restaurantId); // Obtén el nombre del restaurante usando el ID

    if (!result[restaurantId]) {
      result[restaurantId] = { nombre: restaurantName, productos: [], subtotal: 0, cantidadTotal: 0 };
    }
    result[restaurantId].productos.push(item);
    result[restaurantId].subtotal += item.precio * item.cantidad;
    result[restaurantId].cantidadTotal += item.cantidad;
    return result;
  }, {});

  // Función para manejar la acción de proceder al pago
  const procederAlPago = (restaurantId) => {
    const productosSeleccionados = cart.filter(item => item.restaurantId === restaurantId);
    // Navegar a la página de checkout, pasando los productos como estado
    navigate('/checkout', { state: { productos: productosSeleccionados, restaurantId } });
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Carrito de Compras</h1>
      {cart.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <div>
          {Object.keys(pedidosPorRestaurante).map((restaurantId) => {
            const { nombre, productos, subtotal, cantidadTotal } = pedidosPorRestaurante[restaurantId];
            return (
              <div key={restaurantId} className="pedido-por-restaurante">
                <div 
                  className="resumen-restaurante"
                  onClick={() => setSelectedRestaurant(selectedRestaurant === restaurantId ? null : restaurantId)}
                >
                  <h2>{nombre}</h2>
                  <p>Subtotal: ₡ {subtotal.toLocaleString()}</p>
                  <p>Cantidad de productos: {cantidadTotal}</p>
                </div>
                {selectedRestaurant === restaurantId && (
                  <div className="productos">
                    {productos.map((producto) => (
                      <div key={producto.id} style={{ marginBottom: '20px' }}>
                        <h3>{producto.nombre}</h3>
                        <p>Precio: ₡ {producto.precio}</p>
                        <label>
                          Cantidad:
                          <input
                            type="number"
                            min="1"
                            value={producto.cantidad}
                            onChange={(e) =>
                              actualizarCantidad(producto.id, producto.restaurantId, parseInt(e.target.value, 10))
                            }
                          />
                        </label>
                        <button onClick={() => eliminarProducto(producto.id, producto.restaurantId)}>Eliminar</button>
                      </div>
                    ))}
                    <button 
                      style={{ marginTop: '20px' }} 
                      onClick={() => procederAlPago(restaurantId)}
                    >
                      Proceder al pago
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CarritoPage;
