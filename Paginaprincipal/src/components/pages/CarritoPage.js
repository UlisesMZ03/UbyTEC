import React, { useState } from 'react';
import { useCart } from '../../CartContext'; // Importa el contexto del carrito
import { useNavigate } from 'react-router-dom'; // Usamos React Router para la navegación
import './CarritoPage.css'; // Importa el archivo de estilos
import { useAuth } from '../../AuthContext';  // Importamos el hook useAuth
const CarritoPage = () => {
  const { cart, setCart } = useCart(); // Obtiene el carrito y la función setCart del contexto
  const [selectedRestaurant, setSelectedRestaurant] = useState(null); // Estado para el restaurante seleccionado
  const navigate = useNavigate(); // Para navegar a la página de checkout
  const { user, loggedIn } = useAuth();  // Usamos useAuth para acceder a los datos del usuario
  
  // Función para actualizar la cantidad de un producto
  const actualizarCantidad = (productoID, nuevaCantidad) => {
    setCart(
      cart.map((item) =>
        item.productoID === productoID // Usa 'productoID' en lugar de 'id'
          ? { ...item, cantidad: nuevaCantidad }
          : item
      )
    );
  };

  // Función para eliminar un producto
  const eliminarProducto = async (productoID) => {
    // Eliminar producto del carrito en la base de datos
    try {
      const response = await fetch('http://localhost:5133/api/carrito/eliminar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          CorreoCliente: user.userId,  // Sustituir con el correo del cliente autenticado
          ProductIDs: [productoID],  // El ID del producto a eliminar
        }),
      });

      if (response.ok) {
        // Si la eliminación fue exitosa, actualizar el carrito localmente
        setCart(cart.filter(item => item.productoID !== productoID));
      } else {
        console.error('Hubo un problema al eliminar el producto del carrito.');
      }
    } catch (error) {
      console.error('Error al eliminar el producto del carrito:', error);
    }
  };

  // Agrupar productos por restaurante usando nombreComercio
  const pedidosPorRestaurante = cart.reduce((result, item) => {
    const restaurantName = item.nombreComercio; // Usamos 'nombreComercio' en lugar de 'restaurantId'

    if (!result[restaurantName]) {
      result[restaurantName] = { nombre: restaurantName, productos: [], subtotal: 0, cantidadTotal: 0 };
    }
    result[restaurantName].productos.push(item);
    result[restaurantName].subtotal += item.precio * item.cantidad;
    result[restaurantName].cantidadTotal += item.cantidad;
    return result;
  }, {});

  // Función para manejar la acción de proceder al pago
  const procederAlPago = (restaurantName) => {
    const productosSeleccionados = cart.filter(item => item.nombreComercio === restaurantName);
    // Navegar a la página de checkout, pasando los productos como estado
    navigate('/checkout', { state: { productos: productosSeleccionados, restaurantName } });
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Carrito de Compras</h1>
      {cart.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <div>
          {Object.keys(pedidosPorRestaurante).map((restaurantName) => {
            const { nombre, productos, subtotal, cantidadTotal } = pedidosPorRestaurante[restaurantName];

            return (
              <div key={restaurantName} className="pedido-por-restaurante">
                <div 
                  className="resumen-restaurante"
                  onClick={() => setSelectedRestaurant(selectedRestaurant === restaurantName ? null : restaurantName)}
                >
                  <h2>{nombre}</h2>
                  <p>Subtotal: ₡ {subtotal.toLocaleString()}</p>
                  <p>Cantidad de productos: {cantidadTotal}</p>
                </div>
                {selectedRestaurant === restaurantName && (
                  <div className="productos">
                    {productos.map((producto) => {
                      return (
                        <div key={`${producto.productoID}-${producto.nombreComercio}`} style={{ marginBottom: '20px' }}>
                          <h3>{producto.nombreProducto}</h3>
                          <p>Precio: ₡ {producto.precio}</p>
                          <label>
                            Cantidad:
                            <input
                              type="number"
                              min="1"
                              value={producto.cantidad}
                              onChange={(e) =>
                                actualizarCantidad(producto.productoID, parseInt(e.target.value, 10)) // Usa 'productoID'
                              }
                            />
                          </label>
                          <button onClick={() => eliminarProducto(producto.productoID)}>Eliminar</button> {/* Usa 'productoID' */}
                        </div>
                      );
                    })}
                    <button 
                      style={{ marginTop: '20px' }} 
                      onClick={() => procederAlPago(restaurantName)}
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
