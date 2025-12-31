import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, clearCartLocal } from '../redux/slices/cartSlice';
import { orderService } from '../services/orderService';
import Loading from '../components/Loading';
import { motion } from 'framer-motion';
import { CheckCircle, MapPin, Package, CreditCard, ArrowRight } from 'lucide-react';

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
    if (user?.addresses?.length > 0) {
      const defaultAddress = user.addresses.find((a) => a.isDefault) || user.addresses[0];
      setFormData({
        street: defaultAddress.street || '',
        city: defaultAddress.city || '',
        state: defaultAddress.state || '',
        zipCode: defaultAddress.zipCode || '',
        country: defaultAddress.country || '',
      });
    }
  }, [items, user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        shippingAddress: formData,
      };
      await orderService.createOrder(orderData);
      dispatch(clearCartLocal());
      navigate('/dashboard');
      alert('Order placed successfully!');
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const price = item.productId?.price || 0;
      return total + price * item.quantity;
    }, 0);
  };

  const steps = [
    { id: 1, name: 'Shipping Address', icon: MapPin },
    { id: 2, name: 'Order Summary', icon: Package },
    { id: 3, name: 'Payment', icon: CreditCard },
  ];

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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your order in a few simple steps</p>
        </motion.div>

        {/* Steps Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep >= step.id;
              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        isActive
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-200 text-gray-500'
                      } transition-colors`}
                    >
                      {isActive ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </motion.div>
                    <span
                      className={`mt-2 text-sm font-medium ${
                        isActive ? 'text-emerald-600' : 'text-gray-500'
                      }`}
                    >
                      {step.name}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-4 ${
                        currentStep > step.id ? 'bg-emerald-600' : 'bg-gray-200'
                      } transition-colors`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Shipping Address Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-md p-6"
          >
            <div className="flex items-center space-x-2 mb-6">
              <MapPin className="w-6 h-6 text-emerald-600" />
              <h2 className="text-xl font-semibold text-gray-900">Shipping Address</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>
            </form>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Package className="w-6 h-6 text-emerald-600" />
                <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
              </div>
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div
                    key={item.productId._id}
                    className="flex justify-between items-center pb-4 border-b border-gray-200"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.productId.image || 'https://via.placeholder.com/50'}
                        alt={item.productId.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{item.productId.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-gray-900">
                      ₹{(item.productId.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{calculateTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-emerald-600 font-semibold">Free</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-emerald-600">
                    ₹{calculateTotal().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-emerald-600 text-white py-4 rounded-lg font-semibold hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>Place Order</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
