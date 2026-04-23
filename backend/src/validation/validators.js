import Joi from "joi";
import { AppConstants } from "../constant/appConstants.js";

export const email_validator = Joi.string()
  .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "in"] } })
  .required()
  .messages({
    "string.base": "Email must be a string",
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  });

export const password_validator = Joi.string()
  .min(8)
  .max(15)
  .pattern(/[a-zA-Z]/)
  .pattern(/[0-9]/)
  .pattern(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)
  .required()
  .messages({
    "string.base": "Password must be a string",
    "string.min": "Password must be at least 8 characters",
    "string.max": "Password must not exceed 15 characters",
    "string.pattern.base":
      "Password must contain letters, numbers, and special characters",
    "any.required": "Password is required",
  });

export const confirmPassword_validator = Joi.string()
  .valid(Joi.ref("password"))
  .required()
  .messages({
    "string.base": "Password must be a string",
    "any.only": "Passwords do not match",
    "any.required": "Confirm password is required",
  });

export const phone_validator = Joi.number().required().messages({
  "number.base": "Phone must be a number",
  "any.required": "Phone Number is required",
});

export const username_validator = Joi.string().min(3).required().messages({
  "string.base": "Username must be a string",
  "string.min": "Username must be at least 3 characters",
  "any.required": "Username is required",
});

export const name_validator = Joi.string()
  .min(2)
  .pattern(/^[a-zA-Z ]+$/)
  .required()
  .messages({
    "string.base": "Name must be a string",
    "string.pattern.base": "Name must contain only letters",
    "string.min": "Please enter at least 2 characters",
    "any.required": "Name is required",
  });

export const gender_validator = Joi.string()
  .valid("Male", "Female")
  .required()
  .messages({
    "string.base": "Gender must be a string",
    "any.only": "Gender must be Male or Female",
    "any.required": "Gender is required",
  });

export const date_validator = Joi.date().required().messages({
  "string.base": "Date must be a date type",
  "date.base": "Please enter a valid date",
  "any.required": "Date is required",
});

export const address_validator = Joi.string().min(5).required().messages({
  "string.base": "Address must be a string",
  "string.min": "Address must be at least 5 characters",
  "any.required": "Address is required",
});

export const termsAccepted_validator = Joi.boolean().valid(true).messages({
  "string.base": "Terms Accepted must be either true or false",
  "any.only": "You must accept the terms",
});

export const countryStateCity_validator = Joi.string().required().messages({
  "string.base": "Country, State, City all must be a string",
  "any.required": "Please select all country, state, city",
});

export const userStatus_validator = Joi.string()
  .valid("Active", "Inactive", "Pending")
  .required()
  .messages({
    "string.base": "User status must be a string",
    "any.only": "Invalid Status",
    "any.required": "Status is required",
  });

export const projectStatus_validator = Joi.string()
  .valid("Completed", "Ongoing", "On Hold")
  .required()
  .messages({
    "string.base": "Status must be a string",
    "any.only": "Invalid Status",
    "any.required": "Status is required",
  });

export const projectPriority_validator = Joi.string()
  .valid("High", "Medium", "Low")
  .required()
  .messages({
    "string.base": "Priority must be a string",
    "any.only": "Invalid Priority",
    "any.required": "Priority is required",
  });

export const projectTeamSize_validator = Joi.number()
  .min(1)
  .required()
  .messages({
    "number.base": "Team size must be a number",
    "string.min": "Min 1 member in the team",
    "any.required": "Team Size is required",
  });

export const projectProgress_validator = Joi.number()
  .min(0)
  .max(100)
  .required()
  .messages({
    "number.base": "Progress must be a number",
    "string.min": "Progress cannot be negative",
    "string.max": "Progress cannot be more than 100%",
    "any.required": "Progress field is required",
  });

export const projectBudget_validator = Joi.number().min(0).required().messages({
  "number.base": "Budget must be a number",
  "string.min": "Budget cannot be negative",
  "any.required": "Budget is required",
});

export const userRole_validator = Joi.string()
  .valid(AppConstants.Role.Admin, AppConstants.Role.Vendor, AppConstants.Role.Customer)
  .required()
  .messages({
    "string.base": "Role must be a string",
    "any.only": "Invalid Role",
    "any.required": "Role is required",
  });

export const otp_validator = Joi.number()
  .min(100000)
  .max(999999)
  .required()
  .messages({
    "number.base": "OTP must be a number",
    "number.min": "OTP must be 6 digits",
    "number.max": "OTP must be 6 digits",
    "any.required": "OTP is required",
  });

export const id_validator = Joi.number();
export const projectCode_validator = Joi.number();
export const createdDate_validator = Joi.string();

export const existingAvatar_validator = Joi.string().trim().min(0).optional();
export const existingImage_validator = Joi.string().trim().min(0).optional();

export const existingGallery_validator = Joi.alternatives()
  .try(
    Joi.array().items(Joi.string().trim().min(0)),
    Joi.string().trim().min(0),
  )
  .optional();

export const productPrice_validator = Joi.number().min(0).required().messages({
  "number.base": "Price must be a number",
  "string.min": "Price cannot be negative",
  "any.required": "Price is required",
});

export const productCategory_validator = Joi.string()
  .valid(
    AppConstants.ProductCategories.Beauty,
    AppConstants.ProductCategories.Electronics,
    AppConstants.ProductCategories.Fashion,
    AppConstants.ProductCategories.Health,
    AppConstants.ProductCategories.Home
  )
  .required()
  .messages({
    "string.base": "Category must be a string",
    "any.only":
      "Invalid Category. Valid category must be (Beauty & Personal Care, Electronics & Gadgets, Fashion & Apparel, Home & Kitchen, Health & Fitness)",
    "any.required": "Category is required",
  });

export const productRatingStars_validator = Joi.number()
  .min(0)
  .max(5)
  .required()
  .messages({
    "number.base": "Rating Stars be a number",
    "string.min": "Rating can not be negative",
    "string.max": "Maximum rating of 5 stars",
    "any.required": "Rating is required",
  });

export const productRatingCount_validator = Joi.number()
  .min(0)
  .required()
  .messages({
    "number.base": "Rating Count must be a number",
    "string.min": "Rating Count cannot be negative",
    "any.required": "Rating Count is required",
  });

export const productKeywords_validator = Joi.alternatives()
  .try(
    Joi.array().items(Joi.string().trim().min(1)),
    Joi.string().trim().min(1),
  )
  .optional();

export const productImage_validator = Joi.string().trim().min(1).optional();

export const roomId_validator = Joi.string().required().messages({
  "string.base": "roomId must be a string",
  "any.required": "RoomId is required"
})

export const senderId_validator = Joi.string().required().messages({
  "string.base": "senderId must be a string",
  "any.required": "senderId is required",
})

export const senderName_validator = Joi.string().required().messages({
  "string.base": "senderName must be a string",
  "any.required": "senderName is required",
})

export const text_validator = Joi.string().required().messages({
  "string.base": "text must be a string",
  "any.required": "text is required",
})