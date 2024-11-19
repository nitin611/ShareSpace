import React, { useState, useEffect } from "react";
import Structure from "../../Components/structure/Structure";
import UserMenu from "../../Components/structure/UserMenu";
import toast from 'react-hot-toast';
import axios from 'axios';
import { Select } from "antd";
import { useNavigate } from "react-router-dom";
import loadingGif from "../../assets/White Clean Now Loading Animation Youtube Video.gif"; 
import API_BASE_URL from '../../apiConfig';
const { Option } = Select;


const CreateProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [photo, setPhoto] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [loading, setLoading] = useState(false); 

  const getAllCategories = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/category/getCategories`);
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (err) {
      console.log(err);
      toast.error('Error in getting the category');
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true); 
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('category', category);
      formData.append('quantity', quantity);
      formData.append('shipping', shipping);
      if (photo) {
        formData.append('photo', photo);
      }

      const { data } = await axios.post(`${API_BASE_URL}/api/product/create-product`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (data?.success) {
        toast.success('Product created successfully');
        setTimeout(() => {
          navigate('/dashboard/user/products');
        }, 1000);
      } else {
        toast.error(data?.message || 'Failed to create product');
      }
    } catch (err) {
      console.error(err);
      toast.error('Does not meet with ShareSpace Norms');
    } finally {
      setLoading(false); 
    }
  };

  return (
    <Structure title={"Create Product -ShareSpace App"}>
      <div className="container mx-auto p-6">
        <div className="flex">
          {/* User Menu (30%) */}
          <div className="w-1/3 pr-4">
            <UserMenu />
          </div>

          {/* Create Product Form (70%) */}
          <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">Create Product</h1>
            {loading ? (
              <div className="flex flex-col items-center justify-center p-4">
                <img src={loadingGif} alt="Loading" className="w-full h-full mb-1" />
                <p className="text-blue-500 font-semibold text-lg">Scanning your product with AI...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <Select
                  className="w-full text-gray-700 border border-gray-300 rounded-md p-2"
                  placeholder="Select a category"
                  size="large"
                  showSearch
                  bordered={false}
                  onChange={(value) => setCategory(value)}
                >
                  {categories?.map((c) => (
                    <Option key={c._id} value={c._id}>
                      {c.name}
                    </Option>
                  ))}
                </Select>

                <div className="w-full">
                  <label className="flex items-center justify-center w-full px-4 py-2 bg-blue-50 border border-blue-300 rounded-md cursor-pointer hover:bg-blue-100">
                    <span className="text-blue-500">
                      {photo ? photo.name : "Upload Photo"}
                    </span>
                    <input
                      type="file"
                      name="photo"
                      accept="image/*"
                      onChange={(e) => setPhoto(e.target.files[0])}
                      hidden
                    />
                  </label>
                </div>

                {photo && (
                  <div className="flex justify-center">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt="product_photo"
                      className="w-48 h-48 object-cover rounded-md shadow-md"
                    />
                  </div>
                )}

                <input
                  type="text"
                  value={name}
                  placeholder="Product Name"
                  className="w-full border border-gray-300 rounded-md p-2 text-gray-700"
                  onChange={(e) => setName(e.target.value)}
                />

                <textarea
                  value={description}
                  placeholder="Product Description"
                  className="w-full border border-gray-300 rounded-md p-2 text-gray-700"
                  onChange={(e) => setDescription(e.target.value)}
                />

                <input
                  type="number"
                  value={price}
                  placeholder="Price"
                  className="w-full border border-gray-300 rounded-md p-2 text-gray-700"
                  onChange={(e) => setPrice(e.target.value)}
                />

                <input
                  type="number"
                  value={quantity}
                  placeholder="Quantity"
                  className="w-full border border-gray-300 rounded-md p-2 text-gray-700"
                  onChange={(e) => setQuantity(e.target.value)}
                />

                <Select
                  className="w-full text-gray-700 border border-gray-300 rounded-md p-2"
                  placeholder="Select Shipping"
                  size="large"
                  showSearch
                  bordered={false}
                  onChange={(value) => setShipping(value)}
                >
                  <Option value="0">No</Option>
                  <Option value="1">Yes</Option>
                </Select>

                <button
                  className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all"
                  onClick={handleCreate}
                >
                  CREATE PRODUCT
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Structure>
  );
};

export default CreateProduct;
