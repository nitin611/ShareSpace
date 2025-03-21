import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {

    products: [
      {
        type: mongoose.ObjectId,
        ref: "Products",
      },
    ],
    
   
    buyer: {
      type: mongoose.ObjectId,
      ref: "users",
    },

    status: {
      type: String,
      default: "Not Process",
      enum: ["Not Process", "Processing", "Shipped", "Delivered", "Cancelled"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);