import React, { useState, useEffect } from 'react';
import Structure from '../Components/structure/Structure';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { AiOutlineReload } from 'react-icons/ai';

const ProductDetails = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState({});
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    // Fetch product details on initial render
    useEffect(() => {
        if (params?.id) {
            getProduct();
            fetchRelatedProducts();
        }
        // Fetch all products when the component mounts
        fetchAllProducts();
    }, [params?.id]);

    // Fetch single product data
    const getProduct = async () => {
        try {
            const { data } = await axios.get(`http://localhost:8080/api/product/get-product/${params.id}`);
            setProduct(data?.product);
        } catch (err) {
            console.log(err);
        }
    };

    // Fetch related products data
    const fetchRelatedProducts = async () => {
        try {
            const { data } = await axios.get(`http://localhost:8080/api/product/get-all-products`);
            setRelatedProducts(data?.products || []);
        } catch (err) {
            console.log(err);
        }
    };

    // Fetch all products with pagination
    const fetchAllProducts = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`http://localhost:8080/api/product/get-all-products?page=${page}`);
            setProducts(prevProducts => [...prevProducts, ...data?.products]);
            setTotal(data?.totalProducts);
            setLoading(false);
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    };

    // Load more products when "Load More" is clicked
    const handleLoadMore = () => {
        setPage(prevPage => prevPage + 1);
    };

    // Trigger fetchAllProducts every time the page changes
    useEffect(() => {
        if (page > 1) fetchAllProducts();
    }, [page]);

    return (
        <Structure>
            <div className="container mx-auto p-8">
                {/* Product Details Section */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Product Image */}
                    <div className="w-full lg:w-1/3">
                        <img
                            src={`http://localhost:8080/api/product/product-photo/${product._id}`}
                            alt={product.name}
                            className="w-full h-60 object-cover rounded-md mb-5"
                        />
                    </div>

                    {/* Product Details */}
                    <div className="w-full lg:w-2/3">
                        <h1 className="text-3xl font-semibold">{product.name}</h1>
                        <div className="flex items-center mb-4">
                            <span className="text-red-500 text-xl mr-2">★★★★☆</span>
                            <span>({product.reviewsCount || 8})</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-800">₹{product.price}</p>
                        <p className="text-gray-700 mt-4 mb-6">{product.description}</p>

                        {/* Add to Cart Button */}
                        <button className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600">
                            BUY NOW
                        </button>

                       
                    </div>
                </div>

                

               
            </div>
        </Structure>
    );
};

export default ProductDetails;
