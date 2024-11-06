import React, { useState, useEffect } from 'react';
import Structure from '../../Components/structure/Structure';
import AdminMenu from '../../Components/structure/AdminMenu';
import toast from 'react-hot-toast';
import axios from 'axios';

const CreateCategory = () => {
  const [categoryName, setCategoryName] = useState('');
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);

  // Fetch all categories from backend
  const getAllCategories = async () => {
    try {
      const { data } = await axios.get('http://localhost:8080/api/category/getCategories');
      if (data.success) {
        setCategories(data.category);
      } else {
        toast.error(data.msg || 'Failed to load categories');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error in getting the categories');
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  // Handle category creation
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!categoryName) {
      toast.error('Category name is required');
      return;
    }
    try {
      const { data } = await axios.post('http://localhost:8080/api/category/create-category', { name: categoryName });
      if (data.success) {
        toast.success('Category created successfully');
        setCategories([...categories, data.category]);
        setCategoryName('');
      } else {
        toast.error(data.msg || 'Error in creating category');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error in creating category');
    }
  };

  // Handle category edit
  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
  };

  // Handle category update
  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!editingCategory) return;
    try {
      const { data } = await axios.put(`http://localhost:8080/api/category/update-category/${editingCategory._id}`, {
        name: categoryName,
      });
      if (data.success) {
        toast.success('Category updated successfully');
        setCategories(categories.map((cat) => (cat._id === editingCategory._id ? { ...cat, name: categoryName } : cat)));
        setCategoryName('');
        setEditingCategory(null);
      } else {
        toast.error(data.msg || 'Error in updating category');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error in updating category');
    }
  };

  // Handle category delete
  const handleDeleteCategory = async (categoryId) => {
    try {
      const { data } = await axios.delete(`http://localhost:8080/api/category/delete-category/${categoryId}`);
      if (data.success) {
        toast.success('Category deleted successfully');
        setCategories(categories.filter((category) => category._id !== categoryId));
      } else {
        toast.error(data.msg || 'Error in deleting category');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error in deleting category');
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
            <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Manage Category</h2>
 
            <form onSubmit={editingCategory ? handleUpdateCategory : handleCategorySubmit}>
              <div className="mb-4">
                <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-2">
                  <b>Category Name</b>
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
                {editingCategory ? 'Update Category' : 'Create Category'}
              </button>
            </form>
 
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4">Existing Categories</h3>
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b">Name</th>
                    <th className="px-4 py-2 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories && categories.length > 0 ? (
                    categories.map((category) => (
                      <tr key={category._id}>
                        <td className="px-4 py-2 border-b">{category.name}</td>
                        <td className="px-4 py-2 border-b">
                          <button
                            onClick={() => handleEditCategory(category)}
                            className="bg-blue-500 text-white py-1 px-3 rounded-md mr-2 hover:bg-blue-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category._id)}
                            className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-4 py-2 border-b text-center" colSpan="2">
                        No categories available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Structure>
  );
};

export default CreateCategory;
