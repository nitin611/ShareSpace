import express from 'express';
import { jwtverification } from '../middlewares/authMiddleware.js';
import { 
    createRating, 
    getProductReviews, 
    updateReview, 
    deleteReview,
    getProductAverageRating 
} from '../controllers/RatingAndReview.js';

const router = express.Router();

// Create a new rating
router.post('/create', jwtverification, createRating);

// Get all reviews for a product
router.get('/product/:productId', getProductReviews);

// Get average rating for a product
router.get('/product/:productId/average', getProductAverageRating);

// Update a review
router.put('/:reviewId', jwtverification, updateReview);

// Delete a review
router.delete('/:reviewId', jwtverification, deleteReview);

export default router;
