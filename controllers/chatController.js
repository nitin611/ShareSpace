
import ChatModel from "../models/messageModel.js"
import orderModel from "../models/orderModel.js";

// message is sent from buyer to seller-
export const  buyerSend = async (req, res) => {
    try {
      const senderId=req.user._id;
      const orderId = req.params.orderId;

      const {message} = req.body;
      const order=await orderModel.findById(orderId).populate('products');
      if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }
      const receiverId = order.products[0].userId;
      
  
      if (!senderId || !receiverId || !message) {
        return res.status(400).json({ success: false, message: "All fields are required" });
      }
      const newMessage = new ChatModel({
        sender: senderId,
        receiver: receiverId,
        message,
        order: order._id

      });
      await newMessage.save();
  
      return res.status(201).json({
        success: true,
        data: newMessage,
        
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  // sending message from seller to buyer-
  export const sellerSend = async (req, res) => {
    try {
      const senderId = req.user._id;
      const orderId = req.params.orderId;
      const { message } = req.body;
  
      const order = await orderModel.findById(orderId).populate('products');
  
      if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }
  
      const receiverId = order.buyer; // Ensure 'buyer' exists in the order schema
      console.log(receiverId);
  
      const newMessage = new ChatModel({
        sender: senderId,
        receiver: receiverId,
        message,
        order: order._id

      });
  
      await newMessage.save();
  
      return res.status(200).json({
        success: true,
        data: newMessage,
       
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  
  // fetching all messages of same orderId-
export const getAllMessages=async(req,res)=>{
  try {
    // take order id from params-
    const {orderId}=req.params;
    const allMessages=await ChatModel.find({ order: orderId })
    return res.status(200).send({
      success:true,
      msg:"All messages fetched for this orderId",
      data:allMessages
    });
  } catch (err) {
    console.log(err)
    return res.status(500).send({
      success:false,
      msg:err.message
    })
    
  }
}





  
  
  