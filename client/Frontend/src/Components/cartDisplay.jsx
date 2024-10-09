// src/Components/CartDisplay.jsx
import React from 'react';
import { useCart } from '../context/cartContext';

const CartDisplay = () => {
  const { cart } = useCart(); // Use cart context

  return (
    <div className="cart-display">
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cart.map((item) => (
          <div key={item.id}>
            <h3>{item.title}</h3>
            <p>Price: ₹{(item.price * 0.08).toFixed(2)}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default CartDisplay;
