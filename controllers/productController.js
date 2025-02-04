import productModel from '../models/productModel.js';
import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';
import Order from '../models/orderModel.js'
import Chat from '../models/messageModel.js'
import Product from '../models/productModel.js'


// crud operation on products-
export const createProductController = async (req, res) => {
    try {
        const { name, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;

        // Validation
        if (!name) return res.status(400).send({ success: false, msg: "Name is required" });
        if (!description) return res.status(400).send({ success: false, msg: "Description is required" });
        if (!price || isNaN(price) || price <= 0) return res.status(400).send({ success: false, msg: "Valid price is required" });
        if (!category) return res.status(400).send({ success: false, msg: "Category is required" });
        if (!quantity || isNaN(quantity) || quantity <= 0) return res.status(400).send({ success: false, msg: "Valid quantity is required" });
        if (typeof shipping === 'undefined') return res.status(400).send({ success: false, msg: "Shipping information is required" });
        if (photo && photo.size > 1 * 1024 * 1024) {
            return res.status(400).send({ success: false, msg: "Photo size should be less than 1MB" });
        }

        // Compliance Check
        const formData = new FormData();
        formData.append('photo', fs.createReadStream(photo.path), {
            filename: photo.name,
            contentType: photo.type || 'image/jpeg' // set MIME type explicitly
        }); // Use fs.createReadStream for file input
        formData.append('description', description);
        formData.append('name', name);

        const complianceResponse = await axios.post(
            'https://service-api-ljg7.onrender.com/check_compliance',
            formData,
            { headers: { ...formData.getHeaders() } }
        );

        if (!complianceResponse.data.compliant) {
            return res.status(400).send({ success: false, msg: "Product does not meet compliance standards" });
        }

        // Create product
        const userId = req.user._id;
        const product = new productModel({ ...req.fields, userId });
        if (photo) {
            product.photo.data = fs.readFileSync(photo.path);
            product.photo.contentType = photo.type;
        }
        
        await product.save();
        
        res.status(200).send({
            success: true,
            msg: "Product created successfully",
            product
        });
    } catch (err) {
        console.error("Error in creating product:", err); // Log error for debugging
        res.status(500).send({
            success: false,
            msg: 'Error in creating product',
            error: err.message
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
  
      //  Delete related orders and chats
      const ordersDeleted = await deleteOrdersForProduct(productId);
  
    //    Check if all orders are deleted before deleting the product
      if (!ordersDeleted) {
        return res.status(400).json({
          success: false,
          msg: "Failed to delete associated orders or chats.",
        });
      }
  
     
      const deletedProduct = await Product.findByIdAndDelete(productId).select("-photo");
      if (!deletedProduct) {
        return res.status(404).json({
          success: false,
          msg: "Product not found.",
        });
      }
  
      res.status(200).json({
        success: true,
        msg: "Product, associated orders, and chats deleted successfully.",
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        msg: "Error in deleting the product.",
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
        if (!category) return res.status(400).send({ success: false, msg: "Category is required" });
        if (!quantity || isNaN(quantity) || quantity <= 0) return res.status(400).send({ success: false, msg: "Valid quantity is required" });
        if (typeof shipping === 'undefined') return res.status(400).send({ success: false, msg: "Shipping information is required" });
        if (photo && photo.size > 1 * 1024 * 1024) { // 1MB limit
            return res.status(400).send({ success: false, msg: "Photo size should be less than 1MB" });
        }

        const product = await productModel.findByIdAndUpdate(req.params.pid,{
            ...req.fields},{new:true}
        )
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
        console.log(err)
        res.status(500).send({
            success:false,
            msg:"error in updating the product"
        })
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
  