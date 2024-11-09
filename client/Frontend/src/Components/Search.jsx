import React from "react";
import { useSearch } from "../context/search.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

const SearchInput = () => {
  const [values, setValues] = useSearch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(
        `http://localhost:8080/api/product/searchProduct/${values.keyword}`
      );
      setValues({ ...values, results: data });
      navigate("/search");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center mt-4 w-full ">
      <form
        className="relative w-half max-w-lg"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          className="w-full h-12 px-4 pr-10 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
          placeholder="Search for products, categories, etc..."
          value={values.keyword}
          onChange={(e) => setValues({ ...values, keyword: e.target.value })}
        />
        <button
          type="submit"
          className="absolute top-1/2 right-3 transform -translate-y-1/2 text-purple-500 hover:text-purple-700 transition-all duration-300"
        >
          <FiSearch size={20} />
        </button>
      </form>
    </div>
  );
};

export default SearchInput;
