import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", // Reference to the users model
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", // Reference to the users model
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    order:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Order"
    },
    read: {
      type: Boolean,
      default: false, 
    },
  },
  { timestamps: true } 
);

export default mongoose.model("Chat", chatSchema);
