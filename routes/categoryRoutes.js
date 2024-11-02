import express from "express";
import { isAdmin ,jwtverification} from "../middlewares/authMiddleware.js";
import { categoriesController, createCategoryController, deleteCategoryController, singleCategoryController, updateCategoryController } from "../controllers/createCategoryController.js";

const router =express.Router()

// routes-
// create category route-
router.post('/create-category',jwtverification,isAdmin,createCategoryController)
// update category routes-
router.put('/update-category/:id',jwtverification,isAdmin,updateCategoryController)
// get all categories-
router.get('/getCategories',categoriesController)

// single categories controller-
router.get('/singleCategory/:id',singleCategoryController)

// delete category by id-
router.delete('/delete-category/:id',jwtverification,isAdmin,deleteCategoryController)

export default router