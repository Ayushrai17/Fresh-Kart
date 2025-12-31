import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');

    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [] });
    }

    res.json(cart);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ message: 'Please provide productId and quantity' });
    }

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [] });
    }

    // Check if item already in cart
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      // Update quantity
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    await cart.populate('items.productId');

    res.json(cart);
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update cart item
// @route   PUT /api/cart/update
// @access  Private
export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ message: 'Please provide productId and quantity' });
    }

    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      await cart.save();
      await cart.populate('items.productId');
      res.json(cart);
    } else {
      res.status(404).json({ message: 'Item not found in cart' });
    }
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:productId
// @access  Private
export const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== req.params.productId
    );

    await cart.save();
    await cart.populate('items.productId');

    res.json(cart);
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart/clear
// @access  Private
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    await cart.save();

    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

