import { createContext, useContext, useState } from "react";

// Create the CartContext
const CartContext = createContext();

// CartProvider component to wrap around the app
const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Function to add product to the cart
  const addToCart = (product) => {
    setCart((prevCart) => {
      // Check if the product is already in the cart
      const isProductInCart = prevCart.find((item) => item.id === product.id);
      if (isProductInCart) {
        // If the product is already in the cart, return the cart as is
        return prevCart;
      }
      // Add the product to the cart
      return [...prevCart, product];
    });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use CartContext
const useCart = () => {
  return useContext(CartContext);
};

export { CartProvider, useCart };
