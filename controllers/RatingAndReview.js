import RatingAndReview from '../models/RatingAndReview.js';
import userModel from '../models/userModel.js';
import productModel from '../models/productModel.js';
import Point from '../models/pointModel.js';
import mongoose from 'mongoose';

// Create a new rating and review
export const createRating = async (req, res) => {
    try {
        const { productId, rating, review } = req.body;
        const userId = req.user._id;

        // Check if user has already reviewed this product
        const existingReview = await RatingAndReview.findOne({
            user: userId,
            product: productId
        });

        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: "You have already reviewed this product"
            });
        }

        // Create new rating
        const newRating = await RatingAndReview.create({
            user: userId,
            product: productId,
            rating,
            review
        });

        // Add points for creating review
        let userPoints = await Point.findOne({ userId });
        if (!userPoints) {
            userPoints = new Point({ userId, totalPoints: 0, history: [] });
        }
        userPoints.totalPoints += 10;
        userPoints.history.push({
            action: 'Review Added',
            points: 10,
            productId,
            date: new Date()
        });
        await userPoints.save();

        // Populate user details
        const populatedRating = await RatingAndReview.findById(newRating._id)
            .populate('user', 'name email')
            .populate('product', 'name');

        res.status(201).json({
            success: true,
            message: "Rating added successfully",
            rating: populatedRating,
            pointsAdded: 10
        });

    } catch (error) {
        console.error("Error in createRating:", error);
        res.status(500).json({
            success: false,
            message: "Error in creating rating",
            error: error.message
        });
    }
};

// Get all reviews for a product
export const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;

        const reviews = await RatingAndReview.find({ product: productId })
            .populate('user', 'name email')
            .populate('product', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            reviews
        });

    } catch (error) {
        console.error("Error in getProductReviews:", error);
        res.status(500).json({
            success: false,
            message: "Error in fetching reviews",
            error: error.message
        });
    }
};

// Update a review
export const updateReview = async (req, res) => {
    try {
        const { rating, review } = req.body;
        const { reviewId } = req.params;
        const userId = req.user._id;

        const existingReview = await RatingAndReview.findOne({
            _id: reviewId,
            user: userId
        });

        if (!existingReview) {
            return res.status(404).json({
                success: false,
                message: "Review not found or you're not authorized to update it"
            });
        }

        existingReview.rating = rating || existingReview.rating;
        existingReview.review = review || existingReview.review;
        await existingReview.save();

        const updatedReview = await RatingAndReview.findById(reviewId)
            .populate('user', 'name email')
            .populate('product', 'name');

        res.status(200).json({
            success: true,
            message: "Review updated successfully",
            review: updatedReview
        });

    } catch (error) {
        console.error("Error in updateReview:", error);
        res.status(500).json({
            success: false,
            message: "Error in updating review",
            error: error.message
        });
    }
};

// Delete a review
export const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const userId = req.user._id;

        const review = await RatingAndReview.findOne({
            _id: reviewId,
            user: userId
        });

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found or you're not authorized to delete it"
            });
        }

        await review.deleteOne();

        res.status(200).json({
            success: true,
            message: "Review deleted successfully"
        });

    } catch (error) {
        console.error("Error in deleteReview:", error);
        res.status(500).json({
            success: false,
            message: "Error in deleting review",
            error: error.message
        });
    }
};

// Get average rating for a product
export const getProductAverageRating = async (req, res) => {
    try {
        const { productId } = req.params;

        const result = await RatingAndReview.aggregate([
            {
                $match: {
                    product: new mongoose.Types.ObjectId(productId)
                }
            },
            {
                $group: {
                    _id: "$product",
                    averageRating: { $avg: "$rating" },
                    totalReviews: { $sum: 1 }
                }
            }
        ]);

        const rating = result.length > 0 ? {
            averageRating: Math.round(result[0].averageRating * 10) / 10,
            totalReviews: result[0].totalReviews
        } : {
            averageRating: 0,
            totalReviews: 0
        };

        res.status(200).json({
            success: true,
            rating
        });

    } catch (error) {
        console.error("Error in getProductAverageRating:", error);
        res.status(500).json({
            success: false,
            message: "Error in fetching average rating",
            error: error.message
        });
    }
};
