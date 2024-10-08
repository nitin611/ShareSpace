import React from 'react';
import Structure from '../Components/structure/Structure';
import { useAuth } from '../context/auth';
import { useProductContext } from '../context/productcontext'; // Import product context
import "../styles/HeroSection.css"; // Ensure this path is correct
import HeroSection from "../Components/HeroSection";

const HomePage = () => {
  const [auth, setAuth] = useAuth();
  const { products, loading } = useProductContext(); // Use product context

  return (
    <Structure>
      <h1 className='text-3xl bg-pink-600 text-center'>Home Page</h1>
      {/* Check if loading or products exist */}
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <HeroSection myData={products} />
      )}
    </Structure>
  );
}

export default HomePage;
