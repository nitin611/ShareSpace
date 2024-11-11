import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/auth';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchInput from '../Search';

const Header = () => {
  const [auth, setAuth] = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleDropdownToggle = () => {
    setDropdownOpen((prev) => !prev);
  };

  const Logout = () => {
    setAuth({
      user: null,
      token: "",
    });
    localStorage.removeItem('auth');
    localStorage.removeItem('token');
    toast.success("Logout successful");
    navigate('/');
  };

  return (
    <nav className="bg-dark-background sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link to="/">
              <img src="/images/logo1.png" alt="ShareSpace Logo" className="h-10 w-auto" />
            </Link>
          </div>

          {/* Navigation and Search Section */}
          <div className="flex flex-1 items-center justify-center space-x-8">
            <Link to="/" className="text-gray-900 dark:text-white font-medium text-lg hover:text-teal-500 dark:hover:text-teal-400 transition-colors">
              Home
            </Link>
            <Link to="/about" className="text-gray-900 dark:text-white font-medium text-lg hover:text-teal-500 dark:hover:text-teal-400 transition-colors">
              About Us
            </Link>
            <Link to="/contact" className="text-gray-900 dark:text-white font-medium text-lg hover:text-teal-500 dark:hover:text-teal-400 transition-colors">
              Contact Us
            </Link>

            {/* Search Input Box */}
            <div className="ml-9 w-1/3">
              <SearchInput className="bg-gray-800 text-white rounded-md px-5 py-2" />
            </div>
          </div>

          {/* Sign-in / Sign-up Buttons */}
          <div className="space-x-4 flex items-center">
            {!auth.user ? (
              <>
                <Link
                  to="/signin"
                  className="px-4 py-2 text-sm font-medium bg-teal-500 border border-teal-500 rounded-lg transition duration-300 ease-in-out hover:bg-teal-600 text-white"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-medium bg-teal-500 border border-teal-500 rounded-lg transition duration-300 ease-in-out hover:bg-teal-600 text-white"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={handleDropdownToggle}
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-teal-500 border border-teal-500 rounded-lg transition duration-300 ease-in-out hover:bg-teal-600"
                >
                  {auth.user.name}
                  <svg
                    className={`w-4 h-4 ml-2 transition-transform ${dropdownOpen ? "transform rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                    <Link
                      to={`/dashboard/${auth?.user?.role === 1 ? "admin" : "user"}`}
                      className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-200"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={Logout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-200"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
