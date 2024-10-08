import React from 'react';
import { NavLink } from 'react-router-dom';
import "../styles/HeroSection.css"; // Import the CSS file for Tailwind classes

const HeroSection = ({ myData }) => {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="hero-section-data">
            <p className="intro-data">Welcome to</p>
            <h1>Products</h1>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias
              atque temporibus veniam doloribus libero ad error omnis voluptates
              animi! Suscipit sapiente.
            </p>
            <NavLink to="/products">
              <button className="bg-blue-500 text-white px-4 py-2 rounded">Show Now</button>
            </NavLink>
          </div>
          {/* Products Section */}
          <div className="product-section grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myData.map((product) => (
              <div key={product.id} className="border rounded-lg overflow-hidden shadow-lg">
                <img src={product.image} alt={product.title} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h2 className="text-xl font-semibold">{product.title}</h2>
                  <p className="text-gray-700">{product.description}</p>
                  <p className="text-lg font-bold">Price: ${product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
