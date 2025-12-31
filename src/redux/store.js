import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import cartReducer from './slices/cartSlice';
import subscriptionReducer from './slices/subscriptionSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
    subscriptions: subscriptionReducer,
  },
});

