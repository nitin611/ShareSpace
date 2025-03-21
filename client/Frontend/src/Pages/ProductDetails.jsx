import React, { useState, useEffect } from 'react';
import Structure from '../Components/structure/Structure';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';
import toast from 'react-hot-toast';
import API_BASE_URL from '../apiConfig';
import RatingAndReview from '../Components/RatingAndReview';
import { FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Modal Component for User Details
const Modal = ({ show, onClose, userDetails }) => {
  if (!show) return null;

  const handleEmailClick = (email) => {
    window.location.href = `mailto:${email}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-md w-11/12 sm:w-96">
        <h2 className="text-2xl font-semibold mb-4">Contact Product Owner</h2>
        <div className="mb-4">
          <p><strong>Name:</strong> {userDetails?.name}</p>
          <p><strong>Phn No.:</strong> {userDetails?.phone}</p>
          <p>
            <strong>Email:</strong>{' '}
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() => handleEmailClick(userDetails?.email)}
            >
              {userDetails?.email}
            </span>
          </p>
        </div>
        <button
          className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

// Modal Component for Confirmation
const ConfirmationModal = ({ show, onConfirm, onCancel }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-md w-11/12 sm:w-96">
        <h2 className="text-2xl font-semibold mb-4">Are You Sure?</h2>
        <div className="flex justify-end gap-4">
          <button
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
            onClick={onConfirm}
          >
            Yes
          </button>
          <button
            className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
            onClick={onCancel}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

// New Modal Component for Out Of Stock message
const OutOfStockModal = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-md w-11/12 sm:w-96">
        <h2 className="text-2xl font-semibold mb-4">Out Of Stock</h2>
        <p className="mb-4">Product will be there Very Soon</p>
        <button
          className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

// Product Details Component
const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [auth] = useAuth();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  // New state for Out Of Stock modal
  const [showOutOfStockModal, setShowOutOfStockModal] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    if (params?.id) {
      getProduct();
      fetchAverageRating();
    }
  }, [params?.id]);

  const getProduct = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/product/get-product/${params.id}`);
      setProduct(data?.product);
      setUserDetails(data?.product?.userId);
      getRelatedProducts();
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAverageRating = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/ratings/product/${params.id}/average`);
      setAverageRating(data.rating.averageRating);
      setTotalReviews(data.rating.totalReviews);
    } catch (error) {
      console.error(error);
    }
  };

  const getRelatedProducts = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/product/productList/1`);
      setRelatedProducts(data.products);
    } catch (err) {
      console.log(err);
    }
  };

  const handleBuyNow = () => {
    if (!auth?.token) {
      navigate('/signin');
      return;
    }
    setShowModal(true);
  };

  const handleContactOwner = async () => {
    if (!auth?.token) {
      navigate('/signin');
      return;
    }

    // Check if quantity is already 0
    if (product.quantity <= 0) {
      toast.error('This product is out of stock');
      return;
    }

    try {
      // First, add the order
      const { data } = await axios.post(
        `${API_BASE_URL}/api/auth/add-order`,
        { productId: product._id },
        {
          headers: {
            Authorization: `${auth.token}`,
          },
        }
      );

      const newQuantity = product.quantity - 1;
      
      // Then, update the product quantity in the database
      const updateResponse = await axios.put(
        `${API_BASE_URL}/api/product/update-product/${product._id}`,
        { 
          ...product, 
          quantity: newQuantity 
        },
        {
          headers: {
            Authorization: `${auth.token}`,
          },
        }
      );

      if (updateResponse.data.success) {
        // Update the product quantity in the UI
        setProduct(prev => ({
          ...prev,
          quantity: newQuantity
        }));
        
        toast.success('Thanks for buying this product!');
        setShowConfirmationModal(false);
      } else {
        toast.error('Error updating product quantity');
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Error placing the order.');
    }
  };

  return (
    <Structure>
      <div className="container mx-auto p-4 sm:p-8">
        <div className="flex flex-col lg:flex-row gap-8 md:gap-12 lg:gap-16 relative">
          {/* Average Rating Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-0 right-0 flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-md"
          >
            <div className="flex items-center">
              <FaStar className="w-6 h-6 text-yellow-500 mr-1" />
              <span className="text-xl font-bold">{averageRating.toFixed(1)}</span>
            </div>
            <span className="text-gray-600">({totalReviews} reviews)</span>
          </motion.div>

          <div className="w-full lg:w-1/3">
            {product?._id && (
              <img
                src={`${API_BASE_URL}/api/product/product-photo/${product._id}`}
                alt={product.name}
                className="w-full sm:w-80 sm:h-80 object-cover rounded-md mb-5"
              />
            )}
          </div>
          
          <div className="w-full lg:w-2/3">
            <h1 className="text-3xl font-semibold">{product.name}</h1>
            <p className="text-2xl font-bold text-gray-800">₹{product.price}</p>
            <div className="flex items-center mt-2 mb-4">
              <span className="text-lg font-medium text-gray-700">Quantity Available:</span>
              <span className={`ml-2 px-3 py-1 rounded-full ${
                product.quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {product.quantity}
              </span>
            </div>
            <p className="text-gray-700 mt-4 mb-6">{product.description}</p>
            <button
              className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 mr-4 text-sm sm:text-base transform hover:scale-105 transition-transform duration-200"
              onClick={handleBuyNow}
            >
              Buy Now
            </button>
            <button
              className={`${
                product.quantity > 0
                  ? 'bg-blue-500 hover:bg-blue-600'
                  : 'bg-gray-400 cursor-not-allowed'
              } text-white px-6 py-2 rounded-md transform transition-transform duration-200 ${
                product.quantity > 0 ? 'hover:scale-105' : ''
              }`}
              onClick={() => product.quantity > 0 && setShowConfirmationModal(true)}
              disabled={product.quantity === 0}
            >
              {product.quantity > 0 ? 'Contact Product Owner' : 'Not Available'}
            </button>
          </div>
        </div>

        {/* Modal to show user details */}
        <Modal show={showModal} onClose={() => setShowModal(false)} userDetails={userDetails} />

        {/* Confirmation Modal */}
        <ConfirmationModal
          show={showConfirmationModal}
          onConfirm={handleContactOwner}
          onCancel={() => setShowConfirmationModal(false)}
        />

        {/* Rating and Review Section */}
        <div className="mt-12">
          <RatingAndReview productId={params.id} onNewReview={fetchAverageRating} />
        </div>
      </div>
    </Structure>
  );
};

export default ProductDetails;
