import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Structure from '../../Components/structure/Structure';
import AdminMenu from '../../Components/structure/AdminMenu';
import axios from 'axios';
import API_BASE_URL from '../../apiConfig';


const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/category/allUsers`);
      
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  
  const handleSearch = async () => {
    try {
      
      if (!searchQuery.trim()) {
        fetchUsers();
        return;
      }
      const response = await axios.get(`${API_BASE_URL}/api/category/searchUsers?query=${searchQuery}`);
      
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };
  
  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/api/category/deleteUsers/${selectedUserId}`);
      setUsers(users.filter(user => user._id !== selectedUserId));
      setShowModal(false);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <Structure>
      <div className="flex">
        <div className="w-1/3 bg-gray-100 p-4">
          <AdminMenu />
        </div>
        <div className="w-2/3 p-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Manage Users</h2>
              <div className="flex">
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-l focus:outline-none "
                />
                <button
                  onClick={handleSearch}
                  className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 transition"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 border-b text-left">Name</th>
                    <th className="py-2 px-4 border-b text-left">Email</th>
                    <th className="py-2 px-4 border-b text-left">View Details</th>
                    <th className="py-2 px-4 border-b text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition">
                      <td className="py-2 px-4 border-b">{user.name}</td>
                      <td className="py-2 px-4 border-b">{user.email}</td>
                      <td className="py-2 px-4 border-b">
                        <button
                          className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition"
                          onClick={() => navigate(`/dashboard/admin/viewUserDetails/${user._id}`)}
                        >
                          View
                        </button>
                      </td>
                      <td className="py-2 px-4 border-b">
                        <button
                          className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition"
                          onClick={() => { setSelectedUserId(user._id); setShowModal(true); }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation wala Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-lg font-bold">Are you sure you want to delete this user?</p>
            <div className="mt-4 flex justify-center gap-4">
              <button className="bg-red-500 text-white py-2 px-4 rounded" onClick={handleDelete}>
                Yes
              </button>
              <button className="bg-gray-300 py-2 px-4 rounded" onClick={() => setShowModal(false)}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </Structure>
  );
};

export default Users;
