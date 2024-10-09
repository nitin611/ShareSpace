import React from 'react';
import { NavLink } from 'react-router-dom';
import { useCart } from '../context/cartContext'; // Fetch cart context for add to cart
import "../styles/HeroSection.css"; 
const HeroSection = ({ myData }) => {
    const { addToCart } = useCart(); // Access addToCart function
  
    return (
      <section className="hero-section bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {myData.map((product) => (
              <div
                key={product.id}
                className="border border-gray-200 bg-white rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:scale-105"
                style={{ height: '450px' }}
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full object-cover"
                  style={{ height: '200px' }}
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800">{product.title}</h2>
                  <p className="text-lg font-bold mt-2">Price: ₹{(product.price * 0.08).toFixed(2)}</p>
                  <button
                    className="bg-green-500 text-white w-full mt-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200"
                    onClick={() => {
                      console.log(product); // Log product info
                      addToCart(product); // Add product to cart
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };
  export default HeroSection;  