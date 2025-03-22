import axios from 'axios';
import productModel from '../models/productModel.js';
import { ENV } from '../utils/loadEnv.js';
import userModel from '../models/userModel.js';
import RatingAndReview from '../models/RatingAndReview.js';

const GEMINI_API_KEY = ENV.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent';

// Helper function to get product data for context
const getProductsData = async () => {
  try {
    // Get all products with their details
    const products = await productModel.find({})
      .select("-photo")
      .populate("category")
      .populate("userId", "name email phone ratings")
      .lean();

    // Get ratings for each product
    const productsWithRatings = await Promise.all(
      products.map(async (product) => {
        const ratings = await RatingAndReview.find({ productId: product._id });
        const avgRating = ratings.length > 0 
          ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length 
          : 0;
        
        return {
          ...product,
          avgRating: avgRating.toFixed(1),
          ratingCount: ratings.length,
          inStock: product.quantity > 0
        };
      })
    );

    return productsWithRatings;
  } catch (error) {
    console.error("Error fetching products data for chatbot:", error);
    return [];
  }
};

// Process user query and generate response
export const processChatbotQuery = async (req, res) => {
  try {
    const { query, productId } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Query is required"
      });
    }

    // Get product data for context
    let contextData = [];
    let specificProduct = null;

    if (productId) {
      // If on product detail page, get specific product
      specificProduct = await productModel.findById(productId)
        .select("-photo")
        .populate("category")
        .populate("userId", "name email phone ratings")
        .lean();

      if (specificProduct) {
        const ratings = await RatingAndReview.find({ productId });
        const avgRating = ratings.length > 0 
          ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length 
          : 0;
        
        specificProduct.avgRating = avgRating.toFixed(1);
        specificProduct.ratingCount = ratings.length;
        specificProduct.inStock = specificProduct.quantity > 0;
      }
    } else {
      // If on home page, get all products
      contextData = await getProductsData();
    }

    // Create context for Gemini
    const context = specificProduct 
      ? JSON.stringify({ currentProduct: specificProduct })
      : JSON.stringify({ availableProducts: contextData });

    // Create prompt for Gemini
    const prompt = `
    You are a helpful shopping assistant for ShareSpace, a marketplace for college students.
    
    ${specificProduct 
      ? `You are currently helping with questions about this specific product: ${specificProduct.name}`
      : `You have information about all products currently available on the platform.`}
    
    Here is the current data about ${specificProduct ? 'the product' : 'all products'} (in JSON format):
    ${context}
    
    User question: ${query}
    
    Please provide a helpful, conversational response to the user's question. 
    
    If they're asking about product availability, price, description, ratings, or seller information, 
    use the provided data to give accurate information.
    
    If they're asking about comparisons between products, recommend the best option based on 
    ratings, price, and availability.
    
    If they're asking something you don't have information about, politely explain what you can help with.
    
    Format your response in a structured way:
    1. Start with a brief, friendly greeting or acknowledgment of their question
    2. Present key information in bullet points or numbered lists when appropriate
    3. Use markdown formatting for emphasis when highlighting important details
    4. End with a brief conclusion or follow-up suggestion
    
    Keep your response concise (under 150 words) and friendly, as if you're chatting with a college student.
    Format your response in a conversational way, not as JSON.
    `;

    // Call Gemini API
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { 
          temperature: 0.2,
          maxOutputTokens: 800
        }
      }
    );

    // Extract and return the response
    const chatbotResponse = response.data.candidates[0].content.parts[0].text;

    return res.status(200).json({
      success: true,
      response: chatbotResponse
    });

  } catch (error) {
    console.error("Error in chatbot processing:", error);
    return res.status(500).json({
      success: false,
      message: "Error processing your question. Please try again.",
      error: error.message
    });
  }
};
