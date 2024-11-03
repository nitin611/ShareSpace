import React, { useEffect, useState } from "react";
import Structure from "../../Components/structure/Structure";
import UserMenu from "../../Components/structure/UserMenu";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const navigate = useNavigate();

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get("http://localhost:8080/api/product/get-product");
        setProducts(data.products);
      } catch (err) {
        console.log(err);
        toast.error("Error in fetching products.");
      }
    };
    fetchProducts();
  }, []);

  // Open delete confirmation modal
  const handleDeleteClick = (productId) => {
    setProductToDelete(productId);
    setIsModalOpen(true);
  };

  // Confirm delete action
  const confirmDelete = async () => {
    try {
      const { data } = await axios.delete(`http://localhost:8080/api/product/delete-product/${productToDelete}`);
      if (data?.success) {
        toast.success("Product deleted successfully");
        setProducts(products.filter((product) => product._id !== productToDelete));
      } else {
        toast.error(data?.message || "Failed to delete product");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error in deleting the product");
    }
    setIsModalOpen(false);
  };

  return (
    <Structure title={"All Products - ShareSpace App"}>
      <div className="container mx-auto p-6">
        <div className="flex">
          {/* User Menu (30%) */}
          <div className="w-1/3 pr-4">
            <UserMenu />
          </div>

          {/* Products List (70%) */}
          <div className="w-2/3">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">All Products</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product._id} className="bg-white rounded-lg shadow-md p-4">
                  <img
                    src={`http://localhost:8080/api/product/product-photo/${product._id}`}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-2">{product.description}</p>
                  <p className="text-blue-500 font-bold mb-4">Rs.{product.price.toFixed(2)}</p>
                  
                  {/* Update and Delete buttons */}
                  <div className="flex justify-end space-x-2 mt-4">
                    <button
                      onClick={() => navigate(`/dashboard/user/update-Product/${product._id}`)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDeleteClick(product._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
            <div className="bg-white p-6 rounded shadow-lg text-center max-w-sm">
              <h3 className="text-xl font-semibold mb-4">Are you sure you want to delete this product?</h3>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={confirmDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Yes
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Structure>
  );
};

export default Products;
