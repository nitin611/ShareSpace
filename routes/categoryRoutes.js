import express from "express";
import { isAdmin ,jwtverification} from "../middlewares/authMiddleware";

const router =express.Router()

// routes-
router.post('create-category',jwtverification,isAdmin,)