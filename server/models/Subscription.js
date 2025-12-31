import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    interval: {
      type: Number, // Interval in days
      required: true,
      min: 1,
    },
    nextDeliveryDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'paused', 'cancelled'],
      default: 'active',
    },
    autoRenew: {
      type: Boolean,
      default: true,
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
subscriptionSchema.index({ userId: 1, status: 1 });
subscriptionSchema.index({ nextDeliveryDate: 1, status: 1 });

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;

