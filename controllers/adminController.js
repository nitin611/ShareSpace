import userModel from "../models/userModel.js";

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
  export const deleteUser = async (req, res) => {
    try {
      const { userId } = req.params;
      const deletedUser = await userModel.findByIdAndDelete(userId);
  
      if (!deletedUser) {
        return res.status(404).send({ success: false, msg: "User not found" });
      }
  
      return res.status(200).send({
        success: true,
        msg: "User deleted successfully",
        data: deletedUser
      });
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        success: false,
        msg: err.message
      });
    }
  };
  
  