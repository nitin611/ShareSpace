import React, { useState } from "react";
import { useAuth } from "../../context/auth"; // Assuming you have an auth context
import { FaEnvelope, FaPhoneAlt, FaIdCard } from "react-icons/fa";
import Structure from "../../Components/structure/Structure";
import UserMenu from "../../Components/structure/UserMenu";
import axios from "axios";
import toast from "react-hot-toast"; // Assuming you're using react-hot-toast

const Profile = () => {
  const [auth, setAuth] = useAuth(); // Fetch user data from context
  const [isEditing, setIsEditing] = useState(false); // Toggle edit mode

  // Form state
  const [name, setName] = useState(auth?.user?.name || "");
  const [email] = useState(auth?.user?.email || ""); // Read-only
  const [phone, setPhone] = useState(auth?.user?.phone || "");
  const [collegeId, setCollegeId] = useState(auth?.user?.collegeId || "");
  const [password, setPassword] = useState(""); // Password is optional

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic password validation
    if (password && password.length < 5) {
      toast.error("Password must be at least 5 characters long!");
      return;
    }

    try {
      const { data } = await axios.put(
        "http://localhost:8080/api/auth/Editprofile",
        { name, phone, password, collegeId },
        {
          headers: {
            Authorization: `${auth?.token}`, // Pass token for authorization
          },
        }
      );

      if (data.success) {
        toast.success("Profile updated successfully!");
        setAuth({
          ...auth,
          user: data.updatedUser,
        });
        localStorage.setItem("auth", JSON.stringify({ ...auth, user: data.updatedUser })); // Update localStorage
        setIsEditing(false); // Exit edit mode
      } else {
        toast.error(data.msg || "Error updating profile");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  };

  

  return (
    <Structure title={"User Profile - ShareSpace"}>
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
              {isEditing ? (
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="Enter your name"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Email</label>
                    <input
                      type="email"
                      value={email}
                      readOnly
                      className="w-full px-4 py-2 border rounded-lg bg-gray-200 cursor-not-allowed"
                      placeholder="Your email address"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Phone</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">College ID</label>
                    <input
                      type="text"
                      value={collegeId}
                      onChange={(e) => setCollegeId(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="Enter your College ID"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="Enter a new password (optional)"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="ml-4 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-200"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <div>
                  <div className="flex items-center mb-6">
                  <div
  className={`w-24 h-24 rounded-full border-2 border-blue-500 mr-4 shadow-lg flex items-center justify-center`}
  style={{
    backgroundColor: auth?.user?.profilePicture ? "transparent" :"#4C6EF5", // Fixed stylish blue background
    boxShadow: "0 8px 16px rgba(76, 110, 245, 0.5)",
  }}
>
  {auth?.user?.profilePicture ? (
    <img
      src={auth?.user?.profilePicture}
      alt="Profile"
      className="w-full h-full rounded-full object-cover"
    />
  ) : (
    <span
    className="text-white text-3xl font-bold tracking-widest uppercase"
    style={{
      letterSpacing: "0.2em", // Add spacing between letters
      textShadow: "2px 2px 5px rgba(0, 0, 0, 0.4)", // Add shadow for a stylish effect
    }}
  >
    {auth?.user?.email?.substring(0, 2) || ""}
  </span>
  
  )}
</div>

                    <div>
                      <h3 className="text-2xl font-semibold text-gray-800">{auth?.user?.name}</h3>
                      <p className="text-gray-600 flex items-center">
                        <FaEnvelope className="mr-2 text-blue-500" />
                        {auth?.user?.email}
                      </p>
                      <p className="text-gray-600 flex items-center">
                        <FaPhoneAlt className="mr-2 text-blue-500" />
                        {auth?.user?.phone}
                      </p>
                      <p className="text-gray-600 flex items-center">
                        <FaIdCard className="mr-2 text-blue-500" />
                        {auth?.user?.collegeId}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-6 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
                  >
                    Edit Profile
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Structure>
  );
};

export default Profile;
