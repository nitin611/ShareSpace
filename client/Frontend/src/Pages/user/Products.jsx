import React, { useEffect, useState } from "react";
import Structure from "../../Components/structure/Structure";
import UserMenu from "../../Components/structure/UserMenu";

const Products = () => {
  const [products, setProducts] = useState([]);

  // Simulating fetching products from an API
  useEffect(() => {
    const fetchProducts = () => {
      // Sample product data
      const sampleProducts = [
        {
          id: "1",
          name: "Product One",
          price: 2900,
          description: "This is a description for product one.",
          image: "https://via.placeholder.com/150",
        },
        {
          id: "2",
          name: "Product Two",
          price: 1900,
          description: "This is a description for product two.",
          image: "https://via.placeholder.com/150",
        },
        {
          id: "3",
          name: "Product Three",
          price: 3900,
          description: "This is a description for product three.",
          image: "https://via.placeholder.com/150",
        },
        // Add more products as needed
      ];

      setProducts(sampleProducts);
    };

    fetchProducts();
  }, []);

  return (
    <Structure title={"All Products - Ecommerce App"}>
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
                <div key={product.id} className="bg-white rounded-lg shadow-md p-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-2">{product.description}</p>
                  <p className="text-blue-500 font-bold">{product.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Structure>
  );
};

export default Products;
