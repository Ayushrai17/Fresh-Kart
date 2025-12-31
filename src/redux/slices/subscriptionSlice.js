import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { subscriptionService } from '../../services/subscriptionService';

// Async thunks
export const fetchSubscriptions = createAsyncThunk(
  'subscriptions/fetchSubscriptions',
  async (_, { rejectWithValue }) => {
    try {
      const data = await subscriptionService.getSubscriptions();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch subscriptions');
    }
  }
);

export const createSubscription = createAsyncThunk(
  'subscriptions/create',
  async (subscriptionData, { rejectWithValue }) => {
    try {
      const data = await subscriptionService.createSubscription(subscriptionData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create subscription');
    }
  }
);

export const updateSubscription = createAsyncThunk(
  'subscriptions/update',
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const data = await subscriptionService.updateSubscription(id, updateData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update subscription');
    }
  }
);

export const deleteSubscription = createAsyncThunk(
  'subscriptions/delete',
  async (id, { rejectWithValue }) => {
    try {
      await subscriptionService.deleteSubscription(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete subscription');
    }
  }
);

const initialState = {
  subscriptions: [],
  loading: false,
  error: null,
};

const subscriptionSlice = createSlice({
  name: 'subscriptions',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscriptions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSubscriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptions = action.payload;
      })
      .addCase(fetchSubscriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createSubscription.fulfilled, (state, action) => {
        state.subscriptions.push(action.payload);
      })
      .addCase(updateSubscription.fulfilled, (state, action) => {
        const index = state.subscriptions.findIndex(
          (sub) => sub._id === action.payload._id
        );
        if (index !== -1) {
          state.subscriptions[index] = action.payload;
        }
      })
      .addCase(deleteSubscription.fulfilled, (state, action) => {
        state.subscriptions = state.subscriptions.filter(
          (sub) => sub._id !== action.payload
        );
      });
  },
});

export const { clearError } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;

