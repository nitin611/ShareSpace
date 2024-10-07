import React from 'react';
import Header from './Header';
import Footer from './Footer';
import 'react-toastify/dist/ReactToastify.css';
import  { Toaster } from 'react-hot-toast';

const Structure = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Header />

      {/* Main content */}
      <main className="flex-grow" style={{minHeight:"70vh"}}>
      <Toaster />
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Structure;
