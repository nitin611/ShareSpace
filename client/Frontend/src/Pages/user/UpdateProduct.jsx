import React, { useState, useEffect } from "react";
import Structure from "../../Components/structure/Structure";
import UserMenu from "../../Components/structure/UserMenu";

const UpdateProduct = () => {
  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  // Simulating fetching existing product details
  useEffect(() => {
    // Replace with your actual API call to fetch product details
    const fetchProductDetails = () => {
      // Sample product data
      const product = {
        id: "123",
        name: "Sample Product",
        price: 29.99,
        description: "This is a sample product description.",
        // image: "image_url", // Image URL if needed
      };

      setProductId(product.id);
      setProductName(product.name);
      setPrice(product.price);
      setDescription(product.description);
    };

    fetchProductDetails();
  }, []);

  const handleProductUpdate = (e) => {
    e.preventDefault();
    // Handle product update logic (e.g., API request to update product)
    console.log({
      productId,
      productName,
      price,
      description,
      image,
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <Structure title={"Update Product - Ecommerce App"}>
      <div className="container mx-auto p-6">
        <div className="flex">
          {/* User Menu (30%) */}
          <div className="w-1/3 pr-4">
            <UserMenu />
          </div>

          {/* Update Product Form (70%) */}
          <div className="w-2/3 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Update Product</h2>

            <form onSubmit={handleProductUpdate} className="space-y-4">
              {/* Product ID (hidden in form) */}
              <input type="hidden" value={productId} />

              {/* Product Name */}
              <div>
                <label
                  htmlFor="productName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Product Name
                </label>
                <input
                  type="text"
                  id="productName"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Enter product name"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              {/* Product Price */}
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Price (in IND)
                </label>
                <input
                  type="number"
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Enter price"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              {/* Product Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter product description"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  rows="4"
                  required
                ></textarea>
              </div>

              {/* Product Image */}
              <div>
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Upload New Image (Optional)
                </label>
                <input
                  type="file"
                  id="image"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  accept="image/*"
                />
              </div>

              {/* Update Button */}
              <div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Update Product
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Structure>
  );
};

export default UpdateProduct;
