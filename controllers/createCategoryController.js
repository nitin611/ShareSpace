import categoryModel from "../models/categoryModel.js";

export const createCategoryController=async(req,res)=>{
    try {
        const {name} = req.body
        if(!name){
            return res.status(401).send({
                msg:'Name is required'
            })
        }
            // check existing category ek naam se 2 category na banjaye-
            const existingCategory=await categoryModel.findOne({name})
            if(existingCategory){
                return res.status(200).send({
                    success:true,
                    msg:'Category already exists'
                })
            }
            // agar category nahi mili to-
            const category =await new categoryModel({name}).save();
            res.status(201).send({
                success:true,
                category,
                msg:'new category created'
            })
        

    } catch (err) {
        console.log(err)
        res.status(500).send({
            success:false,
            err,
            msg:'Error in category'
        })
    }
}

// update the cateogy-
export const updateCategoryController=async(req,res)=>{
    try {
        const {name}=req.body
        const {id}=req.params
        const category=await categoryModel.findByIdAndUpdate(
            id,
            {name},
            {new:true}
        );
        res.status(200).send({
            success:true,
            msg:'category updated successfully',
            category
        })
    } catch (err) {
        console.log(err)
        res.status(500).send({
            success:false,
            err,
            msg:"error while updating the category"
        })
    }
}

// delete the category-
export const deleteCategoryController=async(req,res)=>{
    try {
        const {id}=req.params
        const category =await categoryModel.findByIdAndDelete(id)
        res.status(200).send({
            success:true,
            msg:"category deleted successfully",
           
        })
    } catch (err) {
        res.status(500).send({
            success:false,
            msg:"Error in deleting the category"
        })
    }
}

// get  all categories -
export const categoriesController=async(req,res)=>{
    try {
        const category =await categoryModel.find({})
        res.status(200).send({
            success:true,
            msg:'All Categories',
            category
        })
    } catch (err) {
        console.log(err)
        res.status(500).send({
            success:false,
            err,
            msg:'err while fetching all categroies'
        })
    }
}

// get single category-
export const singleCategoryController=async(req,res)=>{
    try {
        const {id}=req.params.id
        const category =await categoryModel.findOne({id})
        res.status(200).send({
            success:true,
            msg:"Get single category successfully",
            category
        })
    } catch (err) {
        res.status(500).send({
            success:false,
            msg:"cannot get single category"
        })
    }
}
