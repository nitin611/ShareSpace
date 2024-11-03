import React from "react";
import { NavLink } from "react-router-dom";
import Structure from "../../Components/structure/Structure";

const UserMenu = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h4 className="text-2xl font-bold text-center text-gray-700 mb-6">Dashboard</h4>
      <div className="list-group">
        <NavLink
          to="/dashboard/user/create-Product"
          className="block px-4 py-2 mb-3 text-gray-800 bg-gray-100 hover:bg-gray-200 transition rounded-lg"
        >
          Create Product
        </NavLink>
       
        <NavLink
          to="/dashboard/user/products"
          className="block px-4 py-2 mb-3 text-gray-800 bg-gray-100 hover:bg-gray-200 transition rounded-lg"
        >
          All Products
        </NavLink>
        <NavLink
          to="/dashboard/user/profile"
          className="block px-4 py-2 mb-3 text-gray-800 bg-gray-100 hover:bg-gray-200 transition rounded-lg"
        >
          Profile
        </NavLink>
        <NavLink
          to="/dashboard/user/order"
          className="block px-4 py-2 text-gray-800 bg-gray-100 hover:bg-gray-200 transition rounded-lg"
        >
          Orders
        </NavLink>
      </div>
    </div>
  );
};

export default UserMenu;
