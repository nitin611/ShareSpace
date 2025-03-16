import React, { useEffect } from "react";
import { useAuth } from "../../context/auth";
import { usePoints } from "../../context/points";
import Structure from "../../Components/structure/Structure";
import UserMenu from "../../Components/structure/UserMenu";
import { FaBitcoin, FaArrowUp, FaArrowDown, FaSync } from "react-icons/fa";

const Dashboard = () => {
  const [auth] = useAuth();
  const [points, setPoints, getUserPoints] = usePoints();

  const handleRefreshPoints = async () => {
    try {
      await getUserPoints();
    } catch (error) {
      console.error("Error refreshing points:", error);
    }
  };

  // Fetch points when component mounts
  useEffect(() => {
    getUserPoints();
  }, []);

  return (
    <Structure title={"User Dashboard"}>
      <div className="container mx-auto p-6">
        <div className="flex flex-col md:flex-row">
          {/* User Menu (30%) */}
          <div className="w-full md:w-1/3 md:pr-4 mb-4 md:mb-0">
            <UserMenu />
          </div>

          {/* Dashboard Content (70%) */}
          <div className="w-full md:w-2/3">
            {/* User Info Card */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Welcome, {auth?.user?.name}</h2>
                <div className="flex items-center">
                  <div className="flex items-center bg-gray-100 px-4 py-3 rounded-lg mr-2">
                    <FaBitcoin className="text-yellow-500 text-3xl mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">Total Points</p>
                      <p className="text-2xl font-semibold text-gray-800">{points?.totalPoints || 0}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleRefreshPoints}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-colors"
                    title="Refresh Points"
                  >
                    <FaSync className="text-xl" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            {/* Points History */}
            {points?.history?.length > 0 ? (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FaBitcoin className="text-yellow-500 mr-2" />
                  Points History
                </h3>
                <div className="space-y-4">
                  {points.history.map((item, index) => (
                    <div key={index} className="flex items-center justify-between border-b pb-3">
                      <div>
                        <p className="text-lg font-medium text-gray-800">{item.action}</p>
                        {item.productId && (
                          <p className="text-sm text-gray-600">
                            Product: {item.productId.name || 'Unknown'}
                          </p>
                        )}
                        <p className="text-sm text-gray-500">
                          {new Date(item.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className={`flex items-center ${item.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {item.points > 0 ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                        <span className="text-lg font-semibold">{Math.abs(item.points)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <p className="text-gray-600">No points history yet. Start earning points by creating products, writing reviews, or completing deliveries!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Structure>
  );
};

export default Dashboard;
