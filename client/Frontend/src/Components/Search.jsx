import React from "react";
import { useSearch } from "../context/search.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import API_BASE_URL from '../apiConfig';

const SearchInput = () => {
  const [values, setValues] = useSearch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/product/searchProduct/${values.keyword}`
      );
      setValues({ ...values, results: data });
      navigate("/search");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center mt-1 w-full ">
      <form
        className="relative w-half max-w-lg"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          className="w-full h-10 px-10 pr-10 text-white bg-gray-800 border border-gray-500 
            rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300"
          placeholder="Search for products..."
          value={values.keyword}
          onChange={(e) => setValues({ ...values, keyword: e.target.value })}
        />
        <button
          type="submit"
          className="absolute top-1/2 right-3 transform -translate-y-1/2 text-black hover:text-purple-700 transition-all duration-300"
        >
          <FiSearch size={20} />
        </button>
      </form>
    </div>
  );
};

export default SearchInput;
