import React, { useState,useEffect } from 'react';
import Structure from '../../Components/structure/Structure';
import AdminMenu from '../../Components/structure/AdminMenu'; // Import AdminMenu
import toast from 'react-hot-toast';
import axios from 'axios';


const CreateCategory = () => {
  const [categoryName, setCategoryName] = useState([]);

  // get all categories-
  const getAllCategories=async()=>{
    try {
      const {data}=await axios.get('/api/category/get-category')
      if(data.success){
        setCategoryName(data);
      }
    } catch (err) {
      console.log(err);
      toast.error('Error in getting the category')
    }
  }

  useEffect(()=>{
      getAllCategories()
  },[])

  const handleCategorySubmit = (e) => {
    e.preventDefault();

    console.log('Category Created:', categoryName);
  };

  return (
    <Structure>
      
      <div className="flex">
        {/* Sidebar (30%) */}
        <div className="w-1/3 bg-gray-100 p-4">
          <AdminMenu />
        </div>

      
        <div className="w-2/3 p-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Create New Category</h2>
            
            <form onSubmit={handleCategorySubmit}>
              <div className="mb-4">
                <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  id="categoryName"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="Enter category name"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Managle Category

              </button>
            </form>
          </div>
        </div>
      </div>
    </Structure>
  );
};

export default CreateCategory;
