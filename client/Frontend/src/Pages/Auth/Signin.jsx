import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Structure from '../../Components/structure/Structure';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/auth';
import API_BASE_URL from '../../apiConfig';

const SignIn = () => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();
  const location = useLocation();
  const [auth, setAuth] = useAuth();

  // Handler for input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  // Submit handler for the sign-in form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await res.json();

      if (res.status >= 200 && res.status < 300) {
        // Show success toast on successful login
        toast.success("Login successful");
        localStorage.setItem('token', data.token); // Storing JWT token

        setTimeout(() => {
          setAuth({
            ...auth,
            user: data.user,
            token: data.token
          });
          localStorage.setItem('auth', JSON.stringify({
            user: data.user,
            token: data.token
          }));
          navigate(location.state || '/');
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
      <div className="flex justify-center items-center min-h-screen bg-gray-100 bg-cover bg-center" style={{ backgroundImage: 'url(/path/to/your/background-image.jpg)' }}>
        <div className="bg-gray-300 shadow-lg rounded-lg p-8 max-w-md w-full opacity-95">
          <div className="flex justify-center mb-6">
            <img src="/images/logo1.png" alt="Logo" className="w-50 h-32" />
          </div>
          <h2 className="text-3xl font-semibold text-center text-blue-600 mb-6">Welcome Back!</h2>
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
          <div className="mt-4 text-center">
            <a href="/forgot-password" className="text-blue-500 hover:text-blue-700 text-sm">Forgot Password?</a>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm">Don't have an account? <a href="/signup" className="text-blue-500 hover:text-blue-700">Sign up</a></p>
          </div>
        </div>
      </div>
    </Structure>
  );
};

export default SignIn;
