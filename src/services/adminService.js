import api from './api';

export const adminService = {
  getUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  getAllSubscriptions: async () => {
    const response = await api.get('/admin/subscriptions');
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  getAllOrders: async () => {
    const response = await api.get('/admin/orders');
    return response.data;
  },

  updateOrderStatus: async (orderId, status) => {
    const response = await api.put(`/admin/orders/${orderId}/status`, { status });
    return response.data;
  },

  updateSubscriptionStatus: async (subscriptionId, status) => {
    const response = await api.put(`/admin/subscriptions/${subscriptionId}/status`, { status });
    return response.data;
  },
};

