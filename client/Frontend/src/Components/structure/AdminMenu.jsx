import React from "react";
import { NavLink } from "react-router-dom";

const AdminMenu = () => {
  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md">
      <h4 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Admin Panel</h4>
      
      <div className="flex flex-col gap-4">
        <NavLink
          to="/dashboard/admin/create-category"
          className="block bg-white text-gray-700 px-4 py-2 rounded-lg shadow hover:bg-gray-200 transition duration-200"
        >
          Create Category
        </NavLink>
        
        <NavLink
          to="/dashboard/admin/users"
          className="block bg-white text-gray-700 px-4 py-2 rounded-lg shadow hover:bg-gray-200 transition duration-200"
        >
          Manage Users
        </NavLink>
      </div>
    </div>
  );
};

export default AdminMenu;
