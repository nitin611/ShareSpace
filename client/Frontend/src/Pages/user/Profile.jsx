import React from 'react';
import { useAuth } from '../../context/auth'; // Assuming you have an auth context
import { FaUserCircle, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaIdCard } from 'react-icons/fa';
import Structure from '../../Components/structure/Structure';
import UserMenu from '../../Components/structure/UserMenu';

const Profile = () => {
  const [auth] = useAuth(); // Fetch user data from context

  // Sample user data (replace this with real data from your auth context)
  const user = {
    name: auth?.user?.name || "John Doe",
    email: auth?.user?.email || "john.doe@example.com",
    phone: auth?.user?.phone || "123-456-7890",
    collegeId: auth?.user?.collegeId || "123-456-7890",
    profilePicture: auth?.user?.profilePicture || "https://via.placeholder.com/150", // Placeholder for user profile picture
  };

  return (
    <Structure title={"User Profile - Ecommerce App"}>
      <div className="container mx-auto p-6">
        <div className="flex">
          {/* User Menu (30%) */}
          <div className="w-1/3 pr-4">
            <UserMenu />
          </div>

          {/* Profile Details (70%) */}
          <div className="w-2/3">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">User Profile</h2>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-6">
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-2 border-blue-500 mr-4 shadow-lg"
                />
                <div>
                  <h3 className="text-2xl font-semibold text-gray-800">{user.name}</h3>
                  <p className="text-gray-600 flex items-center">
                    <FaEnvelope className="mr-2 text-blue-500" />
                    {user.email}
                  </p>
                  <p className="text-gray-600 flex items-center">
                    <FaPhoneAlt className="mr-2 text-blue-500" />
                    {user.phone}
                  </p>
                  <p className="text-gray-600 flex items-center">
                    <FaIdCard className="mr-2 text-blue-500" />
                    {user.collegeId}
                  </p>
                </div>
              </div>

        
              {/* Optional: Edit Profile Button */}
              <button className="mt-6 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200">
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </Structure>
  );
};

export default Profile;
