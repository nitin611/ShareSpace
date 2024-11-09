import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Checkbox, Radio } from "antd";
import { Prices } from "../Components/Price";

import axios from "axios";
import toast from "react-hot-toast";
import { AiOutlineReload } from "react-icons/ai";
import Structure from "../Components/structure/Structure";


const HomePage = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Get categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("http://localhost:8080/api/category/getCategories");
      if (data?.success) {
        setCategories(data.category);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Initial category and total count fetch
  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);

  // Get products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`http://localhost:8080/api/product/productList/${page}`);
      setLoading(false);
      setProducts(data.products);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  // Get total product count
  const getTotal = async () => {
    try {
      const { data } = await axios.get("http://localhost:8080/api/product/productCount");
      setTotal(data.total);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // agar page 
    if (page === 1) return;
    loadMore();
  }, [page]);

  // Load more products after clicking on the load more button-
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`http://localhost:8080/api/product/productList/${page}`);
      setLoading(false);
      setProducts([...products, ...data.products]);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  

  // Filter by category
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };
  useEffect(() => {
    if (checked.length || radio.length) {
      filterProduct();
       // Fetch all products if no filter is applied
    } else {
      getAllProducts(); 
    }
  }, [checked, radio]);


  const filterProduct = async () => {
    try {
      const { data } = await axios.post("http://localhost:8080/api/product/product-filter", {
        checked,
        radio,
      });
      setProducts(data?.products);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Structure title={"HomePage-ShareSpace"}>
        <div className="min-h-screen bg-gray-100 p-3">
      {/* Banner */}
      <div className="mb-2">
        <img
          src="/images/banner.png"
          className="rounded-lg w-full object-cover h-64"
          alt="Banner"
        />
      </div>

      {/* Filters Section */}
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-3 bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold text-gray-700 mb-4">Filter By Category</h4>
          {categories?.map((c) => (
            <Checkbox
              key={c._id}
              onChange={(e) => handleFilter(e.target.checked, c._id)}
              className="mb-2 text-gray-600"
            >
              {c.name}
            </Checkbox>
          ))}
          <h4 className="text-lg font-semibold text-gray-700 mt-6 mb-4">Filter By Price</h4>
          <Radio.Group
            onChange={(e) => setRadio(e.target.value)}
            className="flex flex-col space-y-2 text-gray-600"
          >
            {Prices?.map((p) => (
              <Radio value={p.array} key={p._id}>{p.name}</Radio>
            ))}
          </Radio.Group>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 bg-red-500 text-white py-2 rounded-lg w-full hover:bg-red-600 transition"
          >
            Reset Filters
          </button>
        </div>

        {/* Products Section */}
        <div className="col-span-12 lg:col-span-9">
          <h1 className="text-2xl font-semibold text-center mb-6">All Products</h1>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {products?.map((p) => (
              <div
                key={p._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden transform transition hover:scale-105"
              >
                <img
                  src={`http://localhost:8080/api/product/product-photo/${p._id}`}
                  className="w-full h-48 object-cover"
                  alt={p.name}
                />
                <div className="p-4">
                  <h5 className="text-lg font-bold text-gray-700">{p.name}</h5>
                  <p className="text-gray-600">{p.description.substring(0, 60)}...</p>
                  <div className="flex items-center justify-between mt-4">
                  <span className="text-xl font-semibold text-blue-600">
  {new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(p.price)}
</span>

                  {/* View Product details */}
                  </div>
                  <button
                    className="mt-4 bg-green-500 w-full py-2 rounded-lg text-white hover:bg-green-600 transition"
                    onClick={() => navigate(`/product/${p._id}`)}
                  >
                   View Product Details
                  </button>
                </div>
              </div>
            ))}
          </div>
          {products.length < total && (
  <div className="flex justify-center mt-8">
    <button
      className={`bg-purple-500 text-white py-2 px-4 rounded-lg flex items-center transition ${
        loading ? "opacity-50 cursor-not-allowed" : "hover:bg-purple-600"
      }`}
      onClick={() => !loading && setPage(page + 1)}
      disabled={loading}
    >
      {loading ? "Loading..." : "Load More"}f
      <AiOutlineReload className="ml-2" />
    </button>
  </div>
)}

        </div>
      </div>
    </div>

    </Structure>
  
  );
};

export default HomePage;
