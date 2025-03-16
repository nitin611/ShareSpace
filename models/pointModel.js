const mongoose = require('mongoose');

const PointSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },

  totalPoints: {
    type: Number,
    default: 0,
  },

  history: [
    {
      action:{ 
        type: String,
     required: true
     }, // e.g., 'Product Listed', 'Validation Failed', 'Product Delivered'
      points: { type: Number, required: true }, // Positive or negative points
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // Optional if related to a product
      date: { type: Date, default: Date.now },
    },
  ],

});



module.exports = mongoose.model('Point', PointSchema);
