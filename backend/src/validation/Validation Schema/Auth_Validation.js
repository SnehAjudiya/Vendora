import Joi from "joi";
import {
  address_validator,
  countryStateCity_validator,
  date_validator,
  email_validator,
  gender_validator,
  name_validator,
  otp_validator,
  password_validator,
  phone_validator,
  termsAccepted_validator,
  username_validator,
} from "../validators.js";

// AUTH
// Register
export const register_validation_schema = Joi.object({
  fullName: name_validator,
  email: email_validator,
  phone: phone_validator,
  gender: gender_validator,
  dob: date_validator,
  address: address_validator,
  country: countryStateCity_validator,
  state: countryStateCity_validator,
  city: countryStateCity_validator,
  username: username_validator,
  password: password_validator,
  termsAccepted: termsAccepted_validator,
});

// Login
export const login_validation_schema = Joi.object({
  email: email_validator,
  password: password_validator,
});

// Verify Email Otp
export const verifyEmailOtp_validation_schema = Joi.object({
  email: email_validator,
  otp: otp_validator,
});

// Forgot Password - Email
export const forgotPassword_validation_schema = Joi.object({
  email: email_validator,
});

// Reset Password
export const resetPassword_validation_schema = Joi.object({
  otp: otp_validator,
  newPassword: password_validator,
  email: email_validator,
});
