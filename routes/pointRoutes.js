import express from 'express';
import { getUserPoints } from '../controllers/pointController.js';
import {  jwtverification } from '../middlewares/authMiddleware.js';
const router = express.Router();

// Get user points
router.get('/:userId', jwtverification, getUserPoints);

export default router;
