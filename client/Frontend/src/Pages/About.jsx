import React from 'react';
import Structure from '../Components/structure/Structure';
import { FaUsers, FaHandHoldingUsd, FaRecycle } from 'react-icons/fa';

const About = () => {
  return (
    <Structure>
      <div className="min-h-screen bg-white text-black">
        {/* Breadcrumb */}
        <div className="py-4 px-8">
          {/* <p className="text-sm text-gray-500">Home / About</p> */}
        </div>

        {/* Main Section */}
        <div className="container mx-auto px-8 lg:px-16">
          {/* Our Story Section */}
          <div className="grid lg:grid-cols-2 gap-8 items-center mb-16">
            <div>
              <h1 className="text-4xl font-bold mb-4">Our Story</h1>
              <p className="text-lg leading-relaxed text-gray-600">
              At Sharespace, we aim to build a sustainable and community-driven platform where students can buy, sell, and exchange college items. 
        Whether it's books, electronics, or other resources, we believe in reusing items to reduce waste and make college life more affordable for everyone.

              </p>
              <p className="text-lg leading-relaxed text-gray-600 mt-4">
                Currently, we offer a wide variety of products, from books to gadgets, helping to foster a community-driven
                and sustainable ecosystem.
              </p>
            </div>
            <div className="flex justify-center">
              <img
                src="/images/ban-2.jpg" 
                alt="About Us"
                className="rounded-lg shadow-lg w-full lg:w-4/4"
              />
            </div>
          </div>

          {/* Metrics Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16 text-center">
            <div className="bg-gray-100 py-6 rounded-lg">
              <h2 className="text-2xl font-bold text-black">10.5k</h2>
              <p className="text-gray-600">Sellers online on our site</p>
            </div>
            <div className="bg-red-100 py-6 rounded-lg">
              <h2 className="text-2xl font-bold text-red-600">33k</h2>
              <p className="text-gray-600">Monthly product sales</p>
            </div>
            <div className="bg-gray-100 py-6 rounded-lg">
              <h2 className="text-2xl font-bold text-black">45.5k</h2>
              <p className="text-gray-600">Customer online in our site</p>
            </div>
            <div className="bg-gray-100 py-6 rounded-lg">
              <h2 className="text-2xl font-bold text-black">25k</h2>
              <p className="text-gray-600">Annual gross sales on our site</p>
            </div>
          </div>

          {/* Team Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              { name: "Nitin Kumar Jhaa", 
                role: "Co-Founder & Developer", 
                image: "/images/nitin.jpeg" 
              },
              { name: "Md Faizan", 
                role: "Co-Founder & Designer", 
                
                image: "/images/faizan.jpg" 
              },
              { name: "Faiz",
                 role: "Co-Founder & Strategist", 
                 image: "/images/faiz.jpg" 
                },

            ].map((member, index) => (
              <div
                key={index}
                className="bg-white p-6 shadow-lg rounded-lg flex flex-col items-center"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mb-4 object-cover"
                />
                <h3 className="text-lg font-bold">{member.name}</h3>
                <p className="text-sm text-gray-500">{member.role}</p>
              </div>
            ))}
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              {
                title: "Free and Fast Delivery",
                description: "Enjoy fast delivery on every order above $20.",
                icon: <FaHandHoldingUsd />,
              },
              {
                title: "24/7 Customer Service",
                description: "Friendly 24/7 support available for all queries.",
                icon: <FaUsers />,
              },
              {
                title: "Money Back Guarantee",
                description: "We offer a 30-day money-back guarantee.",
                icon: <FaRecycle />,
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 shadow-lg rounded-lg flex items-center space-x-4"
              >
                <div className="text-red-500 text-3xl">{feature.icon}</div>
                <div>
                  <h3 className="text-lg font-bold">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Structure>
  );
};

export default About;
