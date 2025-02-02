import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Checkbox, Radio } from "antd";
import { Prices } from "../Components/Price";
import axios from "axios";
import toast from "react-hot-toast";
import { AiOutlineReload } from "react-icons/ai";
import Structure from "../Components/structure/Structure";
import API_BASE_URL from '../apiConfig';

const HomePage = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const banners = [
    "/banner01.png",
    "/banner02.png",
    "/banner03.png",
    "/banner05.png",
  ];

  // Automatically change banner slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % banners.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [banners.length]);

  // Get categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/category/getCategories`);
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
      const { data } = await axios.get(`${API_BASE_URL}/api/product/productList/${page}`);
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
      const { data } = await axios.get(`${API_BASE_URL}/api/product/productCount`);
      setTotal(data.total);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);

  // Load more products after clicking on the load more button
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_BASE_URL}/api/product/productList/${page}`);
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
    } else {
      getAllProducts();
    }
  }, [checked, radio]);

  const filterProduct = async () => {
    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/product/product-filter`, {
        checked,
        radio,
      });
      setProducts(data?.products);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Structure title={"HomePage - Super Iconic"}>
      <div className="min-h-screen bg-gray-50 p-2">
        {/* Banner */}
        <div className="relative rounded-lg overflow-hidden mb-4">
          <img
            src={banners[currentSlide]}
            alt={`Banner ${currentSlide + 1}`}
            className="w-full h-[340px] object-cover"
          />
        </div>

        {/* Centered Flash Sales Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Today's Flash Sales</h1>
          <p className="bg-red-100 text-red-600 inline-block px-4 py-2 mt-2 text-lg rounded-lg">
            New Items added!
          </p>
        </div>

        {/* Filters Section */}
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-12 lg:col-span-2 bg-white p-4 rounded-lg shadow-md">
            <div className="md:grid-cols-4 lg:grid-cols-2">
              <h4 className="text-md font-semibold text-gray-700 mb-4 ">Filter By Category</h4>
              {categories?.map((c) => (
                <Checkbox
                  key={c._id}
                  onChange={(e) => handleFilter(e.target.checked, c._id)}
                  className="mb-1 text-sm text-gray-600"
                >
                  {c.name}
                </Checkbox>
              ))}
            </div>

            <h4 className="text-md font-semibold text-gray-700 mt-4 mb-3">Filter By Price</h4>
            <Radio.Group
              onChange={(e) => setRadio(e.target.value)}
              className="flex flex-col space-y-1 text-sm text-gray-600"
            >
              {Prices?.map((p) => (
                <Radio value={p.array} key={p._id}>
                  {p.name}
                </Radio>
              ))}
            </Radio.Group>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-500 text-white py-1 text-sm rounded w-full hover:bg-red-600 transition"
            >
              Reset Filters
            </button>
          </div>

          {/* Products Section */}
          <div className="col-span-12 lg:col-span-9">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-4 lg:grid-cols-4">
              {products?.map((p) => (
                <div
                  key={p._id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col justify-between h-full transform transition hover:scale-105"
                >
                  <img
                    src={`${API_BASE_URL}/api/product/product-photo/${p._id}`}
                    className="w-full h-60 object-cover"
                    alt={p.name}
                  />
                  <div className="p-3 flex-grow">
                    <h5 className="text-md font-bold text-gray-700">{p.name}</h5>
                    <p className="text-sm text-gray-600">{p.description.substring(0, 60)}...</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-md font-semibold text-blue-600">
                        {new Intl.NumberFormat("en-IN", {
                          style: "currency",
                          currency: "INR",
                        }).format(p.price)}
                      </span>
                    </div>
                  </div>

                  <button
                    className="bg-green-500 w-full py-2 text-sm rounded text-white hover:bg-green-600 transition"
                    onClick={() => navigate(`/product/${p._id}`)}
                  >
                    View Product Details
                  </button>
                </div>
              ))}
            </div>
              
            {products.length < total && (
              <div className="flex justify-center mt-6">
                <button
                  className={`bg-red-500 text-white py-1 px-3 text-sm rounded-lg flex items-center transition ${
                    loading ? "opacity-50 cursor-not-allowed" : "hover:bg-red-600"
                  }`}
                  onClick={() => !loading && setPage(page + 1)}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Load More"}
                  <AiOutlineReload className="ml-1" />
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
