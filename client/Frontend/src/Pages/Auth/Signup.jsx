import React, { useState } from 'react';
import Structure from '../../Components/structure/Structure';
import toast from 'react-hot-toast';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const Signup = () => {
 
  const [formData, setFormData] = useState({
   
    name: "",
    email: "",
    password: "",
    phone: "",
    collegeId: "",
   


  });
  const navigate=useNavigate()


  const handleInputChange = (e) => {

    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  // Access values from formData
    const userData = {
      name: formData.name,       
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      collegeId: formData.collegeId, 
      
    };
  
    try {
      const res = await fetch('http://localhost:8080/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      const data = await res.json();
  
      if (res.status >= 200 && res.status < 300) {
        // Show success toast on successful signup
        toast.success("Signup successful");
        setTimeout(() => {
          navigate('/signin');
        }, 500);
      }
      else {
        // Handle errors
        console.error(data.errors);
        toast.error(data.msg || "Signup failed");
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("An error occurred while signing up.");
    }
  };
  

  return (
    <Structure>
      <div className="min-h-screen flex">
        {/* Left Side with Animation */}
        <div className="w-1/2 bg-gradient-to-r from-blue-400 to-indigo-500 relative flex justify-center items-center">
          {/* Animated SVG or Animation */}
          <div className="absolute inset-0 flex justify-center items-center">
            <div className="relative">
              {/* Background SVG animation */}
              <div className="absolute top-0 left-0 w-64 h-64 bg-purple-300 opacity-75 rounded-full mix-blend-multiply animate-pulse"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-300 opacity-75 rounded-full mix-blend-multiply animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-300 opacity-75 rounded-full mix-blend-multiply animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-pink-300 opacity-75 rounded-full mix-blend-multiply animate-pulse"></div>
              <div className="relative z-10">
                <h1 className="text-white text-4xl font-bold text-center">Welcome to Sharespace</h1>
                <p className="text-white text-lg mt-4 text-center">
                  A platform for buying and selling within your college community.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side with Signup Form */}
        <div className="w-1/2 flex justify-center items-center bg-white p-8">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-semibold text-center text-gray-800">Sign Up</h2>
            <form onSubmit={handleSubmit} className="space-y-6 mt-8">
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full p-4 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full p-4 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full p-4 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div className="relative">
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full p-4 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div className="relative group">
            <input
              type="text"
              name="collegeId"
              placeholder="College ID"
              value={formData.collegeId}
              onChange={handleInputChange}
              className="w-full p-4 text-gray-700 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-300 transition-all duration-300 outline-none"
            />
            <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 scale-x-0 group-hover:scale-x-100 transition-all duration-300 origin-left"></span>
          </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75"
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </div>
    </Structure>
  );
};

export default Signup;
