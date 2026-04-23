import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../components/Login/Login";
import ForgotPasswordForm from "../components/Login/ForgotPassword";
import ResetPassword from "../components/Login/ResetPassword";
import Register from "../components/Login/Register";
import VerifyEmailOtp from "../components/Login/VerifyEmailOtp";
import VerifyEmail from "../components/Login/VerifyEmail";
import MainLayout from "../components/MySite/MainLayout";
import Dashboard from "../components/MySite/pages/Dashboard/Dashboard";
import Profile from "../components/MySite/pages/Profile/Profile";
import Users from "../components/MySite/pages/Users/Users";
import AddEditForm from "../components/MySite/pages/Users/AddEditForm";
import UserDetails from "../components/MySite/pages/Users/UserDetails";
import Projects from "../components/MySite/pages/Projects/Projects";
import ProjectsAddEditForm from "../components/MySite/pages/Projects/ProjectsAddEditForm";
import ProjectDetails from "../components/MySite/pages/Projects/ProjectDetails";
import PublicRoute from "./PublicRoutes";
import PrivateRoute from "./PrivateRoutes";
import { useAppDispatch } from "../redux/hooks/hooks";
import { useEffect } from "react";
import { checkAuth } from "../redux/slice/AuthSlice";
import Products from "../components/MySite/pages/Products/Products";
import Cart from "../components/MySite/pages/Products/Cart";
import ProductDetails from "../components/MySite/pages/Products/ProductDetails";
import Checkout from "../components/MySite/pages/Products/Checkout";
import ProductAddEditForm from "../components/MySite/pages/Products/ProductAddEditForm";
import RoleProtectedRoute from "./RoleProtectedRoutes";
import ProfileEdit from "../components/MySite/pages/Profile/ProfileEdit";
import ChatPageForAdmin from "../components/MySite/pages/Chat/ChatPageForAdmin";
import ChatPageForVendorAndCustomer from "../components/MySite/pages/Chat/ChatPageForVedorAndCustomer";
import GroupChatPage from "../components/MySite/pages/Chat/GroupChatPage";
import ChatMainPage from "../components/MySite/pages/Chat/ChatMainPage";
import PaymentStatus from "../components/MySite/pages/PaymentStatus/PaymentStatus";
import Orders from "../components/MySite/pages/Orders/Orders";
import Subscription from "../components/MySite/pages/Subscription/Subscription";
import SubscriptionPaymentStatus from "../components/MySite/pages/PaymentStatus/SubscriptionPaymentStatus";

export default function AppRoutes() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/login" element={<Login />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="profile/edit" element={<ProfileEdit />} />

            {/* Users */}

            <Route
              path="users"
              element={
                <RoleProtectedRoute allowedRoles={["Admin"]}>
                  <Users />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="users/add-user"
              element={
                <RoleProtectedRoute allowedRoles={["Admin"]}>
                  <AddEditForm />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="users/:id"
              element={
                <RoleProtectedRoute allowedRoles={["Admin"]}>
                  <UserDetails />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="users/:id/edit"
              element={
                <RoleProtectedRoute allowedRoles={["Admin"]}>
                  <AddEditForm />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="chat/group/:group"
              element={
                <RoleProtectedRoute
                  allowedRoles={["Admin", "Vendor", "Customer"]}
                >
                  <GroupChatPage />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="chat/:id"
              element={
                <RoleProtectedRoute allowedRoles={["Admin"]}>
                  <ChatPageForAdmin />
                </RoleProtectedRoute>
              }
            />

            {/* Projects */}
            <Route path="projects" element={<Projects />} />
            <Route
              path="projects/add-project"
              element={<ProjectsAddEditForm />}
            />
            <Route path="projects/:project_code" element={<ProjectDetails />} />
            <Route
              path="projects/:project_code/edit"
              element={<ProjectsAddEditForm />}
            />

            {/* Verify Email */}
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/verify-email-otp" element={<VerifyEmailOtp />} />

            {/* Products */}
            <Route path="/products" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route
              path="/products/add-product"
              element={
                <RoleProtectedRoute allowedRoles={["Admin", "Vendor"]}>
                  <ProductAddEditForm />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/products/:id/edit"
              element={
                <RoleProtectedRoute allowedRoles={["Admin", "Vendor"]}>
                  <ProductAddEditForm />
                </RoleProtectedRoute>
              }
            />
            <Route path="/products/category/:category" element={<Products />} />
            <Route
              path="/payment/success"
              element={<PaymentStatus success={true} />}
            />
            <Route
              path="/payment/cancel"
              element={<PaymentStatus success={false} />}
            />
            <Route path="/checkout" element={<Checkout />} />
            <Route
              path="/chat"
              element={
                <RoleProtectedRoute allowedRoles={["Vendor", "Customer"]}>
                  <ChatMainPage />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/chat/admin"
              element={
                <RoleProtectedRoute allowedRoles={["Vendor", "Customer"]}>
                  <ChatPageForVendorAndCustomer />
                </RoleProtectedRoute>
              }
            />

            <Route
              path="/orders"
              element={
                <RoleProtectedRoute allowedRoles={["Customer"]}>
                  <Orders />
                </RoleProtectedRoute>
              }
            />

            <Route
              path="/subscriptions/payment/success"
              element={<SubscriptionPaymentStatus success={true} />}
            />
            <Route
              path="/subscriptions/payment/cancel"
              element={<SubscriptionPaymentStatus success={false} />}
            />

            <Route
              path="/subscriptions"
              element={
                <RoleProtectedRoute allowedRoles={["Customer"]}>
                  <Subscription />
                </RoleProtectedRoute>
              }
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
