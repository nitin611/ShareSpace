import React from 'react';
import Structure from '../Components/structure/Structure';
import { useSearch } from '../context/search';
import { useNavigate } from 'react-router-dom';
import { AiOutlineReload } from 'react-icons/ai';
import toast from 'react-hot-toast';

const Search = () => {
    const [values] = useSearch();
    const navigate = useNavigate();
    const [cart, setCart] = React.useState(JSON.parse(localStorage.getItem("cart")) || []);
    const [loading, setLoading] = React.useState(false);
    const [page, setPage] = React.useState(1);
    const total = values?.results?.length || 0;
    const products = values.results;

    return (
        <Structure>
            <div className="container mx-auto px-4 py-8">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-gray-800">Search Results</h1>
                    <p className="text-lg text-gray-600 mt-2">
                        {products.length < 1 
                            ? 'No product found' 
                            : `Found ${products.length} products`}
                    </p>
                </div>

                <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {products.map((p) => (
                        <div
                            key={p._id}
                            className="bg-white rounded-lg shadow-lg overflow-hidden transition transform hover:scale-105 relative card"
                        >
                            <img
                                src={`http://localhost:8080/api/product/product-photo/${p._id}`}
                                className="w-full h-52 object-cover"
                                alt={p.name}
                            />
                            <div className="p-6">
                                <h5 className="text-xl font-bold text-gray-800 mb-2">{p.name}</h5>
                                <p className="text-gray-600 text-sm mb-4">{p.description.substring(0, 80)}...</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-2xl font-semibold text-blue-600">
                                        {new Intl.NumberFormat('en-IN', {
                                            style: 'currency',
                                            currency: 'INR',
                                        }).format(p.price)}
                                    </span>
                                    <button
                                        className="text-white bg-blue-500 py-1 px-4 rounded-md hover:bg-blue-600 transition"
                                        onClick={() => navigate(`/product/${p._id}`)}
                                    >
                                        Details
                                    </button>
                                </div>
                                <button
                                    className="mt-4 w-full bg-green-500 py-2 rounded-lg text-white hover:bg-green-600 transition"
                                    onClick={() => {
                                        setCart([...cart, p]);
                                        localStorage.setItem("cart", JSON.stringify([...cart, p]));
                                        toast.success("Item Added to Cart");
                                    }}
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {products.length < total && (
                    <div className="flex justify-center mt-10">
                        <button
                            className={`bg-purple-500 text-white py-3 px-6 rounded-md flex items-center font-semibold transition ${
                                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-purple-600"
                            }`}
                            onClick={() => {
                                if (!loading) {
                                    setLoading(true);
                                    setPage(page + 1);
                                }
                            }}
                            disabled={loading}
                        >
                            {loading ? "Loading..." : "Load More"}
                            <AiOutlineReload className="ml-2" />
                        </button>
                    </div>
                )}
            </div>

            {/* Custom CSS for the modern card style */}
            <style jsx>{`
                .card {
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    transition: all 0.3s ease;
                    border: 1px solid #e2e8f0;
                }
                .card:hover {
                    transform: translateY(-5px) scale(1.02);
                    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
                }
            `}</style>
        </Structure>
    );
};

export default Search;
