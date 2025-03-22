import express from 'express';
import { processChatbotQuery } from '../controllers/chatbotController.js';

const router = express.Router();

// Chatbot query endpoint
router.post('/query', processChatbotQuery);

export default router;
