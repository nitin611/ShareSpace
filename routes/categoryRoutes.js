import express from "express";
import { isAdmin ,jwtverification} from "../middlewares/authMiddleware.js";
import { categoriesController, createCategoryController, deleteCategoryController, singleCategoryController, updateCategoryController } from "../controllers/createCategoryController.js";
import { deleteUser, getAllUsers, searchUsers,viewUserDetails } from "../controllers/adminController.js";

const router =express.Router()

// create category route-
router.post('/create-category',jwtverification,isAdmin,createCategoryController)

// update category routes-

router.put('/update-category/:id',jwtverification,isAdmin,updateCategoryController);

// get all categories-

router.get('/getCategories',categoriesController);

// single categories controller-
router.get('/singleCategory/:id',singleCategoryController);

// delete category by id-
router.delete('/delete-category/:id',jwtverification,isAdmin,deleteCategoryController);

// -----------------------------------------Manage User in Admin Panel---------------------------
// get all user details in admin panel-

router.get("/allUsers",jwtverification,isAdmin,getAllUsers);
router.get("/searchUsers",jwtverification,isAdmin, searchUsers);
router.delete("/deleteUsers/:userId",jwtverification,isAdmin, deleteUser);

// ---------------------------------------manage individual user in admin panel------------------------
router.get("/userDetails/:id",jwtverification,isAdmin,viewUserDetails)


export default router