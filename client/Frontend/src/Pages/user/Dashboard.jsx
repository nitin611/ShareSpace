import React from "react";
import { useAuth } from "../../context/auth";
import Structure from "../../Components/structure/Structure";
import UserMenu from "../../Components/structure/UserMenu";

const Dashboard = () => {
  const [auth] = useAuth();

  return (
    <Structure title={"User Dashboard"}>
      <div className="container mx-auto p-6">
        <div className="flex">
          {/* User Menu (30%) */}
          <div className="w-1/3 pr-4">
            <UserMenu />
          </div>

          {/* Dashboard Content (70%) */}
          <div className="w-2/3 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Welcome, {auth?.user?.name}</h2>
            <div className="mb-4">
              <h4 className="text-xl text-gray-600">Email:</h4>
              <p className="text-lg text-gray-800">{auth?.user?.email}</p>
            </div>
            <div className="mb-4">
              <h4 className="text-xl text-gray-600">Phone:</h4>
              <p className="text-lg text-gray-800">{auth?.user?.phone}</p>
            </div>
            <div className="mb-4">
              <h4 className="text-xl text-gray-600">CollegeId:</h4>
              <p className="text-lg text-gray-800">{auth?.user?.collegeId}</p>
            </div>
          </div>
        </div>
      </div>
    </Structure>
  );
};

export default Dashboard;
