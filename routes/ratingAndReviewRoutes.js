import express from "express";
import { jwtverification } from "../middlewares/authMiddleware";
const router=express.Router();


// posting rating and review-
router.post("/postReviews",jwtverification,createRating)


