import express from "express";
import {
  register,
  login,
  logout,
  sendVerifyOtp,
  sendResetOtp,
  isAuthenticated,
  verifyEmail,
  resetPassword,
} from "../controllers/Auth/authController.js";
import userAuth from "../middleware/userAuth.js";
import { upload } from "../middleware/multer.js";
import {
  forgotPassword_validation_schema,
  login_validation_schema,
  register_validation_schema,
  resetPassword_validation_schema,
  verifyEmailOtp_validation_schema,
} from "../validation/Validation Schema/Auth_Validation.js";
import { validationHandler } from "../middleware/validationHandler.js";
import { AppConstants } from "../constant/appConstants.js";

const authRouter = express.Router();

authRouter

  // Register
  .post(
    "/register",
    upload.fields([
      { name: AppConstants.UploadFileNames.Avatar, maxCount: 1 },
      { name: AppConstants.UploadFileNames.Gallery, maxCount: 8 },
    ]),
    validationHandler(register_validation_schema),
    register,
  );

authRouter

  // Login
  .post("/login", validationHandler(login_validation_schema), login);

authRouter

  // Logout
  .post("/logout", logout);

authRouter

  // Send Verify Otp
  .post("/send-verify-otp", userAuth, sendVerifyOtp);

authRouter

  // Verify Account
  .post(
    "/verify-account",
    userAuth,
    validationHandler(verifyEmailOtp_validation_schema),
    verifyEmail,
  );

authRouter

  // Is Authenticated
  .get("/is-auth", userAuth, isAuthenticated);

authRouter

  // Password Reset Otp Generation
  .post(
    "/send-reset-otp",
    validationHandler(forgotPassword_validation_schema),
    sendResetOtp,
  );
authRouter

  // Set New Password
  .post(
    "/reset-password",
    validationHandler(resetPassword_validation_schema),
    resetPassword,
  );

export default authRouter;
