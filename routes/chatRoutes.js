import express from "express";
import {createMessage,getMessages,updateMessage,deleteMessage}  from "../controllers/chatController.js";



import { jwtverification } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create a new chat message
router.post("/chats",jwtverification, createMessage);

// Get chat messages between two users
router.get("/chats/:sender/:receiver",jwtverification, getMessages);

// Update a message (e.g., mark as read)
router.put("/chats/:id",jwtverification, updateMessage);

// Delete a message
router.delete("/chats/:id", jwtverification, deleteMessage);

export default router;
