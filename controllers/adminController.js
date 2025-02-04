import userModel from "../models/userModel.js";
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import Order from '../models/orderModel.js';
import Chat from '../models/messageModel.js'


export const getAllUsers = async (req, res) => {
    try {
      const users = await userModel.find({}, 'name email collegeId'); // ✅ Fetch only necessary fields
      return res.status(200).send({
        success: true,
        msg: "All users fetched successfully",
        users
      });
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        success: false,
        msg: err.message
      });
    }
  };

// -----------------------------search users-------------------------

  export const searchUsers = async (req, res) => {
    try {
      const { query } = req.query; 
  
      const users = await userModel.find({
        $or: [
          { name: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } },
          { collegeId: { $regex: query, $options: "i" } }
        ]
      });
  
      return res.status(200).send({
        success: true,
        msg: "Users fetched based on search",
        data: users
      });
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        success: false,
        msg: err.message
      });
    }
  };


// ------------------------------------delete user--------------------

// Assuming you have imported your models:-
/**
 * 
 * 
 * Delete all orders where the user is the buyer.
 * @param {String} userId - The id of the user.
 */
async function deleteChat(orderIds){
  await Chat.deleteMany({ order: { $in: orderIds } });
}
async function deleteUserOrders(userId) {

  // Delete orders where the user is the buyer (orders placed by the user)
  const orders=await Order.find({buyer:userId});
  const orderIds=orders.map(order=>order._id)
  await deleteChat(orderIds);
  await Order.deleteMany({ buyer: userId });
}

/**
 * Delete orders associated with the given product IDs.
 * These orders include products created by the user (orders the user received as a seller).
 * @param {Array} productIds - Array of product ObjectIds.
 */
async function deleteOrdersForProducts(productIds) {
  if (productIds.length > 0) {
    await Order.deleteMany({ products: { $in: productIds } });
  }
}

/**
 * Delete all products created by the user.
 * Also deletes orders associated with those products.
 * @param {String} userId - The id of the user.
 */
async function deleteUserProducts(userId) {
  // Find all products created by the user
  const products = await Product.find({ userId });
  
  // Extract the product IDs for deletion in orders
  const productIds = products.map(product => product._id);
  const orders = await Order.find({ products: { $in: productIds } });
  const orderIds = orders.map(order => order._id);
  await deleteChat(orderIds)

  
  // Delete orders that contain these products
  await deleteOrdersForProducts(productIds);
  
  // Delete the products themselves
  await Product.deleteMany({ userId });
}

/**
 * Delete a user and all related data (products and orders).
 * This is the controller that you would call (for example, in your Express route).
 */
export const deleteUser=async(req, res) =>{
  try {
    const userId = req.params.userId;  // Correct
    console.log(userId);
    
    // First, delete orders placed by the user
    await deleteUserOrders(userId);
    
    // Then, delete the products (and orders associated with these products)
    await deleteUserProducts(userId);
    
    // Finally, delete the user
    const deletedUser = await User.findByIdAndDelete(userId);
    
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json({ message: "User, their products, and associated orders have been deleted." });
  } catch (error) {
    console.error("Error deleting user and related data:", error);
    res.status(500).json({ error: error.message });
  }
}

// module.exports = {deleteUser};



  
  