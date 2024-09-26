import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation after successful login
import Structure from '../../Components/structure/Structure';
import toast from 'react-hot-toast';

const SignIn = () => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  // Handler for input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  // Submit handler for the sign-in form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await res.json();

      if (res.status >= 200 && res.status < 300) {
        console.log("sign in done")
        // Show success toast on successful login
        toast.success("Login successful", {
          autoClose: 2000, 
        });
        localStorage.setItem('token', data.token); // Storing JWT token

       
        setTimeout(() => {
          navigate('/');
        }, 500);
      } else {
        // Handle errors
        toast.error(data.msg || "Login failed");
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("An error occurred while logging in.");
    }
  };

  return (
    <Structure>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={loginData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-all duration-300"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
    </Structure>
    
  );
};

export default SignIn;
