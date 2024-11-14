import React, { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    // Intenta cargar el carrito desde el localStorage al inicio
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  useEffect(() => {
    // Guarda el carrito en el localStorage cada vez que se actualiza
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find(
        (item) => item.id === product.id && item.restaurantId === product.restaurantId
      );
      if (existingProduct) {
        // Si el producto ya está en el carrito y es del mismo restaurante, incrementa la cantidad
        return prevCart.map((item) =>
          item.id === product.id && item.restaurantId === product.restaurantId
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      } else {
        // Si no está en el carrito, lo agrega con cantidad 1 y el ID del restaurante
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

  return (
    <CartContext.Provider value={{ cart, setCart, addToCart, updateCartItemQuantity }}>
      {children}
    </CartContext.Provider>
  );
};
