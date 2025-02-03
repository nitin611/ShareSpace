import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", 
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", 
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
  },
  { timestamps: true } 
);

export default mongoose.model("Chat", chatSchema);
