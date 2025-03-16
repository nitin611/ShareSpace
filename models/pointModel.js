import mongoose from 'mongoose';

const pointSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  history: [{
    action: {
      type: String,
      required: true
    },
    points: {
      type: Number,
      required: true
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'product'
    },
    date: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });

// Add index for faster queries
pointSchema.index({ userId: 1 });

const Point = mongoose.model('point', pointSchema);

export default Point;
