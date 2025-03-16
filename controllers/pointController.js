import Point from '../models/pointModel.js';
import mongoose from 'mongoose';
import productModel from '../models/productModel.js';

export const getUserPoints = async (req, res) => {
    const { userId } = req.params;
    try {
      const userPoints = await Point.findOne({ userId })
        .populate({
          path: 'history.productId',
          select: 'name description price',
          model: productModel
        })
        .sort({ 'history.date': -1 }); // Sort history by date descending
  
      if (!userPoints) {
        return res.status(200).json({ 
          totalPoints: 0,
          history: []
        });
      }
  
      // Sort history array by date in descending order
      const sortedHistory = userPoints.history.sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      );
  
      return res.status(200).json({
        totalPoints: userPoints.totalPoints,
        history: sortedHistory
      });
    } catch (error) {
      console.error("Error in getUserPoints:", error);
      return res.status(500).json({ 
        message: 'Error fetching user points.',
        error: error.message 
      });
    }
};

export const addPoints = async (req, res) => {
  const { userId, action, points, productId } = req.body;

  try {
    let userPoints = await Point.findOne({ userId });

    if (!userPoints) {
      userPoints = new Point({ userId, totalPoints: 0, history: [] });
    }

    // Update total points and add history
    userPoints.totalPoints += points;
    userPoints.history.push({
      action,
      points,
      productId,
      date: new Date()
    });

    await userPoints.save();

    // Get the updated points with populated product details
    const updatedPoints = await Point.findById(userPoints._id)
      .populate({
        path: 'history.productId',
        select: 'name description price',
        model: productModel
      });

    return res.status(200).json({
      message: 'Points added successfully.',
      totalPoints: updatedPoints.totalPoints,
      history: updatedPoints.history.sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      ),
      pointsAdded: points
    });
  } catch (error) {
    console.error("Error in addPoints:", error);
    return res.status(500).json({ 
      message: 'Error adding points.',
      error: error.message 
    });
  }
};

export const deductPoints = async (req, res) => {
  const { userId, action, points, productId } = req.body;

  try {
    const userPoints = await Point.findOne({ userId });

    if (!userPoints) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Ensure points cannot go negative
    if (userPoints.totalPoints < points) {
      return res.status(400).json({ message: 'Insufficient points.' });
    }

    // Deduct points and add history
    userPoints.totalPoints -= points;
    userPoints.history.push({
      action,
      points: -points,
      productId,
      date: new Date()
    });

    await userPoints.save();

    // Get the updated points with populated product details
    const updatedPoints = await Point.findById(userPoints._id)
      .populate({
        path: 'history.productId',
        select: 'name description price',
        model: productModel
      });

    return res.status(200).json({
      message: 'Points deducted successfully.',
      totalPoints: updatedPoints.totalPoints,
      history: updatedPoints.history.sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      ),
      pointsDeducted: points
    });
  } catch (error) {
    console.error("Error in deductPoints:", error);
    return res.status(500).json({ 
      message: 'Error deducting points.',
      error: error.message 
    });
  }
};