import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartService } from '../../services/cartService';

// Async thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const data = await cartService.getCart();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
    }
  }
);

export const addItemToCart = createAsyncThunk(
  'cart/addItem',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const data = await cartService.addToCart(productId, quantity);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add item');
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateItem',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const data = await cartService.updateCartItem(productId, quantity);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update item');
    }
  }
);

export const removeCartItem = createAsyncThunk(
  'cart/removeItem',
  async (productId, { rejectWithValue }) => {
    try {
      const data = await cartService.removeFromCart(productId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove item');
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      await cartService.clearCart();
      return { items: [] };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to clear cart');
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCartLocal: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
      });
  },
});

export const { clearCartLocal } = cartSlice.actions;
export default cartSlice.reducer;

