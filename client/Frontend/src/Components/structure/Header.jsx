import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/auth';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Header = () => {
  const [auth,setAuth]=useAuth();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate(); 

  const handleDropdownToggle = () => {
      setDropdownOpen((prev) => !prev);
  };
  // jab user signin karle to usko logout karne pe ye function run hoga-
  // local storage clear and using setauth user,token sab ko clear kardo state me se 
  // agar local storage se clear krenge to refresh karna parega direct setAuth se karo without reload-
  const Logout = () => {
   
    // Clear the auth state
    setAuth({
        user: null,
        token: ""
    });

    // Remove auth data from localStorage
    localStorage.removeItem('auth');
    localStorage.removeItem('token'); 
    toast.success("Logout successful")
    navigate('/');
};

  return (
    <nav className=" bg-dark-background sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link to="/">
              <img src="/images/logo1.png" alt="ShareSpace Logo" className="h-10 w-auto" />
             
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
            
            {/* agar user nahi hai to register and login page show karo 
            nahi to logout button show karo agar user hai to-*/}

                      {!auth.user ? (
                        <>
                            <Link
                                to="/signin"
                                className="px-4 py-2 text-sm font-medium bg-teal-500 border border-teal-500 rounded-lg transition duration-300 ease-in-out hover:bg-teal-500 hover:text-white"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/signup"
                                className="px-4 py-2 text-sm font-medium  bg-teal-500 border border-teal-500 rounded-lg shadow-md transition duration-300 ease-in-out hover:bg-teal-500 hover:text-white"
                            >
                                Sign Up
                            </Link>
                        </>
                    ) : (
                        <div className="relative">
                            <button
                                onClick={handleDropdownToggle}
                                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-teal-500 border border-teal-500 rounded-lg shadow-md transition duration-300 ease-in-out hover:bg-teal-600"
                            >
                                {auth.user.name} {/* Display username */}
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
                                    // role based dashboard movement-
                                        to={`/dashboard/${
                                          auth?.user?.role ===1 ? "admin" :"user"
                                          }`}
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
