import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSubscriptions, updateSubscription } from '../redux/slices/subscriptionSlice';
import { orderService } from '../services/orderService';
import Loading from '../components/Loading';
import { motion } from 'framer-motion';
import {
  Package,
  Calendar,
  Pause,
  Play,
  X,
  User,
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { subscriptions } = useSelector((state) => state.subscriptions);
  const { user } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState('subscriptions');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchSubscriptions());
    fetchOrders();
  }, [dispatch]);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscriptionAction = async (id, action) => {
    try {
      const updateData = {};
      if (action === 'pause') updateData.status = 'paused';
      if (action === 'resume') updateData.status = 'active';
      if (action === 'cancel') updateData.status = 'cancelled';

      await dispatch(updateSubscription({ id, updateData })).unwrap();
      await dispatch(fetchSubscriptions());
      alert(`Subscription ${action}d successfully`);
    } catch (error) {
      alert('Failed to update subscription: ' + (error || 'Unknown error'));
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      paused: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
    };
    return styles[status] || styles.active;
  };

  const getOrderStatusBadge = (status) => {
    const styles = {
      delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      processing: 'bg-blue-100 text-blue-800 border-blue-200',
    };
    return styles[status] || styles.pending;
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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}!</p>
        </motion.div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-md mb-6 overflow-hidden">
          <div className="flex border-b border-gray-200">
            {[
              { id: 'subscriptions', label: 'My Subscriptions', icon: Package },
              { id: 'orders', label: 'My Orders', icon: ShoppingBag },
              { id: 'profile', label: 'Profile', icon: User },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 font-semibold transition-colors ${
                    activeTab === tab.id
                      ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50'
                      : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Subscriptions Tab */}
        {activeTab === 'subscriptions' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">My Subscriptions</h2>
            {subscriptions.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">You have no active subscriptions</p>
              </div>
            ) : (
              subscriptions.map((sub, index) => (
                <motion.div
                  key={sub._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {sub.productId?.name}
                      </h3>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Package className="w-4 h-4" />
                          <span>Quantity: {sub.quantity}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>Interval: Every {sub.interval} days</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>
                            Next Delivery:{' '}
                            {new Date(sub.nextDeliveryDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`inline-block mt-3 px-4 py-1 rounded-full text-sm font-semibold border ${getStatusBadge(
                          sub.status
                        )}`}
                      >
                        {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {sub.status === 'active' && (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleSubscriptionAction(sub._id, 'pause')}
                            className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-600 transition-colors flex items-center space-x-2"
                          >
                            <Pause className="w-4 h-4" />
                            <span>Pause</span>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleSubscriptionAction(sub._id, 'cancel')}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center space-x-2"
                          >
                            <X className="w-4 h-4" />
                            <span>Cancel</span>
                          </motion.button>
                        </>
                      )}
                      {sub.status === 'paused' && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleSubscriptionAction(sub._id, 'resume')}
                          className="bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-600 transition-colors flex items-center space-x-2"
                        >
                          <Play className="w-4 h-4" />
                          <span>Resume</span>
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">My Orders</h2>
            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">You have no orders</p>
              </div>
            ) : (
              orders.map((order, index) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Order #{order._id.slice(-8)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-4 py-1 rounded-full text-sm font-semibold border ${getOrderStatusBadge(
                        order.status
                      )}`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <div className="space-y-2 mb-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-700">
                          {item.productId?.name} x {item.quantity}
                        </span>
                        <span className="font-semibold text-gray-900">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-emerald-600">
                      ₹{order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-md p-6"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Profile</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <p className="text-gray-900 font-medium text-lg">{user?.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <p className="text-gray-900 font-medium text-lg">{user?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <span className="inline-block px-4 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold capitalize">
                  {user?.role}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
