import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createSubscription } from '../redux/slices/subscriptionSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Calendar, Package, RefreshCw } from 'lucide-react';

const SubscriptionModal = ({ product, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    quantity: 1,
    interval: 7, // Default weekly
    startDate: new Date().toISOString().split('T')[0],
    autoRenew: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await dispatch(
        createSubscription({
          productId: product._id,
          ...formData,
        })
      ).unwrap();
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setFormData({
          quantity: 1,
          interval: 7,
          startDate: new Date().toISOString().split('T')[0],
          autoRenew: true,
        });
      }, 2000);
    } catch (err) {
      setError(err || 'Failed to create subscription');
    } finally {
      setLoading(false);
    }
  };

  const intervalOptions = [
    { value: 7, label: 'Weekly (7 days)' },
    { value: 14, label: 'Bi-weekly (14 days)' },
    { value: 30, label: 'Monthly (30 days)' },
    { value: 60, label: 'Bi-monthly (60 days)' },
    { value: 90, label: 'Quarterly (90 days)' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            {success ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <CheckCircle className="w-12 h-12 text-emerald-600" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Subscription Created!
                </h3>
                <p className="text-gray-600">
                  Your subscription for {product.name} has been set up successfully.
                </p>
              </motion.div>
            ) : (
              <>
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-6 rounded-t-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">Subscribe to Product</h2>
                        <p className="text-emerald-100 text-sm">{product.name}</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={onClose}
                      className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </motion.button>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* Quantity */}
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                      <Package className="w-4 h-4" />
                      <span>Quantity</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          quantity: parseInt(e.target.value) || 1,
                        })
                      }
                      className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  {/* Delivery Interval */}
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                      <RefreshCw className="w-4 h-4" />
                      <span>Delivery Interval</span>
                    </label>
                    <select
                      value={formData.interval}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          interval: parseInt(e.target.value),
                        })
                      }
                      className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      required
                    >
                      {intervalOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-2">
                      Or enter custom days:
                      <input
                        type="number"
                        min="1"
                        placeholder="Custom days"
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (value > 0) {
                            setFormData({ ...formData, interval: value });
                          }
                        }}
                        className="ml-2 border border-gray-300 rounded px-2 py-1 w-24 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </p>
                  </div>

                  {/* Start Date */}
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>Start Date</span>
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                      className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  {/* Auto Renew */}
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      id="autoRenew"
                      checked={formData.autoRenew}
                      onChange={(e) =>
                        setFormData({ ...formData, autoRenew: e.target.checked })
                      }
                      className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                    />
                    <label htmlFor="autoRenew" className="text-sm text-gray-700">
                      Auto-renew subscription
                    </label>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
                    >
                      {error}
                    </motion.div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <motion.button
                      type="button"
                      onClick={onClose}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 bg-gray-100 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: loading ? 1 : 1.02 }}
                      whileTap={{ scale: loading ? 1 : 0.98 }}
                      className="flex-1 bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg hover:shadow-xl"
                    >
                      {loading ? 'Creating...' : 'Subscribe'}
                    </motion.button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SubscriptionModal;
