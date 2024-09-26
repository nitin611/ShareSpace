import React from 'react';
import Structure from '../Components/structure/Structure';
import { FaUsers, FaHandHoldingUsd, FaRecycle } from 'react-icons/fa';

const About = () => {
  return (
    <Structure>
      <div className="min-h-screen bg-gradient-to-r from-green-300 via-blue-300 to-purple-300 text-gray-800 flex flex-col items-center py-12">
        {/* Heading */}
        <h1 className="text-5xl font-bold mb-6 text-center animate-fade-in">
          About <span className="text-blue-600">Sharespace</span>
        </h1>
        
        {/* Introduction Section */}
        <div className="max-w-4xl text-center mb-12">
          <p className="text-lg">
            Sharespace is a platform designed for VIT college students where they can buy and sell college items. 
            Our mission is to help students connect and share second-hand items, like books, electronics, and more. 
            Juniors can easily buy items from seniors, making college life more affordable and sustainable.
          </p>
        </div>

        {/* Founders Section */}
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Nitin Kumar Jha */}
          <div className="bg-white p-6 shadow-xl rounded-lg transform hover:scale-105 transition-transform duration-500">
            <img
              src="/assets/nitin.jpg"
              alt="Nitin Kumar Jha"
              className="w-40 h-40 rounded-full mx-auto mb-4"
            />
            <h2 className="text-2xl font-bold text-blue-600 text-center">Nitin Kumar Jha</h2>
            <p className="text-center text-gray-600">Co-Founder & Developer</p>
            <p className="mt-4 text-center">
              Nitin is passionate about web development and sustainability. He built this platform to help students
              connect and share valuable resources.
            </p>
          </div>

          {/* Md Faizan */}
          <div className="bg-white p-6 shadow-xl rounded-lg transform hover:scale-105 transition-transform duration-500">
            <img
              src="/assets/faizan.jpg"
              alt="Md Faizan"
              className="w-40 h-40 rounded-full mx-auto mb-4"
            />
            <h2 className="text-2xl font-bold text-blue-600 text-center">Md Faizan</h2>
            <p className="text-center text-gray-600">Co-Founder & Designer</p>
            <p className="mt-4 text-center">
              Faizan is a creative designer who ensures that the platform is user-friendly and aesthetically appealing for all students.
            </p>
          </div>

          {/* Faiz */}
          <div className="bg-white p-6 shadow-xl rounded-lg transform hover:scale-105 transition-transform duration-500">
            <img
              src="/assets/faiz.jpg"
              alt="Faiz"
              className="w-40 h-40 rounded-full mx-auto mb-4"
            />
            <h2 className="text-2xl font-bold text-blue-600 text-center">Faiz</h2>
            <p className="text-center text-gray-600">Co-Founder & Strategist</p>
            <p className="mt-4 text-center">
              Faiz focuses on strategy and making sure that Sharespace grows into a thriving community for students to exchange items effortlessly.
            </p>
          </div>
        </div>

        {/* Our Mission */}
        <div className="text-center max-w-4xl mb-16">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">Our Mission</h2>
          <p className="text-lg">
            At Sharespace, we aim to build a sustainable and community-driven platform where students can buy, sell, and exchange college items. 
            Whether it's books, electronics, or other resources, we believe in reusing items to reduce waste and make college life more affordable for everyone.
          </p>
        </div>

        {/* Platform Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex items-center space-x-4 bg-white p-6 shadow-xl rounded-lg transform hover:scale-105 transition-transform duration-500">
            <FaHandHoldingUsd className="text-blue-500 text-4xl" />
            <div>
              <h3 className="text-xl font-bold">Affordable Deals</h3>
              <p>Find great deals from fellow students, making college essentials more affordable for everyone.</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 bg-white p-6 shadow-xl rounded-lg transform hover:scale-105 transition-transform duration-500">
            <FaRecycle className="text-blue-500 text-4xl" />
            <div>
              <h3 className="text-xl font-bold">Sustainable</h3>
              <p>Reduce waste by reusing items, contributing to a more sustainable campus environment.</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 bg-white p-6 shadow-xl rounded-lg transform hover:scale-105 transition-transform duration-500">
            <FaUsers className="text-blue-500 text-4xl" />
            <div>
              <h3 className="text-xl font-bold">Community Driven</h3>
              <p>Built for students, by students. Sharespace is a community-driven platform connecting juniors and seniors.</p>
            </div>
          </div>
        </div>
      </div>
    </Structure>
  );
};

export default About;
