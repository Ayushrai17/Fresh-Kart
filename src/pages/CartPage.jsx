import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, updateCartItem, removeCartItem } from '../redux/slices/cartSlice';
import Loading from '../components/Loading';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    dispatch(fetchCart());
  }, [dispatch, isAuthenticated, navigate]);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      dispatch(removeCartItem(productId));
    } else {
      dispatch(updateCartItem({ productId, quantity: newQuantity }));
    }
  };

  const handleRemove = (productId) => {
    if (window.confirm('Remove item from cart?')) {
      dispatch(removeCartItem(productId));
    }
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const price = item.productId?.price || 0;
      return total + price * item.quantity;
    }, 0);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600">
            {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </motion.div>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-white rounded-2xl shadow-md"
          >
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
            <Link
              to="/products"
              className="inline-block bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Browse Products
            </Link>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="md:col-span-2 space-y-4">
              <AnimatePresence>
                {items.map((item, index) => (
                  <motion.div
                    key={item.productId._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-2xl shadow-md p-6 flex flex-col sm:flex-row gap-4 hover:shadow-lg transition-shadow"
                  >
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.productId.image || 'https://via.placeholder.com/100'}
                        alt={item.productId.name}
                        className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {item.productId.name}
                      </h3>
                      <p className="text-emerald-600 font-bold text-xl mb-4">
                        ₹{item.productId.price}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 border border-gray-300 rounded-lg">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              handleQuantityChange(item.productId._id, item.quantity - 1)
                            }
                            className="p-2 hover:bg-gray-100 rounded-l-lg"
                          >
                            <Minus className="w-4 h-4" />
                          </motion.button>
                          <span className="w-12 text-center font-semibold">
                            {item.quantity}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              handleQuantityChange(item.productId._id, item.quantity + 1)
                            }
                            className="p-2 hover:bg-gray-100 rounded-r-lg"
                          >
                            <Plus className="w-4 h-4" />
                          </motion.button>
                        </div>

                        <button
                          onClick={() => handleRemove(item.productId._id)}
                          className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Total Price */}
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">Subtotal</p>
                      <p className="text-xl font-bold text-gray-900">
                        ₹{(item.productId.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <div className="md:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-md p-6 sticky top-24"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({items.length} items)</span>
                    <span className="font-semibold">₹{calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-semibold text-emerald-600">Free</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-emerald-600">
                        ₹{calculateTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                <Link
                  to="/checkout"
                  className="block w-full bg-emerald-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/products"
                  className="block w-full text-center mt-4 text-gray-600 hover:text-emerald-600 transition-colors"
                >
                  Continue Shopping
                </Link>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
