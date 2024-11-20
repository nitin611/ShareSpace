import React from 'react';
import Structure from '../../Components/structure/Structure';
import AdminMenu from '../../Components/structure/AdminMenu';

const Users = () => {
  return (
    <Structure>
      <div className="flex">
       
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
                    <td className="py-2 px-4 border-b">Md Faizan</td>
                    <td className="py-2 px-4 border-b">md.faizan2021@vitstudent.ac.in</td>
                    <td className="py-2 px-4 border-b">Admin</td>
                    <td className="py-2 px-4 border-b">
                      <button className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition">
                        Delete
                      </button>
                    </td>
                  </tr>

              
                  <tr className="hover:bg-gray-50 transition">
                    <td className="py-2 px-4 border-b">2</td>
                    <td className="py-2 px-4 border-b">Nitin Jha</td>
                    <td className="py-2 px-4 border-b">nitinkumar.jha2021@vitstudent.ac.in</td>
                    <td className="py-2 px-4 border-b">User</td>
                    <td className="py-2 px-4 border-b">
                      <button className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition">
                        Delete
                      </button>
                    </td>
                  </tr>

                  <tr className="hover:bg-gray-50 transition">
                    <td className="py-2 px-4 border-b">3</td>
                    <td className="py-2 px-4 border-b">Faiz Syed Ahmed</td>
                    <td className="py-2 px-4 border-b">faizsyed.ahmed2021@vitstudent.ac.in</td>
                    <td className="py-2 px-4 border-b">User</td>
                    <td className="py-2 px-4 border-b">
                      <button className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition">
                        Delete
                      </button>
                    </td>
                  </tr>

                  <tr className="hover:bg-gray-50 transition">
                    <td className="py-2 px-4 border-b">4</td>
                    <td className="py-2 px-4 border-b">Aditya Kumar</td>
                    <td className="py-2 px-4 border-b">aditya.kumar2021@vitstudent.ac.in</td>
                    <td className="py-2 px-4 border-b">User</td>
                    <td className="py-2 px-4 border-b">
                      <button className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition">
                        Delete
                      </button>
                    </td>
                  </tr>

                  <tr className="hover:bg-gray-50 transition">
                    <td className="py-2 px-4 border-b">5</td>
                    <td className="py-2 px-4 border-b">Vraj Modi</td>
                    <td className="py-2 px-4 border-b">vraj.modi2021@vitstudent.ac.in</td>
                    <td className="py-2 px-4 border-b">User</td>
                    <td className="py-2 px-4 border-b">
                      <button className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition">
                        Delete
                      </button>
                    </td>
                  </tr>

                 
                  <tr className="hover:bg-gray-50 transition">
                    <td className="py-2 px-4 border-b">6</td>
                    <td className="py-2 px-4 border-b">Ishaan Sahai</td>
                    <td className="py-2 px-4 border-b">ishaan.sahai2021@vitstudent.ac.in</td>
                    <td className="py-2 px-4 border-b">User</td>
                    <td className="py-2 px-4 border-b">
                      <button className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition">
                        Delete
                      </button>
                    </td>
                  </tr>

                  <tr className="hover:bg-gray-50 transition">
                    <td className="py-2 px-4 border-b">7</td>
                    <td className="py-2 px-4 border-b">Kislay Kumar</td>
                    <td className="py-2 px-4 border-b">kislay.kumar2021@vitstudent.ac.in</td>
                    <td className="py-2 px-4 border-b">User</td>
                    <td className="py-2 px-4 border-b">
                      <button className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition">
                        Delete
                      </button>
                    </td>
                  </tr>

              
                  <tr className="hover:bg-gray-50 transition">
                    <td className="py-2 px-4 border-b">8</td>
                    <td className="py-2 px-4 border-b">Dinesh Das</td>
                    <td className="py-2 px-4 border-b">dinesh.das2021@vitstudent.ac.in</td>
                    <td className="py-2 px-4 border-b">User</td>
                    <td className="py-2 px-4 border-b">
                      <button className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition">
                        Delete
                      </button>
                    </td>
                  </tr>

           
                  <tr className="hover:bg-gray-50 transition">
                    <td className="py-2 px-4 border-b">9</td>
                    <td className="py-2 px-4 border-b">Tauheed Khan</td>
                    <td className="py-2 px-4 border-b">tauheed.khan2021@vitstudent.ac.in</td>
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
