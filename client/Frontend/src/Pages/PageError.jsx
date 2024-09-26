import React from 'react';
import Structure from '../Components/structure/Structure';

const PageError = () => {
  return (
    <Structure>
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-primary to-secondary text-center px-4">
        <h1 className="text-6xl font-bold text-accent mb-4 animate-pulse">404</h1>
        <h2 className="text-2xl font-semibold text-text mb-6">Oops! Page Not Found</h2>
        <p className="text-lg text-text mb-8">
          The page you're looking for doesn't exist. You may have mistyped the URL or the page has been moved.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-accent text-primary font-semibold text-lg rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105"
        >
          Go Back Home
        </a>
      </div>
    </Structure>
  );
};

export default PageError;
