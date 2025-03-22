import fs from 'fs';
import FormData from 'form-data';
import Order from '../models/orderModel.js'
import Chat from '../models/messageModel.js'
import Point from '../models/pointModel.js'
import mongoose from 'mongoose';
import productModel from '../models/productModel.js';
import { validateProduct } from '../utils/geminiValidator.js';
import { ENV } from '../utils/loadEnv.js';

// crud operation on products-
export const createProductController = async (req, res) => {
    try {
        const { name, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;

        // Basic validation
        if (!name) return res.status(400).send({ success: false, msg: "Name is required" });
        if (!description) return res.status(400).send({ success: false, msg: "Description is required" });
        if (!price || isNaN(price) || price <= 0) return res.status(400).send({ success: false, msg: "Valid price is required" });
        if (!category || !mongoose.Types.ObjectId.isValid(category)) return res.status(400).send({ success: false, msg: "Valid category ID is required" });
        if (!quantity || isNaN(quantity) || quantity < 0) return res.status(400).send({ success: false, msg: "Valid quantity is required (must be 0 or positive)" });
        if (typeof shipping === 'undefined') return res.status(400).send({ success: false, msg: "Shipping information is required" });
        if (photo && photo.size > 1 * 1024 * 1024) {
            return res.status(400).send({ success: false, msg: "Photo size should be less than 1MB" });
        }

        // Validate product using AI
        try {
            console.log("Starting AI validation for product:", name);
            
            // Skip validation in development mode if needed
            if (ENV.SKIP_VALIDATION === 'true') {
                console.log("Skipping validation (SKIP_VALIDATION=true)");
            } else {
                const validationResult = await validateProduct(name, description, photo.path);
                console.log("AI validation result:", validationResult);
                
                if (!validationResult.isValid) {
                    // Deduct points for inappropriate content
                    let userPoints = await Point.findOne({ userId: req.user._id });
                    if (!userPoints) {
                        userPoints = new Point({ userId: req.user._id, totalPoints: 0, history: [] });
                    }
                    userPoints.totalPoints -= 20;
                    userPoints.history.push({
                        action: 'Inappropriate Product Listing',
                        points: -20,
                        date: new Date(),
                        reason: validationResult.concerns.join(', ')
                    });
                    await userPoints.save();

                    // Create a user-friendly message
                    let userMessage = "Your product couldn't be listed because it doesn't meet our community standards.";
                    
                    if (validationResult.concerns && validationResult.concerns.length > 0) {
                        userMessage += " Concerns: " + validationResult.concerns.join(', ');
                    }

                    return res.status(400).send({ 
                        success: false, 
                        msg: userMessage, 
                        details: {
                            textIssues: validationResult.textReason,
                            imageIssues: validationResult.imageReason,
                            concerns: validationResult.concerns
                        }
                    });
                }
            }

            // Create new product
            const userId = req.user._id;
            const product = new productModel({
                ...req.fields,
                userId,
                slug: name.toLowerCase().replace(/\s+/g, '-')
            });

            // Handle photo upload
            if (photo) {
                product.photo.data = fs.readFileSync(photo.path);
                product.photo.contentType = photo.type;
            }

            // Save product
            await product.save();
            
            // Add points based on conditions
            let pointsToAdd = 0;
            let pointMessage = '';

            if (parseFloat(price) === 0) {
                pointsToAdd += 100;
                pointMessage += '100 points for free product, ';
            }

            pointsToAdd += 20;
            pointMessage += '20 points for creating product';

            // Update user points
            let userPoints = await Point.findOne({ userId: req.user._id });
            if (!userPoints) {
                userPoints = new Point({ userId: req.user._id, totalPoints: 0, history: [] });
            }
            userPoints.totalPoints += pointsToAdd;
            userPoints.history.push({
                action: 'Product Created',
                points: pointsToAdd,
                productId: product._id,
                date: new Date()
            });
            await userPoints.save();
            
            return res.status(201).send({
                success: true,
                msg: "Product created successfully",
                product: {
                    _id: product._id,
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    category: product.category,
                    quantity: product.quantity,
                    shipping: product.shipping
                },
                pointsEarned: pointsToAdd,
                pointMessage
            });
        } catch (validationError) {
            console.error("Error in product validation:", validationError);
            return res.status(500).send({ 
                success: false, 
                msg: "We couldn't validate your product at this time. Please try again later.", 
                error: validationError.message 
            });
        }
    } catch (error) {
        console.error("Error in createProductController:", error);
        return res.status(500).send({
            success: false,
            msg: "Error creating product. Please try again.",
            error: error.message
        });
    }
};

// get all products-
export const getProductController=async(req,res)=>{
    try {
        // yaha photo ke liye alag se route bana lenge and usko alag se get karenge taki request time jada na lage and ek baar me 12 products ko show karegne createdAt ke basis pe sort kar ke-
        const products=await productModel.find({})
        .select("-photo")
        .populate("category")
        .populate("userId", "name email phone")
        .limit(12)
        .sort({createdAt:-1});
        res.status(200).send({
            success:true,
            TotalCount:products.length,
            msg:"All products",
            products
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            msg:"Error in getting all products",
            error:error.msg
        })
    }
};

// get user specific 
export const getUserProductController=async(req,res)=>{
    try {
        const userId = req.params.userId; 
        const products = await productModel.find({ userId: userId })
        .select("-photo")
        .populate("category")
        .populate("userId", "name email phone")
        .limit(12)
        .sort({ createdAt: -1 });

    res.status(200).send({
        success: true,
        TotalCount: products.length,
        msg: "User-specific products",
        products
    });
    } catch (err) {
        console.log(err)
        res.status(400).send({
            success:false,
            msg:"error in getting user-specific product"
        })
        
    }
}
// get single product-
export const getSingleProduct=async(req,res)=>{
    try {
        const id=req.params.id
        const product = await productModel.findById(id).select("-photo").populate("category") .populate("userId", "name email phone");;

        res.status(200).send({
            success:true,
            msg:'single product fetched',
            product

        })
    } catch (err) {
        console.log(err)
        res.status(500).send({
            
            success:false,
            msg:"Cannot get single product"
        })
    }
}

// get photo-
export const productPhotoController=async(req,res)=>{
    try {
        // bash photo select karna hai
        const product=await productModel.findById(req.params.pid).select("photo")
        if(product.photo.data){
            res.set('Content-type',product.photo.contentType)
            return res.status(200).send(product.photo.data);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({
            success:false,
            msg:"error while getting product photo",
            err
        })
    }
}

// ---------------------------------delete product---------------------------------------------
// Delete Chats Associated with Orders
async function deleteChatsForProduct(orderIds) {
    await Chat.deleteMany({ order: { $in: orderIds } });
  }
  
  // Delete Orders Associated with the Product
  async function deleteOrdersForProduct(productId) {
    const orders = await Order.find({ products: productId });
    const orderIds = orders.map(order => order._id);
  
    await deleteChatsForProduct(orderIds);
    await Order.deleteMany({ products: productId });
  
    // Check if orders are deleted
    const remainingOrders = await Order.find({ products: productId });
    if (remainingOrders.length > 0) return false;
  
    return true;
  }
  
  // Final Delete Product Controller
  export const deleteProductController = async (req, res) => {
    try {
      const productId = req.params.pid;
      
      // First, find the product to get the user ID before deleting
      const product = await productModel.findById(productId);
      
      if (!product) {
        return res.status(404).send({
          success: false,
          msg: "Product not found"
        });
      }
      
      // Store the userId from the product
      const userId = product.userId;
      
      // Delete related orders and chats
      const ordersDeleted = await deleteOrdersForProduct(productId);
  
      // Check if all orders are deleted before deleting the product
      if (!ordersDeleted) {
        return res.status(400).json({
          success: false,
          msg: "Failed to delete associated orders or chats.",
        });
      }
     
      // Delete the product
      await productModel.findByIdAndDelete(productId);
        
      // Deduct points for deleting product if userId exists
      if (userId) {
        try {
          let userPoints = await Point.findOne({ userId: userId });
          if (!userPoints) {
            userPoints = new Point({ userId: userId, totalPoints: 0, history: [] });
          }
          userPoints.totalPoints -= 10;
          userPoints.history.push({
            action: 'Product Deleted',
            points: -10,
            productId: productId,
            date: new Date()
          });
          await userPoints.save();
        } catch (pointsError) {
          console.error("Error updating points:", pointsError);
          // Continue with deletion even if points update fails
        }
      }

      res.status(200).send({
        success: true,
        msg: "Product deleted successfully",
        pointsDeducted: 10
      });
    } catch (err) {
      console.error("Error in deleteProductController:", err);
      res.status(500).send({
        success: false,
        msg: "Error while deleting product",
        error: err.message
      });
    }
  };
  




//---------------------------------------- update product------------------
export const updateProductController=async(req,res)=>{
    try {
        const { name, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;

        // Validation-
        if (!name) return res.status(400).send({ success: false, msg: "Name is required" });
        if (!description) return res.status(400).send({ success: false, msg: "Description is required" });
        if (!price || isNaN(price) || price <= 0) return res.status(400).send({ success: false, msg: "Valid price is required" });
        if (!category || !mongoose.Types.ObjectId.isValid(category)) return res.status(400).send({ success: false, msg: "Valid category ID is required" });
        if (!quantity || isNaN(quantity) || quantity < 0) return res.status(400).send({ success: false, msg: "Valid quantity is required (must be 0 or positive)" });
        if (typeof shipping === 'undefined') return res.status(400).send({ success: false, msg: "Shipping information is required" });
        if (photo && photo.size > 1 * 1024 * 1024) { // 1MB limit
            return res.status(400).send({ success: false, msg: "Photo size should be less than 1MB" });
        }

        // Get current product to verify quantity change
        const currentProduct = await productModel.findById(req.params.pid);
        if (!currentProduct) {
            return res.status(404).send({ success: false, msg: "Product not found" });
        }

        const product = await productModel.findByIdAndUpdate(
            req.params.pid,
            { ...req.fields },
            { new: true }
        );

        if (photo) {
            product.photo.data = fs.readFileSync(photo.path);
            product.photo.contentType = photo.type;
        }

        await product.save();
        res.status(200).send({
            success: true,
            msg: "Product updated successfully",
            product
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            msg: "Error in updating the product"
        });
    }
}

// fileter the products-

export const productFilterController=async(req,res)=>{
    try {
        const {checked,radio}=req.body;
        let args={};
        if(checked.length>0)args.category=checked;
        if(radio.length)args.price={$gte:radio[0],$lte:radio[1]};
        const products=await productModel.find(args);
        
        res.status(200).send({
            success:true,
            products,
        })
    } catch (err) {
        console.log(err)
        res.status(500).send({
            msg:"Error in filtering product"
        })
    }
}

// product count-
export const productCountController=async(req,res)=>{
    try {
        const total=await productModel.find({}).estimatedDocumentCount();
        res.status(200).send({
            success:true,
            total
        })
    } catch (err) {
        console.log(err)
        res.status(400).send({
            msg:"errror in product count",
            err,
            success:false
        })
    }
}


// product list page ke basis pe-
export const productListController = async (req, res) => {
    try {
      const perPage = 8;
      const page = req.params.page ? parseInt(req.params.page) : 1;
  
      const products = await productModel
        .find({})
        .select("-photo")
        .skip((page - 1) * perPage)
        .limit(perPage)
        .sort({ createdAt: -1 });
  
      res.status(200).send({
        success: true,
        products,
      });
    } catch (err) {
      console.log(err);
      res.status(400).send({
        success: false,
        msg: "Error in getting product per page",
        err,
      });
    }
  };


// search the product-
export const searchProductController=async(req,res)=>{
    try {
        const {keyword}=req.params;
        // yahape name or description ke basis pe search kar rahe hai product ko keyword basis pe -
        // i means alphabaticaal order do not matter in this-
        const results=await productModel.find({
            $or:[
                {name:{$regex:keyword,$options:"i"}},
                { description: { $regex: keyword, $options: "i" } },
            ],
        }).select("-photo");
        res.json(results);
    } catch (err) {
        console.log(err)
        res.status(400).send({
            success:false,
            err
        })
    }
}