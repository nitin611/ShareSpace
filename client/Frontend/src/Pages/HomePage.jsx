import React from 'react';
import Structure from '../Components/structure/Structure';
import { useAuth } from '../context/auth';
import { useProductContext } from '../context/productcontext';
import HeroSection from "../Components/HeroSection";
import "../styles/HeroSection.css";





const HomePage = () => {
  const [auth, setAuth] = useAuth();
  const { products, loading } = useProductContext();

  return (
    <Structure>
      
      <div className="bg-gradient-to-r from-blue-500 to-blue-400 py-10 text-center">
        <h1 className="text-4xl font-bold text-white">Welcome to Our Store</h1>
        <p className="text-lg text-white mt-4">
          Discover the best products at unbeatable prices!
        </p>
      </div>

      {/* Home Page Content */}
      <div className="container mx-auto my-8 px-4">
        {loading ? (
          <div className="flex justify-center items-center">
            <p className="text-2xl font-semibold text-gray-600">Loading products...</p>
            {/* Loading spinner for better UI */}
            <div className="ml-4 loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-8 w-8"></div>
          </div>
        ) : (
          // Displaying products in the Hero Section
          <HeroSection myData={products} />
        )}
      </div>
    </Structure>
  );
};

export default HomePage;
