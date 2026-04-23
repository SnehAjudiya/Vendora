import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  cancelSubscriptionApi,
  fetchSubscriptionApi,
} from "../../api/subscriptionApi";

export type FetchSubscriptionType = {
  _id: string;
  userId: string;
  paymentsId: string;
  subscriptionId: string;
  stripeCustomerId: string;
  name: string;
  amount: number;
  interval: string;
  interval_count: number;
  stripeProductId: string;
  stripePriceId: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateSubscriptionType = {
  updatePaymentDetails: {
    _id: string;
    userId: string;
    sessionId: string;
    sessionStatus: string;
    paymentStatus: string;
    paymentMethodTypes: string[];
    amountTotal: number;
    createdAt: string;
    updatedAt: string;
    customerEmail: string;
    paymentIntentId: string | null;
  };
  subscriptionItems: {
    subscriptionId: string;
    name: string;
    amount: number;
    interval: string;
    interval_count: number;
    stripeCustomerId: string;
    stripeProductId: string;
    stripePriceId: string;
  };
};

export const fetchSubscription = createAsyncThunk(
  "subscriptions/fetchAllSubcriptions",
  fetchSubscriptionApi,
);

export const cancelSubscription = createAsyncThunk(
  "subscriptions/cancelSubscription",
  cancelSubscriptionApi,
);

type SubscriptionState = {
  subscription: FetchSubscriptionType | null;
  loading: boolean;
  error: string | null;
};

const initialState: SubscriptionState = {
  subscription: null,
  loading: false,
  error: null,
};
const subscriptionSlice = createSlice({
  name: "subscriptions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscription.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchSubscription.fulfilled,
        (state, action: PayloadAction<FetchSubscriptionType>) => {
          state.loading = false;
          state.subscription = action.payload;
        },
      )
      .addCase(fetchSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error fetching subscriptions";
      })
      .addCase(cancelSubscription.pending, (state) => {
        state.loading = true;
      })
      .addCase(cancelSubscription.fulfilled, (state) => {
        state.loading = false;
        state.subscription = null;
      })
      .addCase(cancelSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error cancelling subscription";
      });
  },
});

export default subscriptionSlice.reducer;
