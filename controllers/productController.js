import productModel from '../models/productModel.js';
import fs from 'fs';

// crud operation on products-
export const createProductController = async (req, res) => {
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

        const product = new productModel({ ...req.fields });
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
        const products=await productModel.find({}).select("-photo").populate("category").limit(12).sort({createdAt:-1});
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

// get single product-
export const getSingleProduct=async(req,res)=>{
    try {
        const {id}=req.params.id
        const product=await productModel.findOne({id}).select("-photo").populate("category")
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

// delete product-
export const deleteProductController=async(req,res)=>{
    try {
        await productModel.findByIdAndDelete(req.params.pid).select("-photo");
        res.status(200).send({
            success:true,
            msg:"product deleted successfully"
        });
    } catch (err) {
        console.log(err)
        res.status(500).send({
            success:false,
            msg:"error in deleting the product"
        })
    }
}

// update product-
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