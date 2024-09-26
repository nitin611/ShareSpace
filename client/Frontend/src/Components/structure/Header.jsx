import React from 'react';
import { Link } from 'react-router-dom';


const Header = () => {
  return (
    <nav className="bg-white shadow-lg dark:bg-gray-900 sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link to="/">
              <img src="/images/logo.png" alt="ShareSpace Logo" className="h-10 w-auto" />
             
            </Link>
          </div>

          {/* Links Section */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link
              to="/"
              className="text-gray-900 dark:text-white font-medium text-lg hover:text-teal-500 dark:hover:text-teal-400 transition-colors relative group"
            >
              Home
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-teal-500 dark:bg-teal-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>

            <Link
              to="/about"
              className="text-gray-900 dark:text-white font-medium text-lg hover:text-teal-500 dark:hover:text-teal-400 transition-colors relative group"
            >
              About Us
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-teal-500 dark:bg-teal-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>

            <Link
              to="/contact"
              className="text-gray-900 dark:text-white font-medium text-lg hover:text-teal-500 dark:hover:text-teal-400 transition-colors relative group"
            >
              Contact Us
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-teal-500 dark:bg-teal-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>

            {/* Sign-in / Sign-up Buttons */}
            <div className="space-x-4">
              <Link
                to="/signin"
                className="px-4 py-2 text-sm font-medium text-teal-500 border border-teal-500 rounded-lg transition duration-300 ease-in-out hover:bg-teal-500 hover:text-white dark:hover:bg-teal-400 dark:hover:border-teal-400"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-sm font-medium text-white bg-teal-500 border border-teal-500 rounded-lg shadow-md transition duration-300 ease-in-out hover:bg-teal-600 dark:bg-teal-400 dark:hover:bg-teal-500"
              >
                Sign Up
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          {/* <div className="md:hidden flex items-center">
            <button
              type="button"
              className="text-gray-900 dark:text-white hover:text-teal-500 dark:hover:text-teal-400 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div> */}
        </div>
      </div>

      {/* Mobile Menu */}
      {/* <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            to="/"
            className="block text-gray-900 hover:bg-teal-500 hover:text-white dark:text-white dark:hover:bg-teal-400 transition-colors rounded-md px-3 py-2"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="block text-gray-900 hover:bg-teal-500 hover:text-white dark:text-white dark:hover:bg-teal-400 transition-colors rounded-md px-3 py-2"
          >
            About Us
          </Link>
          <Link
            to="/contact"
            className="block text-gray-900 hover:bg-teal-500 hover:text-white dark:text-white dark:hover:bg-teal-400 transition-colors rounded-md px-3 py-2"
          >
            Contact Us
          </Link>
          <div className="space-y-3 px-3">
            <Link
              to="/signin"
              className="block w-full text-teal-500 border border-teal-500 rounded-md py-2 hover:bg-teal-500 hover:text-white dark:hover:bg-teal-400 dark:hover:border-teal-400"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="block w-full text-white bg-teal-500 border border-teal-500 rounded-md py-2 hover:bg-teal-600 dark:bg-teal-400 dark:hover:bg-teal-500"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div> */}
    </nav>
  );
};

export default Header;
