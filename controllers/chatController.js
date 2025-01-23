
import ChatModel from "../models/messageModel.js"

export const createMessage = async (req, res) => {
    try {
      const { sender, receiver, message } = req.body;
  
      if (!sender || !receiver || !message) {
        return res.status(400).json({ success: false, message: "All fields are required" });
      }
      const newMessage = new ChatModel({ sender, receiver, message });
      await newMessage.save();
  
      res.status(201).json({
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
  export const getMessages = async (req, res) => {
    try {
      const senderId=req.user._id;
      const productId=req.body
      
  
      const messages = await ChatModel.find({
        $or: [
          { sender, receiver },
          { sender: receiver, receiver: sender },
        ],
      })
        .sort({ createdAt: 1 }) // Sort messages by creation time
        .populate("sender", "name email") // Populate sender details
        .populate("receiver", "name email"); // Populate receiver details
  
      res.status(200).json({
        success: true,
        data: messages,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  export const updateMessage = async (req, res) => {
    try {
      const { id } = req.params;
  
      const updatedMessage = await ChatModel.findByIdAndUpdate(
        id,
        { read: true },
        { new: true }
      );
  
      if (!updatedMessage) {
        return res.status(404).json({ success: false, message: "Message not found" });
      }
  
      res.status(200).json({
        success: true,
        data: updatedMessage,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  export const deleteMessage = async (req, res) => {
    try {
      const { id } = req.params;
  
      const deletedMessage = await ChatModel.findByIdAndDelete(id);
  
      if (!deletedMessage) {
        return res.status(404).json({ success: false, message: "Message not found" });
      }
  
      res.status(200).json({
        success: true,
        message: "Message deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };


// app.get('/api/products/:productId', async (req, res) => {
//   try {
//     const product = await productModel
//       .findById(req.params.productId)
//       .populate('userId', 'name email'); // Include the owner's name and email
//     res.status(200).json({ success: true, product });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

  
  
  