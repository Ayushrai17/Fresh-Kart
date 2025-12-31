import api from './api';

export const subscriptionService = {
  getSubscriptions: async () => {
    const response = await api.get('/subscriptions');
    return response.data;
  },

  createSubscription: async (subscriptionData) => {
    const response = await api.post('/subscriptions', subscriptionData);
    return response.data;
  },

  updateSubscription: async (id, updateData) => {
    const response = await api.put(`/subscriptions/${id}`, updateData);
    return response.data;
  },

  deleteSubscription: async (id) => {
    const response = await api.delete(`/subscriptions/${id}`);
    return response.data;
  },
};

