import mongoose from "mongoose";

const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
      },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',  // Lowercase 'category' to match export
        required: true
    },
    
    quantity:{
        type:Number,
        required:true
        
    },
    // photo ko aws me store karne ke liye-
    photo:{
        data:Buffer,
        contentType:String,

    },
    // order status show karne ke liye-
    shipping:{
        type:Boolean,

    }

},{timestamps:true});

export default mongoose.model("Products",productSchema);