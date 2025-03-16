import React from 'react';
import Structure from '../Components/structure/Structure';
import { FaUsers, FaHandHoldingUsd, FaRecycle, FaGraduationCap, FaHeart, FaLeaf } from 'react-icons/fa';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <Structure>
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-50 text-black relative overflow-hidden">
        {/* Animated background circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"
              style={{
                background: `radial-gradient(circle, ${['#60A5FA', '#818CF8', '#A78BFA', '#C084FC', '#F472B6'][i]} 0%, transparent 70%)`,
                width: `${Math.random() * 400 + 200}px`,
                height: `${Math.random() * 400 + 200}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>

        {/* Main Content */}
        <div className="container mx-auto py-8 px-4 sm:px-8 lg:px-16 relative">
          {/* Our Story Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20"
          >
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Our Story
              </h1>
              <p className="text-lg leading-relaxed text-gray-700">
                At CampusCart, we aim to build a sustainable and community-driven platform where students can buy, sell, and exchange college items. 
                Whether it's books, electronics, or other resources, we believe in reusing items to reduce waste and make college life more affordable for everyone.

              </p>
              <p className="text-lg leading-relaxed text-gray-700">
                Currently, we offer a wide variety of products, from books to gadgets, helping to foster a community-driven
                and sustainable ecosystem.
              </p>
            </div>
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
              <div className="relative">
                <img
                  src="/ban-2.jpg"
                  alt="About Us"
                  className="rounded-xl shadow-2xl transform group-hover:scale-105 transition duration-500"
                />
              </div>
            </div>
          </motion.div>

          {/* Metrics Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-20"
          >
            {[
              { value: '2.5k', label: 'Sellers online on our site', color: 'from-blue-500 to-blue-600' },
              { value: '13k', label: 'Monthly product sales', color: 'from-purple-500 to-purple-600' },
              { value: '4.5k', label: 'Customer online in our site', color: 'from-pink-500 to-pink-600' },
              { value: '25k', label: 'Annual gross sales on our site', color: 'from-indigo-500 to-indigo-600' }
            ].map((metric, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="relative group"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
                <div className="relative bg-white p-6 rounded-lg shadow-xl">
                  <h2 className={`text-3xl font-bold bg-gradient-to-r ${metric.color} bg-clip-text text-transparent`}>
                    {metric.value}
                  </h2>
                  <p className="text-gray-600 mt-2">{metric.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Team Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-20"
          >
            <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Meet Our Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Nitin Kumar Jhaa",
                  role: "Co-Founder & Developer",
                  image: "/nitin.jpeg",
                  description: "Nitin is passionate about web development and sustainability. He built this platform to help students connect and share valuable resources.",
                  icon: <FaGraduationCap className="text-blue-500" />
                },
                {
                  name: "Md Faizan",
                  role: "Co-Founder & Designer",
                  image: "/faizan.jpg",
                  description: "Faizan is a creative designer who ensures that the platform is user-friendly and aesthetically appealing for all students.",
                  icon: <FaHeart className="text-pink-500" />
                },
                {
                  name: "Faiz Ahmed",
                  role: "Co-Founder & Architect",
                  image: "/faiz.jpg",
                  description: "Faiz leads the technical vision and architecture of CampusCart, ensuring a seamless and scalable platform for students to exchange items effortlessly.",
                  icon: <FaLeaf className="text-green-500" />
                }
              ].map((member, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -10 }}
                  className="relative group"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
                  <div className="relative bg-white p-8 rounded-xl shadow-xl">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-50 group-hover:opacity-75 transition duration-500"></div>
                      <img
                        src={member.image}
                        alt={member.name}
                        className="relative w-32 h-32 rounded-full mx-auto object-cover border-4 border-white shadow-xl transform group-hover:scale-105 transition duration-500"
                      />
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        {member.icon}
                        <h3 className="text-xl font-bold ml-2">{member.name}</h3>
                      </div>
                      <p className="text-sm text-gray-500 mb-4">{member.role}</p>
                      <p className="text-gray-700 leading-relaxed">{member.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                title: "Free and Fast Delivery",
                description: "Enjoy fast delivery ",
                icon: <FaHandHoldingUsd />,
                color: "from-blue-500 to-blue-600"
              },
              {
                title: "24/7 Customer Service",
                description: "Friendly 24/7 support available for all queries.",
                icon: <FaUsers />,
                color: "from-purple-500 to-purple-600"
              },
              {
                title: "ReUse items",
                description: "Good Quality items",
                icon: <FaRecycle />,
                color: "from-green-500 to-green-600"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="relative group"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
                <div className="relative bg-white p-6 rounded-lg shadow-xl">
                  <div className={`text-4xl bg-gradient-to-r ${feature.color} bg-clip-text text-transparent mb-4`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </Structure>
  );
};

export default About;
