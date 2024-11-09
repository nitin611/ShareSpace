import express from 'express'
import {  jwtverification } from '../middlewares/authMiddleware.js';
import { createProductController, deleteProductController, getProductController, getSingleProduct, getUserProductController, productCountController, productFilterController, productListController, productPhotoController, searchProductController, updateProductController } from '../controllers/productController.js';
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

// get user specific products-
router.get("/get-userProduct/:userId",jwtverification,getUserProductController)

// get single product-
router.get("/get-product/:id",getSingleProduct)

// get photo-
router.get("/product-photo/:pid",productPhotoController)

// delete product-
router.delete("/delete-product/:pid",deleteProductController)

// filter routes-
router.post("/product-filter",productFilterController)

// product count- taki ek baar me sab product show na ho jab user click kare load more pe to aur product show ho-
router.get("/productCount",productCountController)


// product for page-
router.get("/productList/:page",productListController)

// search the product-
router.get("/searchProduct/:keyword",searchProductController)



export default router