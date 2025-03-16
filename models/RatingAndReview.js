import mongoose from "mongoose";
import userModel from './userModel.js';
import productModel from './productModel.js';

const ratingAndReviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users"  // Matches your userModel collection name
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Products"  // Matches your productModel collection name
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    review: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true });

export default mongoose.model("RatingAndReview", ratingAndReviewSchema);