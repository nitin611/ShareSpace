import React from "react";
import { useAuth } from "../../context/auth";
import Structure from "../../Components/structure/Structure";
import UserMenu from "../../Components/structure/UserMenu";

// import { FaBitcoin } from "react-icons/fa"; 

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
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-800">Welcome, {auth?.user?.name}</h2>
              <div className="flex items-center">
                <h3 className="text-2xl font-semibold text-gray-800 mr-5">User Points</h3>
                
                {/* <FaBitcoin className="text-yellow-500 text-3xl mr-2" /> */}
                <span className="text-2xl font-semibold text-gray-800 ">80</span>
              </div>
            </div>
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
