import User from '../models/User.js';
import Subscription from '../models/Subscription.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

// Get io instance for notifications
const getIO = (req) => {
  return req.app.get('io');
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all subscriptions
// @route   GET /api/admin/subscriptions
// @access  Private/Admin
export const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({})
      .populate('userId', 'name email')
      .populate('productId')
      .sort({ createdAt: -1 });

    res.json(subscriptions);
  } catch (error) {
    console.error('Get subscriptions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get admin stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalSubscriptions = await Subscription.countDocuments({ status: 'active' });

    const totalRevenue = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalSubscriptions,
      totalRevenue: totalRevenue[0]?.total || 0,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('userId', 'name email')
      .populate('items.productId')
      .populate('subscriptionId')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'confirmed', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findById(req.params.id).populate('userId', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    // Emit notification to user + admin
    const io = getIO(req);
    if (io && order.userId) {
      io.to(order.userId._id.toString()).emit('orderStatusUpdated', {
        orderId: order._id,
        status: status,
        message: `Your order status has been updated to ${status}`,
      });

      io.to('admin').emit('orderStatusUpdated', {
        orderId: order._id,
        status,
        userName: order.userId.name,
        totalAmount: order.totalAmount,
        timestamp: new Date(),
      });
    }

    await order.populate('items.productId');
    await order.populate('subscriptionId');

    res.json(order);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update subscription status
// @route   PUT /api/admin/subscriptions/:id/status
// @access  Private/Admin
export const updateSubscriptionStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['active', 'paused', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const subscription = await Subscription.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('productId');

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    // If resuming, recalculate next delivery date
    if (status === 'active' && subscription.status === 'paused') {
      const today = new Date();
      subscription.nextDeliveryDate = new Date(today);
      subscription.nextDeliveryDate.setDate(today.getDate() + subscription.interval);
    }

    subscription.status = status;
    await subscription.save();

    // Emit notification to user + admin
    // Emit notification to user + admin
    const io = getIO(req);
    if (io && subscription.userId) {
      io.to(subscription.userId._id.toString()).emit('subscriptionStatusUpdated', {
        subscriptionId: subscription._id,
        status: status,
        message: `Your subscription status has been updated to ${status}`,
      });

      io.to('admin').emit('subscriptionStatusUpdated', {
        subscriptionId: subscription._id,
        status,
        userName: subscription.userId.name,
        productName: subscription.productId?.name,
        timestamp: new Date(),
      });
    }

    res.json(subscription);
  } catch (error) {
    console.error('Update subscription status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

