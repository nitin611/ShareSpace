import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/auth';
import { toast } from 'react-hot-toast';
import { FaStar, FaEdit, FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import API_BASE_URL from '../apiConfig';

const RatingAndReview = ({ productId }) => {
    const [auth] = useAuth();
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [editingReview, setEditingReview] = useState(null);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [loading, setLoading] = useState(false);

    // Fetch reviews and average rating
    const fetchReviews = async () => {
        try {
            const { data } = await axios.get(`${API_BASE_URL}/api/ratings/product/${productId}`);
            if (data.success) {
                setReviews(data.reviews || []);
                // Update total reviews count
                setTotalReviews(data.reviews.length);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
            toast.error(error.response?.data?.message || 'Error fetching reviews');
            setReviews([]);
            setTotalReviews(0);
        }
    };

    const fetchAverageRating = async () => {
        try {
            const { data } = await axios.get(`${API_BASE_URL}/api/ratings/product/${productId}/average`);
            if (data.success && data.rating) {
                setAverageRating(data.rating.averageRating || 0);
                setTotalReviews(data.rating.totalReviews || 0);
            }
        } catch (error) {
            console.error('Error fetching average rating:', error);
            setAverageRating(0);
            setTotalReviews(0);
        }
    };

    useEffect(() => {
        if (productId) {
            fetchReviews();
            fetchAverageRating();
        }
    }, [productId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!auth?.token) {
            toast.error('Please login to add a review');
            return;
        }
        
        setLoading(true);
        try {
            const { data } = await axios.post(
                `${API_BASE_URL}/api/ratings/create`,
                { productId, rating, review },
                {
                    headers: {
                        Authorization: auth?.token
                    }
                }
            );
            
            if (data.success) {
                toast.success(data.message);
                setRating(0);
                setReview('');
                // Fetch both reviews and average rating after successful submission
                await Promise.all([fetchReviews(), fetchAverageRating()]);
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error(error.response?.data?.message || 'Error adding review');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!auth?.token) {
            toast.error('Please login to update your review');
            return;
        }

        setLoading(true);
        try {
            const { data } = await axios.put(
                `${API_BASE_URL}/api/ratings/${editingReview._id}`,
                { rating, review },
                {
                    headers: {
                        Authorization: auth?.token
                    }
                }
            );

            if (data.success) {
                toast.success(data.message);
                setEditingReview(null);
                setRating(0);
                setReview('');
                // Fetch both reviews and average rating after successful update
                await Promise.all([fetchReviews(), fetchAverageRating()]);
            }
        } catch (error) {
            console.error('Error updating review:', error);
            toast.error(error.response?.data?.message || 'Error updating review');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (reviewId) => {
        if (!auth?.token) {
            toast.error('Please login to delete your review');
            return;
        }

        if (!window.confirm('Are you sure you want to delete this review?')) {
            return;
        }

        setLoading(true);
        try {
            const { data } = await axios.delete(
                `${API_BASE_URL}/api/ratings/${reviewId}`,
                {
                    headers: {
                        Authorization: auth?.token
                    }
                }
            );

            if (data.success) {
                toast.success(data.message);
                // Fetch both reviews and average rating after successful deletion
                await Promise.all([fetchReviews(), fetchAverageRating()]);
            }
        } catch (error) {
            console.error('Error deleting review:', error);
            toast.error(error.response?.data?.message || 'Error deleting review');
        } finally {
            setLoading(false);
        }
    };

    const startEdit = (review) => {
        setEditingReview(review);
        setRating(review.rating);
        setReview(review.review);
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
            {/* Average Rating Display */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center space-x-4 p-4 bg-white rounded-lg shadow-lg"
            >
                <div className="text-4xl font-bold text-yellow-500">
                    {Number.isFinite(averageRating) ? averageRating.toFixed(1) : '0.0'}
                </div>
                <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                            key={star}
                            className={`w-6 h-6 ${
                                star <= averageRating ? 'text-yellow-500' : 'text-gray-300'
                            }`}
                        />
                    ))}
                </div>
                <div className="text-gray-600">({totalReviews || 0} reviews)</div>
            </motion.div>

            {/* Review Form */}
            {auth?.token && (
                <motion.form 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={editingReview ? handleUpdate : handleSubmit}
                    className="space-y-4 bg-white p-6 rounded-lg shadow-lg"
                >
                    <div className="flex items-center space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                                key={star}
                                className={`w-8 h-8 cursor-pointer transition-colors duration-200 ${
                                    star <= (hoveredRating || rating) ? 'text-yellow-500' : 'text-gray-300'
                                } hover:text-yellow-400`}
                                onMouseEnter={() => setHoveredRating(star)}
                                onMouseLeave={() => setHoveredRating(0)}
                                onClick={() => setRating(star)}
                            />
                        ))}
                    </div>
                    <textarea
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        placeholder="Write your review..."
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="4"
                        required
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        className={`w-full py-2 rounded-lg transition-colors duration-200 ${
                            loading 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : (editingReview ? 'Update Review' : 'Submit Review')}
                    </button>
                    {editingReview && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditingReview(null);
                                setRating(0);
                                setReview('');
                            }}
                            className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200"
                            disabled={loading}
                        >
                            Cancel Edit
                        </button>
                    )}
                </motion.form>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-gray-800">Customer Reviews</h3>
                <div className="overflow-x-auto pb-4">
                    <div className="flex space-x-4 snap-x snap-mandatory">
                        {reviews.length > 0 ? (
                            reviews.map((review) => (
                                <motion.div
                                    key={review._id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="min-w-[300px] max-w-[300px] snap-center bg-white p-4 rounded-lg shadow-lg space-y-3"
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center space-x-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <FaStar
                                                    key={star}
                                                    className={`w-4 h-4 ${
                                                        star <= review.rating ? 'text-yellow-500' : 'text-gray-300'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        {auth?.user?._id === review.user._id && (
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => startEdit(review)}
                                                    className="text-blue-500 hover:text-blue-600 transition-colors duration-200"
                                                    disabled={loading}
                                                >
                                                    <FaEdit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(review._id)}
                                                    className="text-red-500 hover:text-red-600 transition-colors duration-200"
                                                    disabled={loading}
                                                >
                                                    <FaTrash className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-gray-700">{review.review}</p>
                                    <div className="flex justify-between items-center text-sm text-gray-500">
                                        <span>{review.user.name}</span>
                                        <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="w-full text-center text-gray-500">
                                No reviews yet. Be the first to review this product!
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RatingAndReview;
