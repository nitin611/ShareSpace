const Point = require('../models/pointModel');

export const getUserPoints = async (req, res) => {
    const { userId } = req.params;
    try {
      const userPoints = await Point.findOne({ userId }).populate('history.productId', 'name');
  
      if (!userPoints) {
        return res.status(404).json({ message: 'User points not found.' });
      }
  
      return res.status(200).json({
        totalPoints: userPoints.totalPoints,
        history: userPoints.history,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching user points.', error });
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
    userPoints.history.push({ action, points, productId });

    await userPoints.save();

    return res.status(200).json({
      message: 'Points added successfully.',
      totalPoints: userPoints.totalPoints,
      history: userPoints.history,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error adding points.', error });
  }
};


  const deductPoints = async (req, res) => {
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
      userPoints.history.push({ action, points: -points, productId });
  
      await userPoints.save();
  
      return res.status(200).json({
        message: 'Points deducted successfully.',
        totalPoints: userPoints.totalPoints,
        history: userPoints.history,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Error deducting points.', error });
    }
  };
  