import express from "express";
import { buyerSend,sellerSend,getAllMessages}  from "../controllers/chatController.js";
import { jwtverification } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create a new chat message
// Buyer is sending message to Seller-
router.post("/BuyerSend/:orderId",jwtverification, buyerSend);

// Seller is sending message to buyer-

router.post("/SellerSend/:orderId",jwtverification,sellerSend);

// fetch message from database-
router.get("/chats/:orderId",jwtverification, getAllMessages);



export default router;
