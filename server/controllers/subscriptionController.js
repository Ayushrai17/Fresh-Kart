import Subscription from '../models/Subscription.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';

// @desc    Get user subscriptions
// @route   GET /api/subscriptions
// @access  Private
export const getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ userId: req.user._id })
      .populate('productId')
      .sort({ createdAt: -1 });

    res.json(subscriptions);
  } catch (error) {
    console.error('Get subscriptions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create subscription
// @route   POST /api/subscriptions
// @access  Private
export const createSubscription = async (req, res) => {
  try {
    const { productId, quantity, interval, startDate, autoRenew } = req.body;

    // Validation
    if (!productId || !quantity || !interval) {
      return res.status(400).json({ message: 'Please provide productId, quantity, and interval' });
    }

    // Verify product exists and is subscription eligible
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (!product.subscriptionEligible) {
      return res.status(400).json({ message: 'Product is not subscription eligible' });
    }

    // Calculate next delivery date
    const start = startDate ? new Date(startDate) : new Date();
    const nextDeliveryDate = new Date(start);
    nextDeliveryDate.setDate(nextDeliveryDate.getDate() + interval);

    // Create subscription
    const subscription = await Subscription.create({
      userId: req.user._id,
      productId,
      quantity,
      interval,
      nextDeliveryDate,
      startDate: start,
      autoRenew: autoRenew !== undefined ? autoRenew : true,
      status: 'active',
    });

    await subscription.populate('productId');
    await subscription.populate('userId', 'name email');

    // Emit notification to admin
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('newSubscription', {
        subscriptionId: subscription._id,
        userName: subscription.userId.name,
        productName: subscription.productId.name,
        timestamp: new Date(),
        type: 'subscription',
      });
    }

    res.status(201).json(subscription);
  } catch (error) {
    console.error('Create subscription error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update subscription (pause/resume/cancel)
// @route   PUT /api/subscriptions/:id
// @access  Private
export const updateSubscription = async (req, res) => {
  try {
    const { status, interval, quantity, autoRenew } = req.body;

    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    // Check ownership
    if (subscription.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update fields
    if (status) {
      subscription.status = status;
      // If resuming, recalculate next delivery date
      if (status === 'active' && subscription.status === 'paused') {
        const today = new Date();
        subscription.nextDeliveryDate = new Date(today);
        subscription.nextDeliveryDate.setDate(today.getDate() + subscription.interval);
      }
    }
    if (interval) {
      subscription.interval = interval;
    }
    if (quantity) {
      subscription.quantity = quantity;
    }
    if (autoRenew !== undefined) {
      subscription.autoRenew = autoRenew;
    }

    await subscription.save();
    await subscription.populate('productId');

    res.json(subscription);
  } catch (error) {
    console.error('Update subscription error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete subscription
// @route   DELETE /api/subscriptions/:id
// @access  Private
export const deleteSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    // Check ownership
    if (subscription.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Subscription.findByIdAndDelete(req.params.id);

    res.json({ message: 'Subscription deleted successfully' });
  } catch (error) {
    console.error('Delete subscription error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Process subscriptions (called by cron job)
// @route   Internal
export const processSubscriptions = async (io) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find active subscriptions due for delivery
    const subscriptions = await Subscription.find({
      status: 'active',
      nextDeliveryDate: { $lte: today },
    }).populate('productId').populate('userId');

    for (const subscription of subscriptions) {
      try {
        // Get user's default address
        const user = await User.findById(subscription.userId);
        const defaultAddress = user.addresses.find((a) => a.isDefault) || user.addresses[0] || {};

        // Create order
        const order = await Order.create({
          userId: subscription.userId._id,
          items: [
            {
              productId: subscription.productId._id,
              quantity: subscription.quantity,
              price: subscription.productId.price,
            },
          ],
          totalAmount: subscription.productId.price * subscription.quantity,
          shippingAddress: defaultAddress,
          subscriptionId: subscription._id,
        });

        // Update next delivery date
        if (subscription.autoRenew) {
          const nextDate = new Date(subscription.nextDeliveryDate);
          nextDate.setDate(nextDate.getDate() + subscription.interval);
          subscription.nextDeliveryDate = nextDate;
          await subscription.save();
        } else {
          subscription.status = 'cancelled';
          await subscription.save();
        }

        // Emit notification
        if (io) {
          io.to(subscription.userId._id.toString()).emit('subscriptionOrderCreated', {
            subscriptionId: subscription._id,
            orderId: order._id,
            message: `Your subscription order has been created for ${subscription.productId.name}`,
          });
        }

        console.log(`Order created for subscription ${subscription._id}`);
      } catch (error) {
        console.error(`Error processing subscription ${subscription._id}:`, error);
      }
    }

    console.log(`Processed ${subscriptions.length} subscriptions`);
  } catch (error) {
    console.error('Process subscriptions error:', error);
  }
};

