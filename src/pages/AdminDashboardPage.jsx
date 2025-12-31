import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { io } from 'socket.io-client';
import { adminService } from '../services/adminService';
import { productService } from '../services/productService';
import Loading from '../components/Loading';
import {
  LayoutDashboard,
  Bell,
  Users,
  Package,
  ShoppingBag,
  TrendingUp,
  IndianRupee,
  Pause,
  Play,
  Ban,
  Edit,
  Trash2,
  UserCircle,
} from 'lucide-react';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

const AdminDashboardPage = () => {
  const { user } = useSelector((state) => state.user);

  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    stock: '',
    subscriptionEligible: true,
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);

  // ---- Socket.IO: admin notifications ----
  useEffect(() => {
    if (!user || user.role !== 'admin') return;

    const socket = io(SOCKET_URL);
    socket.emit('joinAdminRoom');

    const pushNotification = (type, message, payload) => {
      setNotifications((prev) => [
        {
          id: Date.now() + Math.random(),
          type,
          message,
          payload,
          createdAt: new Date().toISOString(),
        },
        ...prev.slice(0, 19),
      ]);
    };

    socket.on('newOrder', (data) => {
      pushNotification('order', `New order from ${data.userName || 'user'}`, data);
      fetchStats();
      if (activeTab === 'orders') fetchOrders();
    });

    socket.on('newSubscription', (data) => {
      pushNotification(
        'subscription',
        `New subscription by ${data.userName || 'user'}`,
        data
      );
      fetchStats();
      if (activeTab === 'subscriptions') fetchSubscriptions();
    });

    socket.on('orderStatusUpdated', (data) => {
      pushNotification(
        'order',
        `Order ${data.orderId?.slice(-6)} status updated to ${data.status}`,
        data
      );
      if (activeTab === 'orders') fetchOrders();
    });

    socket.on('subscriptionStatusUpdated', (data) => {
      pushNotification(
        'subscription',
        `Subscription status updated to ${data.status}`,
        data
      );
      if (activeTab === 'subscriptions') fetchSubscriptions();
    });

    return () => {
      socket.disconnect();
    };
  }, [user, activeTab]);

  // ---- Initial data load ----
  useEffect(() => {
    fetchStats();
    fetchTabData('overview');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchTabData(activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const data = await adminService.getStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch admin stats', err);
    }
  };

  const fetchOrders = async () => {
    try {
      const data = await adminService.getAllOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch orders', err);
    }
  };

  const fetchSubscriptions = async () => {
    try {
      const data = await adminService.getAllSubscriptions();
      setSubscriptions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch subscriptions', err);
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await productService.getProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch products', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await adminService.getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  };

  const fetchTabData = async (tab) => {
    setLoading(true);
    try {
      if (tab === 'orders') await fetchOrders();
      else if (tab === 'subscriptions') await fetchSubscriptions();
      else if (tab === 'products') await fetchProducts();
      else if (tab === 'users') await fetchUsers();
    } finally {
      setLoading(false);
    }
  };

  // ---- Actions ----
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...productForm,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
      };

      if (editingProduct) {
        await productService.updateProduct(editingProduct._id, payload);
      } else {
        await productService.createProduct(payload);
      }

      setShowProductForm(false);
      setEditingProduct(null);
      setProductForm({
        name: '',
        description: '',
        price: '',
        image: '',
        category: '',
        stock: '',
        subscriptionEligible: true,
      });
      fetchProducts();
      fetchStats();
    } catch (err) {
      console.error('Failed to save product', err);
      alert('Failed to save product');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price ?? '',
      image: product.image || '',
      category: product.category || '',
      stock: product.stock ?? '',
      subscriptionEligible: product.subscriptionEligible ?? true,
    });
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await productService.deleteProduct(id);
      fetchProducts();
      fetchStats();
    } catch (err) {
      console.error('Failed to delete product', err);
      alert('Failed to delete product');
    }
  };

  const handleOrderStatusChange = async (orderId, status) => {
    try {
      await adminService.updateOrderStatus(orderId, status);
      fetchOrders();
      fetchStats();
    } catch (err) {
      console.error('Failed to update order status', err);
      alert('Failed to update order status');
    }
  };

  const handleSubscriptionStatusChange = async (subId, status) => {
    try {
      await adminService.updateSubscriptionStatus(subId, status);
      fetchSubscriptions();
      fetchStats();
    } catch (err) {
      console.error('Failed to update subscription status', err);
      alert('Failed to update subscription status');
    }
  };

  const handleStatCardClick = (key) => {
    if (key === 'users') setActiveTab('users');
    if (key === 'products') setActiveTab('products');
    if (key === 'orders') setActiveTab('orders');
    if (key === 'subscriptions') setActiveTab('subscriptions');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'subscriptions', label: 'Subscriptions', icon: TrendingUp },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'users', label: 'Users', icon: Users },
  ];

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Access denied. Admins only.</p>
      </div>
    );
  }

  if (loading && activeTab !== 'overview') {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 space-y-6">
        {/* Top bar inside dashboard (page title + notifications) */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-7 h-7 text-emerald-600" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-500 text-sm">Manage users, products, orders & subscriptions</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification bell */}
            <button
              onClick={() => setShowNotifications((prev) => !prev)}
              className="relative p-2 rounded-full bg-white shadow hover:shadow-md transition"
            >
              <Bell className="w-5 h-5 text-gray-700" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>

            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-full shadow">
              <UserCircle className="w-6 h-6 text-gray-700" />
              <span className="text-sm font-medium text-gray-800">{user.name}</span>
            </div>
          </div>
        </div>

        {/* Notification dropdown */}
        {showNotifications && (
          <div className="relative">
            <div className="absolute right-0 mt-2 w-full max-w-md ml-auto bg-white rounded-xl shadow-lg border border-gray-100 z-20">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <span className="font-semibold text-gray-900 text-sm">Notifications</span>
                <button
                  onClick={() => setNotifications([])}
                  className="text-xs text-emerald-600 hover:underline"
                >
                  Clear all
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="px-4 py-6 text-center text-sm text-gray-500">
                    No notifications yet
                  </p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className="px-4 py-3 border-b border-gray-50 hover:bg-gray-50 text-sm"
                    >
                      <p className="text-gray-900">{n.message}</p>
                      <p className="text-[11px] text-gray-500 mt-1">
                        {new Date(n.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Stats cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <StatCard
              title="Users"
              value={stats.totalUsers}
              icon={Users}
              onClick={() => handleStatCardClick('users')}
            />
            <StatCard
              title="Products"
              value={stats.totalProducts}
              icon={Package}
              onClick={() => handleStatCardClick('products')}
            />
            <StatCard
              title="Orders"
              value={stats.totalOrders}
              icon={ShoppingBag}
              onClick={() => handleStatCardClick('orders')}
            />
            <StatCard
              title="Active Subs"
              value={stats.totalSubscriptions}
              icon={TrendingUp}
              onClick={() => handleStatCardClick('subscriptions')}
            />
            <StatCard
              title="Revenue (₹)"
              value={stats.totalRevenue?.toFixed(0) ?? '0'}
              icon={IndianRupee}
              onClick={() => setActiveTab('overview')}
            />
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex overflow-x-auto border-b border-gray-100">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 md:px-6 py-3 text-sm font-medium whitespace-nowrap ${
                    isActive
                      ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50'
                      : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="p-4 md:p-6">
            {/* Overview */}
            {activeTab === 'overview' && (
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl p-6 text-white">
                <h2 className="text-lg font-semibold mb-1">Revenue Overview</h2>
                <p className="text-3xl font-bold">
                  ₹{stats?.totalRevenue?.toFixed(2) ?? '0.00'}
                </p>
                <p className="text-xs text-emerald-100 mt-1">
                  Includes all non-cancelled orders.
                </p>
              </div>
            )}

            {/* Orders */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">All Orders</h2>
                {orders.length === 0 ? (
                  <EmptyState icon={ShoppingBag} title="No orders yet" />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <Th>Order ID</Th>
                          <Th>User</Th>
                          <Th>Products</Th>
                          <Th>Total (₹)</Th>
                          <Th>Status</Th>
                          <Th>Date</Th>
                          <Th>Actions</Th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {orders.map((order) => (
                          <tr key={order._id} className="bg-white">
                            <Td>#{order._id?.slice(-6)}</Td>
                            <Td>
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {order.userId?.name || 'Unknown'}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {order.userId?.email}
                                </span>
                              </div>
                            </Td>
                            <Td>
                              <div className="space-y-1">
                                {(order.items || []).map((item) => (
                                  <p key={item._id} className="text-xs text-gray-700">
                                    {item.productId?.name || 'Product'} x {item.quantity}
                                  </p>
                                ))}
                              </div>
                            </Td>
                            <Td>₹{order.totalAmount?.toFixed?.(2) ?? order.totalAmount}</Td>
                            <Td>
                              <StatusBadge status={order.status} />
                            </Td>
                            <Td>
                              {order.createdAt
                                ? new Date(order.createdAt).toLocaleDateString()
                                : '-'}
                            </Td>
                            <Td>
                              <div className="flex flex-wrap gap-2">
                                {order.status === 'pending' && (
                                  <>
                                    <ActionButton
                                      label="Confirm"
                                      variant="primary"
                                      onClick={() =>
                                        handleOrderStatusChange(order._id, 'confirmed')
                                      }
                                    />
                                    <ActionButton
                                      label="Cancel"
                                      variant="danger"
                                      onClick={() =>
                                        handleOrderStatusChange(order._id, 'cancelled')
                                      }
                                    />
                                  </>
                                )}
                                {order.status === 'confirmed' && (
                                  <ActionButton
                                    label="Mark Delivered"
                                    variant="primary"
                                    onClick={() =>
                                      handleOrderStatusChange(order._id, 'delivered')
                                    }
                                  />
                                )}
                              </div>
                            </Td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Subscriptions */}
            {activeTab === 'subscriptions' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">All Subscriptions</h2>
                {subscriptions.length === 0 ? (
                  <EmptyState icon={TrendingUp} title="No subscriptions yet" />
                ) : (
                  <div className="space-y-3">
                    {subscriptions.map((sub) => (
                      <div
                        key={sub._id}
                        className="bg-white border border-gray-100 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                      >
                        <div>
                          <p className="font-semibold text-gray-900">
                            {sub.productId?.name || 'Product'}
                          </p>
                          <p className="text-xs text-gray-600">
                            {sub.userId?.name} • {sub.userId?.email}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            Qty: {sub.quantity} • Interval: {sub.interval} days
                          </p>
                          <p className="text-xs text-gray-600">
                            Next delivery:{' '}
                            {sub.nextDeliveryDate
                              ? new Date(sub.nextDeliveryDate).toLocaleDateString()
                              : '-'}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <StatusBadge status={sub.status} />
                          <div className="flex flex-wrap gap-2 justify-end">
                            {sub.status === 'active' && (
                              <ActionButton
                                label="Pause"
                                icon={Pause}
                                variant="warning"
                                onClick={() =>
                                  handleSubscriptionStatusChange(sub._id, 'paused')
                                }
                              />
                            )}
                            {sub.status === 'paused' && (
                              <ActionButton
                                label="Resume"
                                icon={Play}
                                variant="primary"
                                onClick={() =>
                                  handleSubscriptionStatusChange(sub._id, 'active')
                                }
                              />
                            )}
                            {sub.status !== 'cancelled' && (
                              <ActionButton
                                label="Cancel"
                                icon={Ban}
                                variant="danger"
                                onClick={() =>
                                  handleSubscriptionStatusChange(sub._id, 'cancelled')
                                }
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Products */}
            {activeTab === 'products' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Products</h2>
                  <button
                    onClick={() => {
                      setEditingProduct(null);
                      setProductForm({
                        name: '',
                        description: '',
                        price: '',
                        image: '',
                        category: '',
                        stock: '',
                        subscriptionEligible: true,
                      });
                      setShowProductForm(true);
                    }}
                    className="px-4 py-2 rounded-md bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700"
                  >
                    Add Product
                  </button>
                </div>

                {showProductForm && (
                  <div className="bg-white border border-gray-100 rounded-lg p-4 space-y-3">
                    <form onSubmit={handleProductSubmit} className="space-y-3">
                      <div className="grid md:grid-cols-2 gap-3">
                        <TextInput
                          label="Name"
                          value={productForm.name}
                          onChange={(e) =>
                            setProductForm({ ...productForm, name: e.target.value })
                          }
                          required
                        />
                        <TextInput
                          label="Price (₹)"
                          type="number"
                          value={productForm.price}
                          onChange={(e) =>
                            setProductForm({ ...productForm, price: e.target.value })
                          }
                          required
                        />
                      </div>
                      <TextArea
                        label="Description"
                        value={productForm.description}
                        onChange={(e) =>
                          setProductForm({ ...productForm, description: e.target.value })
                        }
                        required
                      />
                      <div className="grid md:grid-cols-2 gap-3">
                        <TextInput
                          label="Image URL"
                          value={productForm.image}
                          onChange={(e) =>
                            setProductForm({ ...productForm, image: e.target.value })
                          }
                        />
                        <TextInput
                          label="Category"
                          value={productForm.category}
                          onChange={(e) =>
                            setProductForm({ ...productForm, category: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-3">
                        <TextInput
                          label="Stock"
                          type="number"
                          value={productForm.stock}
                          onChange={(e) =>
                            setProductForm({ ...productForm, stock: e.target.value })
                          }
                          required
                        />
                        <div className="flex items-center gap-2 mt-6">
                          <input
                            id="subscriptionEligible"
                            type="checkbox"
                            checked={productForm.subscriptionEligible}
                            onChange={(e) =>
                              setProductForm({
                                ...productForm,
                                subscriptionEligible: e.target.checked,
                              })
                            }
                            className="w-4 h-4 text-emerald-600 border-gray-300 rounded"
                          />
                          <label
                            htmlFor="subscriptionEligible"
                            className="text-sm text-gray-700"
                          >
                            Subscription eligible
                          </label>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="submit"
                          className="px-4 py-2 rounded-md bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700"
                        >
                          {editingProduct ? 'Update Product' : 'Create Product'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowProductForm(false);
                            setEditingProduct(null);
                          }}
                          className="px-4 py-2 rounded-md bg-gray-100 text-sm font-medium text-gray-700 hover:bg-gray-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {products.length === 0 ? (
                  <EmptyState icon={Package} title="No products yet" />
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((product) => {
                      const outOfStock = (product.stock ?? 0) <= 0;
                      return (
                        <div
                          key={product._id}
                          className="bg-white border border-gray-100 rounded-lg p-4 flex flex-col gap-3"
                        >
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {product.name}
                              </h3>
                              <p className="text-xs text-gray-500">
                                {product.category || 'Uncategorised'}
                              </p>
                            </div>
                            {outOfStock && (
                              <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-red-50 text-red-700">
                                Out of stock
                              </span>
                            )}
                          </div>
                          <p className="text-emerald-600 font-semibold text-sm">
                            ₹{product.price}
                          </p>
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {product.description}
                          </p>
                          <p className="text-xs text-gray-500">
                            Stock: {product.stock ?? 0}
                          </p>
                          <p className="text-xs text-gray-500">
                            Subscription:{' '}
                            {product.subscriptionEligible ? 'Eligible' : 'Not eligible'}
                          </p>
                          <div className="mt-2 flex gap-2">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-md bg-blue-50 text-blue-700 text-xs font-medium hover:bg-blue-100"
                            >
                              <Edit className="w-3 h-3" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product._id)}
                              className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-md bg-red-50 text-red-700 text-xs font-medium hover:bg-red-100"
                            >
                              <Trash2 className="w-3 h-3" />
                              Delete
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Users */}
            {activeTab === 'users' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Users</h2>
                {users.length === 0 ? (
                  <EmptyState icon={Users} title="No users yet" />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <Th>Name</Th>
                          <Th>Email</Th>
                          <Th>Role</Th>
                          <Th>Joined</Th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {users.map((u) => (
                          <tr key={u._id} className="bg-white">
                            <Td>{u.name}</Td>
                            <Td>{u.email}</Td>
                            <Td className="capitalize">{u.role}</Td>
                            <Td>
                              {u.createdAt
                                ? new Date(u.createdAt).toLocaleDateString()
                                : '-'}
                            </Td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ---- Small UI helpers ----
const StatCard = ({ title, value, icon: Icon, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3 text-left hover:shadow-md transition flex flex-col gap-1"
  >
    <div className="flex items-center justify-between">
      <p className="text-xs text-gray-500">{title}</p>
      {Icon && <Icon className="w-4 h-4 text-emerald-600" />}
    </div>
    <p className="text-lg font-semibold text-gray-900 truncate">{value}</p>
  </button>
);

const StatusBadge = ({ status }) => {
  const s = status || 'unknown';
  let classes = 'bg-gray-100 text-gray-700';
  if (s === 'pending' || s === 'active') classes = 'bg-yellow-100 text-yellow-800';
  if (s === 'confirmed') classes = 'bg-blue-100 text-blue-800';
  if (s === 'delivered') classes = 'bg-emerald-100 text-emerald-800';
  if (s === 'cancelled' || s === 'paused') classes = 'bg-red-100 text-red-700';

  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium ${classes}`}>
      {s}
    </span>
  );
};

const EmptyState = ({ icon: Icon, title }) => (
  <div className="py-10 flex flex-col items-center justify-center text-center text-gray-500">
    {Icon && <Icon className="w-10 h-10 mb-3 text-gray-300" />}
    <p className="text-sm">{title}</p>
  </div>
);

const Th = ({ children }) => (
  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
    {children}
  </th>
);

const Td = ({ children }) => (
  <td className="px-3 py-2 align-top text-xs text-gray-800 whitespace-nowrap">{children}</td>
);

const ActionButton = ({ label, icon: Icon, variant = 'primary', onClick }) => {
  const base = 'px-3 py-1 rounded-md text-[11px] font-medium inline-flex items-center gap-1';
  const colors =
    variant === 'danger'
      ? 'bg-red-50 text-red-700 hover:bg-red-100'
      : variant === 'warning'
      ? 'bg-yellow-50 text-yellow-800 hover:bg-yellow-100'
      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100';
  return (
    <button type="button" onClick={onClick} className={`${base} ${colors}`}>
      {Icon && <Icon className="w-3 h-3" />}
      {label}
    </button>
  );
};

const TextInput = ({ label, ...props }) => (
  <div className="space-y-1">
    <label className="text-xs font-medium text-gray-700">{label}</label>
    <input
      {...props}
      className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
    />
  </div>
);

const TextArea = ({ label, ...props }) => (
  <div className="space-y-1">
    <label className="text-xs font-medium text-gray-700">{label}</label>
    <textarea
      rows={3}
      {...props}
      className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
    />
  </div>
);

export default AdminDashboardPage;


