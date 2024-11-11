import React, { useState, useEffect } from 'react';
import Structure from '../Components/structure/Structure';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

// Modal Component for User Details
const Modal = ({ show, onClose, userDetails }) => {
  if (!show) return null;

  const handleEmailClick = (email) => {
    window.location.href = `mailto:${email}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-md w-11/12 sm:w-96 md:w-1/2 lg:w-2/3 xl:w-1/2">
        <h2 className="text-2xl font-semibold mb-4">User Details</h2>
        <div className="mb-4">
          <p><strong>Name:</strong> {userDetails?.name}</p>
          <p><strong>Email:</strong> 
            <span className="text-blue-500 cursor-pointer" onClick={() => handleEmailClick(userDetails?.email)}>
              {userDetails?.email}
            </span>
          </p>
          <p><strong>Phone:</strong> {userDetails?.phone}</p>
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

const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    if (params?.id) {
      getProduct();
    }
  }, [params?.id]);

  // Fetch single product data
  const getProduct = async () => {
    try {
      const { data } = await axios.get(`http://localhost:8080/api/product/get-product/${params.id}`);
      setProduct(data?.product);
      setUserDetails(data?.product?.userId);
      getRelatedProducts();
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch all products for related products
  const getRelatedProducts = async () => {
    try {
      const { data } = await axios.get('http://localhost:8080/api/product/productList/1'); 
      setRelatedProducts(data.products.filter(p => p._id !== params.id));
    } catch (err) {
      console.log(err);
    }
  };

  const handleBuyNow = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <Structure>
      <div className="container mx-auto p-8">
        {/* Product Details Section */}
        <div className="flex flex-col lg:flex-row gap-60">
          {/* Product Images */}
          <div className="w-full  h-full lg:w-1/3 flex flex-col ">
            <img
              src={`http://localhost:8080/api/product/product-photo/${product._id}`}
              alt={product.name}
              className="w-full h-100 object-cover rounded-md mb-5"
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
            <button
              className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600"
              onClick={handleBuyNow}
            >
              BUY NOW
            </button>
          </div>
        </div>

        {/* Modal for User Details */}
        <Modal
          show={showModal}
          onClose={handleCloseModal}
          userDetails={userDetails}
        />

        {/* Related Products Section */}
        <div className="mt-12">
        <h2 className="text-4xl font-semibold mb-4 text-center text-red-600">Related Products</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {relatedProducts.map((relProduct) => (
              <div
                key={relProduct._id}
                className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition cursor-pointer"
                onClick={() => navigate(`/product/${relProduct._id}`)}
              >
                <img
                  src={`http://localhost:8080/api/product/product-photo/${relProduct._id}`}
                  alt={relProduct.name}
                  className="w-full h-50 object-cover rounded-md mb-2"
                />
                <h3 className="text-lg font-semibold">{relProduct.name}</h3>
                <p className="text-red-500 font-bold">₹{relProduct.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Structure>
  );
};

export default ProductDetails;
