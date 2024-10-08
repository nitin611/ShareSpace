import React from 'react';
import Structure from '../../Components/structure/Structure';
import AdminMenu from '../../Components/structure/AdminMenu';

const Users = () => {
  return (
    <Structure>
      <div className="flex">
        {/* Sidebar (30%) */}
        <div className="w-1/3 bg-gray-100 p-4">
          <AdminMenu />
        </div>

        {/* Main Content (70%) */}
        <div className="w-2/3 p-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Manage Users</h2>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 border-b">User ID</th>
                    <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 border-b">Name</th>
                    <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 border-b">Email</th>
                    <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 border-b">Role</th>
                    <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* User 1 */}
                  <tr className="hover:bg-gray-50 transition">
                    <td className="py-2 px-4 border-b">1</td>
                    <td className="py-2 px-4 border-b">John Doe</td>
                    <td className="py-2 px-4 border-b">john@example.com</td>
                    <td className="py-2 px-4 border-b">Admin</td>
                    <td className="py-2 px-4 border-b">
                      <button className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition">
                        Delete
                      </button>
                    </td>
                  </tr>

                  {/* User 2 */}
                  <tr className="hover:bg-gray-50 transition">
                    <td className="py-2 px-4 border-b">2</td>
                    <td className="py-2 px-4 border-b">Jane Smith</td>
                    <td className="py-2 px-4 border-b">jane@example.com</td>
                    <td className="py-2 px-4 border-b">User</td>
                    <td className="py-2 px-4 border-b">
                      <button className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition">
                        Delete
                      </button>
                    </td>
                  </tr>

                  {/* User 3 */}
                  <tr className="hover:bg-gray-50 transition">
                    <td className="py-2 px-4 border-b">3</td>
                    <td className="py-2 px-4 border-b">Alex Johnson</td>
                    <td className="py-2 px-4 border-b">alex@example.com</td>
                    <td className="py-2 px-4 border-b">User</td>
                    <td className="py-2 px-4 border-b">
                      <button className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition">
                        Delete
                      </button>
                    </td>
                  </tr>

                  {/* User 4 */}
                  <tr className="hover:bg-gray-50 transition">
                    <td className="py-2 px-4 border-b">4</td>
                    <td className="py-2 px-4 border-b">Emily Davis</td>
                    <td className="py-2 px-4 border-b">emily@example.com</td>
                    <td className="py-2 px-4 border-b">Admin</td>
                    <td className="py-2 px-4 border-b">
                      <button className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition">
                        Delete
                      </button>
                    </td>
                  </tr>

                  {/* User 5 */}
                  <tr className="hover:bg-gray-50 transition">
                    <td className="py-2 px-4 border-b">5</td>
                    <td className="py-2 px-4 border-b">Michael Brown</td>
                    <td className="py-2 px-4 border-b">michael@example.com</td>
                    <td className="py-2 px-4 border-b">User</td>
                    <td className="py-2 px-4 border-b">
                      <button className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition">
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
    </Structure>
  );
};

export default Users;
