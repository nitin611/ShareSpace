import React, { useState, useEffect } from 'react';
import Structure from '../Components/structure/Structure';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';
import toast from 'react-hot-toast';
import API_BASE_URL from '../apiConfig';

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

// Product Details Component
const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [auth] = useAuth();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    if (params?.id) {
      getProduct();
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
    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/api/auth/add-order`,
        { productId: product._id },
        {
          headers: {
            Authorization: `${auth.token}`,
          },
        }
      );
      toast.success('Thanks for buying this product!');
      setShowConfirmationModal(false); // Close confirmation modal
    } catch (error) {
      console.log(error);
      toast.error('Error placing the order.');
    }
  };

  return (
    <Structure>
      <div className="container mx-auto p-8">
        <div className="flex flex-col lg:flex-row gap-60">
          <div className="w-full lg:w-1/3">
            <img
              src={`${API_BASE_URL}/api/product/product-photo/${product._id}`}
              alt={product.name}
              className="w-80 h-80 object-cover rounded-md mb-5"
            />
          </div>
          <div className="w-full lg:w-6/4">
            <h1 className="text-3xl font-semibold">{product.name}</h1>
            <p className="text-2xl font-bold text-gray-800">₹{product.price}</p>
            <p className="text-gray-700 mt-4 mb-6">{product.description}</p>
            <button
              className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 mr-4"
              onClick={handleBuyNow}
            >
              Buy Now
            </button>
            <button
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
              onClick={() => setShowConfirmationModal(true)}
            >
              Contact Product Owner
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

        {/* Related Products Section */}
        <div className="mt-12">
          <h2 className="text-4xl font-semibold mb-4 text-center text-red-600">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {relatedProducts?.map((p) => (
              <div
                key={p._id}
                className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition cursor-pointer"
                onClick={() => navigate(`/product/${p._id}`)}
              >
                <img
                  src={`${API_BASE_URL}/api/product/product-photo/${p._id}`}
                  className="w-60 h-60 object-cover"
                  alt={p.name}
                />
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <p className="text-red-500 font-bold">₹{p.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Structure>
  );
};

export default ProductDetails;
