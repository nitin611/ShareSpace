import React from 'react';
import { useCart } from '../context/cartContext';

const CartPage = () => {
  const { cart } = useCart();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cart.map((product) => (
            <div key={product.id} className="border rounded-lg overflow-hidden shadow-lg">
              <img src={product.image} alt={product.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-xl font-semibold">{product.title}</h2>
                <p className="text-gray-700">{product.description}</p>
                <p className="text-lg font-bold">Price: ₹{(product.price * 80).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CartPage;
