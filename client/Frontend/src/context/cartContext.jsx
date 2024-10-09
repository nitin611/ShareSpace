import React, { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      return [...state, action.payload]; // Add product to cart
    default:
      return state; // Return current state if no action matches
  }
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, []); // Initialize cart state

  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product }); // Dispatch action to add product
  };

  return (
    <CartContext.Provider value={{ cart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext); // Hook for using cart context
