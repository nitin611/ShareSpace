import express from 'express'
import {  jwtverification } from '../middlewares/authMiddleware.js';
import { createProductController, deleteProductController, getProductController, getSingleProduct, productPhotoController, updateProductController } from '../controllers/productController.js';
import formidable from 'express-formidable'

const router=express.Router();

// routes creation-
// creating the product
// formidable ka use photo upload me hota hai ye ek npm package hai-
router.post("/create-product",jwtverification,formidable(),createProductController)

// updating the products-
router.put("/updating-product/:pid",jwtverification,formidable(),updateProductController)

// get all products-
router.get("/get-product",getProductController)

// get single product-
router.get("/get-product/:id",getSingleProduct)

// get photo-
router.get("/product-photo/:pid",productPhotoController)

// delete product-
router.delete("/delete-product/:pid",deleteProductController)



export default router