import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createOrderApi, fetchOrdersApi } from "../../api/ordersApi";

export type ItemObject = {
  stripeProductId: string;
  name: string;
  price: number;
  quantity: number;
  _id?: string;
};

export type FetchOrdersType = {
  _id: string;
  userId: string;
  paymentId: string;
  items: ItemObject[];
  amountTotal: number;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateOrderType = {
  updatedPaymentDetails: {
    _id: string;
    userId: string;
    sessionId: string;
    paymentStatus: "paid" | "unpaid" | "no_payment_required";
    amountTotal: number;
    customerEmail: string;
    paymentIntentId: string;
    paymentMethodTypes: string[];
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };
  orderItems: {
    amountTotal: number;
    items: ItemObject[];
  };
};

type OrderState = {
  orders: FetchOrdersType[];
  loading: boolean;
  error: string | null;
};

const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null,
};

export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  fetchOrdersApi,
);

export const createOrder = createAsyncThunk(
  "orders/createOrder",
  createOrderApi,
);

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchOrders.fulfilled,
        (state, action: PayloadAction<FetchOrdersType[]>) => {
          state.loading = false;
          state.orders = action.payload;
        },
      )
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Could not fetch orders";
      })

      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        createOrder.fulfilled,
        (state, action: PayloadAction<FetchOrdersType>) => {
          state.loading = false;
          state.orders.push(action.payload);
        },
      )
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error creating order";
      });
  },
});

export default orderSlice.reducer;
