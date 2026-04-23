import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  clearCartApi,
  fetchCartApi,
  getCartProductByIdApi,
  updateQuantityApi,
} from "../../api/cartApi";
import { ProductRow } from "../../components/MySite/pages/Products/ProductAddEditForm";

export type Items = {
  product: ProductRow;
  quantity: number;
};

const UpdateQuantityAction = {
  Increment: "i",
  Decrement: "d",
  RemoveAll: "r",
};

interface CartState {
  items: Items[];
  selectedItem: Items | null;
  totalItems: number;
  totalPrice: number;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  selectedItem: null,
  totalItems: 0,
  totalPrice: 0,
  loading: false,
  error: null,
};

export const fetchCart = createAsyncThunk("cart/fetchCart", fetchCartApi);

export const updateQuantity = createAsyncThunk(
  "cart/updateQuantity",
  updateQuantityApi,
);

export const getCartProductById = createAsyncThunk(
  "cart/getCartProductById",
  getCartProductByIdApi,
);

export const clearCart = createAsyncThunk("cart/clearCart", clearCartApi);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = [];
        state.totalItems = 0;
        state.totalPrice = 0;
        const res = action.payload;
        res.map((cur: any) => {
          state.items.push({ product: cur.productId, quantity: cur.quantity });
          state.totalItems += cur.quantity;
          state.totalPrice += cur.quantity * cur.productId.price;
        });
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error fetching cart";
      })
      .addCase(updateQuantity.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        state.loading = false;

        const actionType = action.payload.action;
        const toUpdate = state.items.find(
          (item) => item.product._id === action.payload.productId,
        );

        // for item inside Cart
        if (toUpdate) {
          if (actionType === UpdateQuantityAction.Increment) {
            toUpdate.quantity += 1;
            state.totalItems += 1;
            state.totalPrice += toUpdate.product.price;
          } else if (actionType === UpdateQuantityAction.Decrement) {
            toUpdate.quantity -= 1;
            state.totalItems -= 1;
            state.totalPrice -= toUpdate.product.price;
          } else if (actionType === UpdateQuantityAction.RemoveAll) {
            state.totalItems -= toUpdate.quantity;
            state.totalPrice -= toUpdate.quantity * toUpdate.product.price;
            toUpdate.quantity = 0;
          }

          if (toUpdate.quantity === 0) {
            state.items = state.items.filter(
              (item) => item.product._id !== action.payload.productId,
            );
          }
        } else if (!toUpdate && actionType === UpdateQuantityAction.Increment) {
          state.items.push({
            product: action.payload.data.productId,
            quantity: action.payload.data.quantity,
          });
        }

        // for item in Product Details
        if (
          state.selectedItem &&
          state.selectedItem.product._id === action.payload.productId
        ) {
          if (actionType === UpdateQuantityAction.Increment) {
            state.selectedItem.quantity += 1;
          } else if (actionType === UpdateQuantityAction.Decrement) {
            state.selectedItem.quantity -= 1;
          } else if (actionType === UpdateQuantityAction.RemoveAll) {
            state.selectedItem.quantity = 0;
          }
          if (state.selectedItem.quantity === 0) state.selectedItem = null;
        } else if (
          !state.selectedItem &&
          actionType === UpdateQuantityAction.Increment
        ) {
          state.selectedItem = {
            product: action.payload.data.productId,
            quantity: action.payload.data.quantity,
          };
        }
      })
      .addCase(updateQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error updating quantity";
      })
      .addCase(getCartProductById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCartProductById.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload === null) state.selectedItem = null;
        else {
          state.selectedItem = {
            product: action.payload.productId,
            quantity: action.payload.quantity,
          };
        }
      })
      .addCase(getCartProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error fetching cart product";
      })
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = [];
        state.totalItems = 0;
        state.totalPrice = 0;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error clearing cart";
      });
  },
});

export default cartSlice.reducer;
