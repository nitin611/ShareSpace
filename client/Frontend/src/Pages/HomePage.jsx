import React from 'react';
import Structure from '../Components/structure/Structure';
import { useAuth } from '../context/auth';
import { useProductContext } from '../context/productcontext';
import "../styles/HeroSection.css";
import HeroSection from "../Components/HeroSection";

const HomePage = () => {
  const [auth, setAuth] = useAuth();
  const { products, loading } = useProductContext();

  return (
    <Structure>
      <h1 className='text-3xl bg-pink-600 text-center p-4'>Home Page</h1>
      {loading ? (
        <p className="text-center text-lg">Loading products...</p>
      ) : (
        <HeroSection myData={products} />
      )}
    </Structure>
  );
};

export default HomePage;
