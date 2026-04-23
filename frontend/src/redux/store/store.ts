import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slice/AuthSlice";
import usersReducer from "../slice/UsersSlice";
import projectsReducer from "../slice/ProjectsSlice";
import cartReducer from "../slice/CartSlice";
import filterReducer from "../slice/FilterSlice";
import productsReducer from "../slice/ProductSlice";
import messageReducer from "../slice/MessageSlice";
import orderReducer from "../slice/OrderSlice";
import subscriptionReducer from "../slice/SubscriptionSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    projects: projectsReducer,
    cart: cartReducer,
    filter: filterReducer,
    products: productsReducer,
    messages: messageReducer,
    orders: orderReducer,
    subscriptions: subscriptionReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
