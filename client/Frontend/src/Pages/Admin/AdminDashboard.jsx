import React from "react";
import { useAuth } from "../../context/auth";
import AdminMenu from "../../Components/structure/AdminMenu";
import { Outlet } from "react-router-dom";
import Structure from "../../Components/structure/Structure";

const AdminDashboard = () => {
  const [auth] = useAuth();

  return (
    <Structure>
       <div className="min-h-screen bg-gray-100 flex">
      
      <div className="w-1/3 bg-white shadow-md p-6">
        <AdminMenu />
      </div>

      {/* Main Content */}
      <div className="w-2/3 p-6">
        <div className="card bg-white shadow-lg p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">Admin Details</h3>
          <p><strong>Name:</strong> {auth?.user?.name}</p>
          <p><strong>Email:</strong> {auth?.user?.email}</p>
          <p><strong>Contact:</strong> {auth?.user?.phone}</p>
        </div>
      </div>
    </div>
    </Structure>
   
  );
};

export default AdminDashboard;
