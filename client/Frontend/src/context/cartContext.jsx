import React, { createContext, useContext, useState } from 'react';

// Creating the Cart Context
const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Function to add products to the cart
  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to access the Cart Context
const useCart = () => {
  return useContext(CartContext);
};

export { CartProvider, useCart };
