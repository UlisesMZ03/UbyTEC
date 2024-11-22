import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from './AuthContext';  // Importamos el hook useAuth

// Crear el contexto para el carrito
const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user, loggedIn } = useAuth();  // Usamos useAuth para acceder a los datos del usuario

  // Cargar el carrito desde la base de datos cuando se monta el componente
  useEffect(() => {
    // Solo intentar obtener el carrito si el usuario está autenticado
    if (user && user.userId) {
      const fetchCartFromDatabase = async () => {
        try {
          const correoCliente = user.userId; // Aquí obtienes el correo del cliente desde AuthContext
          const response = await fetch(`https://apisql-cwbndbaagqerg7dw.canadacentral-01.azurewebsites.net/api/carrito/buscarCarrito?correoCliente=${correoCliente}`);
          
          if (response.ok) {
            const data = await response.json();
            setCart(data); // Actualizar el carrito con los datos de la base de datos
          } else {
            console.log('Error al obtener el carrito desde la base de datos');
          }
        } catch (error) {
          console.error('Error al conectar con el backend:', error);
        }
      };

      fetchCartFromDatabase();
    }
  }, [user]);  // Dependencia solo en `user`, ya que `user.userId` se verifica dentro del efecto

  // Sincronizar el carrito con la base de datos cada vez que se actualice
  useEffect(() => {
    if (cart.length > 0 && user && user.userId) {
      actualizarCarritoEnBaseDeDatos(cart);
    }
  }, [cart, user]);  // Asegurarse de que también se escuche el cambio en `user`

  // Función para agregar productos al carrito
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find(
        (item) => item.productoID === product.productoID && item.restaurantId === product.restaurantId
      );
      if (existingProduct) {
        return prevCart.map((item) =>
          item.productoID === product.productoID && item.restaurantId === product.restaurantId
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, cantidad: 1, restaurantId: product.restaurantId }];
      }
    });
  };

  // Función para actualizar la cantidad de un producto en el carrito
  const updateCartItemQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return; // Evitar cantidades negativas o cero

    setCart((prevCart) => {
      return prevCart.map((item) =>
        item.id === id ? { ...item, cantidad: newQuantity } : item
      );
    });
  };

  // Función para actualizar el carrito en la base de datos
  const actualizarCarritoEnBaseDeDatos = async (cart) => {
    if (!user || !user.userId) return;  // Si no hay usuario, no se actualiza el carrito

    const correoCliente = user.userId;  // Aquí obtienes el correo del cliente

    const productos = cart.map(item => ({
      productoID: item.productoID,  // Usa 'productoID' consistente
      Cantidad: item.cantidad
    }));

    try {
      const response = await fetch('https://apisql-cwbndbaagqerg7dw.canadacentral-01.azurewebsites.net/api/carrito/actualizar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correoCliente, productos }),
      });

      if (response.ok) {
        console.log('Carrito actualizado correctamente en la base de datos');
      } else {
        console.log('Error al actualizar el carrito');
      }
    } catch (error) {
      console.error('Error al conectar con el backend:', error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, setCart, addToCart, updateCartItemQuantity, actualizarCarritoEnBaseDeDatos }}>
      {children}
    </CartContext.Provider>
  );
}; // Este cierre debe estar aquí
