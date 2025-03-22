import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Structure from '../../Components/structure/Structure';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/auth';
import API_BASE_URL from '../../apiConfig';

const SignIn = () => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();
  const location = useLocation();
  const [auth, setAuth] = useAuth();

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  
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
        toast.success('Login successful');
        localStorage.setItem('token', data.token);

        setTimeout(() => {
          setAuth({
            ...auth,
            user: data.user,
            token: data.token,
          });
          localStorage.setItem(
            'auth',
            JSON.stringify({
              user: data.user,
              token: data.token,
            })
          );
          navigate(location.state || '/');
        }, 500);
      } else {
        toast.error(data.msg || 'Login failed');
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('An error occurred while logging in.');
    }
  };

  return (
    <Structure>
      <div className="min-h-screen flex flex-col md:flex-row">
        {/* LEFT SIDE: Video  */}
        <div className="relative w-full md:w-1/2 flex justify-center items-center mb-4 md:mb-0">
          <video autoPlay loop muted className="absolute inset-0 w-full h-full object-cover">
            <source src="/SigninF.mp4" type="video/mp4" />
          </video>
        </div>

        {/* RIGHT SIDE: */}
        <div className="w-full md:w-1/2 flex justify-center items-center p-6 md:p-10 bg-[#F2EFE7]">
          <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-6 border border-[#9ACBD0] hover:shadow-2xl hover:scale-105 transition-transform duration-300">
            <div className="mb-6 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-[#2973B2]">
                Welcome Back
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Please login to your account
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleChange}
                  className="w-full mt-2 px-4 py-3 border border-[#9ACBD0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2973B2] transition hover:border-[#2973B2]"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleChange}
                  className="w-full mt-2 px-4 py-3 border border-[#9ACBD0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2973B2] transition hover:border-[#2973B2]"
                  required
                />
              </div>
              <div className="text-right mb-6">
                <a
                  href="/forgot-password"
                  className="text-sm text-[#2973B2] hover:underline"
                >
                  Forgot Password?
                </a>
              </div>
              <button
                type="submit"
                className="w-full bg-[#48A6A7] text-white py-3 rounded-md hover:bg-[#2973B2] transition-all duration-300"
              >
                Login
              </button>
            </form>
            <p className="mt-6 text-center text-sm text-gray-600">
              Don’t have an account?{' '}
              <a href="/signup" className="text-[#2973B2] hover:underline">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </Structure>
  );
};

export default SignIn;
