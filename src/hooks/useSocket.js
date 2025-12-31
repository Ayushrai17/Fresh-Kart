import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSubscriptions } from '../redux/slices/subscriptionSlice';
import { fetchCart } from '../redux/slices/cartSlice';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const useSocket = () => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const socket = io(SOCKET_URL);

    // Join user's personal room
    socket.emit('joinUserRoom', user._id);

    // Listen for subscription order created
    socket.on('subscriptionOrderCreated', (data) => {
      console.log('Subscription order created:', data);
      // Refresh subscriptions and cart
      dispatch(fetchSubscriptions());
      dispatch(fetchCart());
      // You can also show a toast notification here
      alert(data.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [isAuthenticated, user, dispatch]);
};

