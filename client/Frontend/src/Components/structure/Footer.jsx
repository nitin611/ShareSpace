import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (

    <footer className="bg-dark-background shadow-lg mt-10">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4 md:mb-0">
            <img src="/logo1.png" alt="CampusCart Logo" className="h-8 md:h-10 mr-3" />
            {/* <span className="text-2xl font-semibold text-gray-900 dark:text-white">CampusCart</span> */}
          </div>
          <ul className="flex flex-wrap items-center justify-center mb-4 md:mb-0 text-sm font-medium text-gray-500 dark:text-gray-400">
            <li className="mr-4">
              <Link
                to="/"
                className="hover:text-teal-500 dark:hover:text-teal-400 transition-colors relative group"
              >
                Home
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-teal-500 dark:bg-teal-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
            <li className="mr-4">
              <Link
                to="/about"
                className="hover:text-teal-500 dark:hover:text-teal-400 transition-colors relative group"
              >
                About Us
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-teal-500 dark:bg-teal-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
            <li className="mr-4">
              <Link
                to="/privacy"
                className="hover:text-teal-500 dark:hover:text-teal-400 transition-colors relative group"
              >
                Privacy Policy
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-teal-500 dark:bg-teal-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
            <li className="mr-4">
              {/* <Link
                to="/licensing"
                className="hover:text-teal-500 dark:hover:text-teal-400 transition-colors relative group"
              >
                Licensing
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-teal-500 dark:bg-teal-400 transition-all duration-300 group-hover:w-full"></span>
              </Link> */}
            </li>
            <li>
              <Link
                to="/contact"
                className="hover:text-teal-500 dark:hover:text-teal-400 transition-colors relative group"
              >
                Contact Us
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-teal-500 dark:bg-teal-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
          </ul>
        </div>
        <div className="mt-6 text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          © 2024 <Link to="/" className="hover:underline text-teal-500 dark:text-teal-400">CampusCart™</Link>. All Rights Reserved.
        </div>
      </div>
    </footer>


  );
};

export default Footer;