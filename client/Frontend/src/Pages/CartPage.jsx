import React from 'react';
import { useCart } from '../context/cartContext'; // Fetch cart context
import Structure from '../Components/structure/Structure';

const CartPage = () => {
  const { cart } = useCart(); // Access the cart

  return (
    <Structure>
      <h1 className='text-3xl text-center p-4'>Your Cart</h1>
      {cart.length === 0 ? (
        <p className='text-center text-lg'>Your cart is empty</p>
      ) : (
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cart.map((product, index) => (
              <div key={index} className="border rounded-lg shadow-lg overflow-hidden">
                <img src={product.image} alt={product.title} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h2 className="text-xl font-semibold">{product.title}</h2>
                  <p className="text-gray-700">{product.description}</p>
                  <p className="text-lg font-bold">Price: ₹{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Structure>
  );
};

export default CartPage;
