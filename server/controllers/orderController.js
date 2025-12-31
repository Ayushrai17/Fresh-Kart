import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate('items.productId')
      .populate('subscriptionId')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.productId')
      .populate('subscriptionId');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns the order or is admin
    if (order.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, subscriptionId } = req.body;

    // If items not provided, use cart
    let orderItems = items;
    if (!orderItems) {
      const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' });
      }
      orderItems = cart.items.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.productId.price,
      }));
    }

    // Calculate total
    let totalAmount = 0;
    for (const item of orderItems) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }
      totalAmount += item.price * item.quantity;
    }

    // Create order
    const order = await Order.create({
      userId: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress: shippingAddress || req.user.addresses.find((a) => a.isDefault) || {},
      subscriptionId: subscriptionId || null,
    });

    // Clear cart if order created from cart
    if (!items) {
      await Cart.findOneAndUpdate({ userId: req.user._id }, { items: [] });
    }

    await order.populate('items.productId');
    await order.populate('userId', 'name email');

    // Emit notification to admin
    const io = req.app.get('io');
    if (io) {
      // Emit to admin room
      io.to('admin').emit('newOrder', {
        orderId: order._id,
        userName: order.userId.name,
        totalAmount: order.totalAmount,
        timestamp: new Date(),
        type: 'order',
      });
    }

    res.status(201).json(order);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

