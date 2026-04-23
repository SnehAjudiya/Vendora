export const MESSAGES = {
  AUTH: {
    LOGGED_IN: "User logged in successfully!",
    LOGGED_OUT: "Logged Out Successfully!",
    VERIFIED: "Account verified successfully",
    ALREADY_VERIFIED: "Account already verified",
    INACTIVE: "You are Inactive User , Request Admin for access",
    INVALID_CREDENTIALS: "Invalid Credentials!",
    TOKEN_GENERATED: "Token generated successfully!",
    INVALID_TOKEN: "Invalid token",
    EXPIRED_TOKEN: "Unauthorized:Token is expired",
    RESET_PASS_SUCCESS: "Password reset successfully!",
    NO_TOKEN: "No token found!",
    UNAUTHORIZED: "User unauthorized. Please login again.",
    FORBIDDEN: "Forbidden : Access Denied",
    OTP_SENT: "OTP sent to your email",
    OTP_EXPIRED: "OTP expired. Please enter new OTP",
    MISSING_DETAILS: "Missing details",
  },

  USER: {
    CREATED: "User created successfully!",
    AUTHENTICATED: "User is authenticated",
    ALREADY_EXISTS: "User with same email already exists",
    NOT_FOUND: "No user found.",
    FETCH_ALL: "Fetched All User Successfully",
    FETCH_ALL_QA: "Fetched All QA User Successfully",
    FETCH_ALL_DEV: "Fetched All Developer User Successfully",
    FETCH: "Fetched User Successfully",
    UPDATED: "User updated Successfully!",
    DELETED: "User deleted Successfully!",
  },

  PROJECT: {
    CREATED: "Project created Successfully!",
    ALREADY_EXIST: "Project With same name already exist",
    FETCH_ALL: "Fetched All Projects Successfully",
    FETCH: "Fetched Project Successfully",
    NOT_FOUND: "Project Not found",
    UPDATED: "Project updated Successfully!",
    DELETED: "Project deleted Successfully!",
    QA_NOT_FOUND: "Bug reporter Not found!",
    INVALID_MEMBERS: "Project Members can not be empty",
    INVALID_ROLE: "Invalid Project member Role",
    MEMBERS_NOT_FOUND: "Project member not found !",
    PROJECT_ERROR: "Something went wrong while creating project",
    MEMBERS_UPDATED: "Project members Updated successfully",
  },

  PRODUCT: {
    CREATED: "Product created Successfully!",
    FETCH_ALL: "Fetched All Products Successfully",
    FETCH: "Fetched Product Successfully",
    UPDATED: "Product updated Successfully!",
    DELETED: "Product deleted Successfully!",
    NOT_FOUND: "No Product Found",
    VENDOR_NOT_FOUND: "Vendor not found",

    UPLOADED: "Products uploaded Successfully!",
    NOT_UPLOADED: "Not uploaded any products",
    BULK_UPLOAD: "All Products Uploaded Successfully!",
    FILE_VALIDATION_FAILED: "Only Excel files are allowed",
    DATA_NOT_FOUND: "No data found in file",
    INVALID_OR_CORRUPTED: "Invalid or corrupted file",
    EXPORTED: "Product exported successfully",
    EXPORT_FILE_TYPE_INVALID: "Invalid export file type",
  },

  CART: {
    FETCH: "Fetched the cart products successfully!",
    UPDATE_QUANTITY_METHOD_NOT_IMPLEMENTED: "Updating the quantity with this method is not implemented",
    UPDATE_QUANTITY_SUCCESS: "Updated the quantity successfully",
    REMOVE_ALL: "Removed all items from cart successfully."
  },

  PAYMENT: {
    SESSION_CREATED: "Created Strip Checkout Session successfully.",
    SESSION_RETRIEVED: "Retrieved Payment Session details successfully.",
    NOT_PAID: "Bill for the order is not paid",
    NOT_PAID_SUBSCRIPTION: "Bill for the order is not paid",
  },

  ORDER: {
    FETCH_ALL: "Fetched all Orders successfully",
    CREATED: "Created new order successfully",
    USER_NOT_MATCHING: "Order details requested by the user is not correct",
    NOT_CREATED: "Could not create new order",
    ALREADY_CREATED: "Order is already created with the payment id.",
  },

  SUBSCRIPTION: {
    FETCH: "Fetched Subscription successfully",
    CREATED: "Created new subscription successfully",
    USER_NOT_MATCHING: "Subscription details requested by the user is not correct",
    NOT_CREATED: "Could not create new subscription",
    ALREADY_CREATED: "Subscription is already created with the payment id.",
    CANCELED: "Subscription canceled successfully",
  },

  MESSAGE: {
    FETCH: "Fetched Messages Successfully",
    CREATED: "New Message created Successfully",
    SENDER_NOT_VALID: "Sender is not valid",
    NOT_FOUND: "No message found",
  },

  ERROR: {
    SERVER_ERROR: "Something went wrong. Please try again later.",
    CONFLICT: "Duplicate Keys for a unique field",
  },

  REQUIRED: (arr) => {
    const str = arr.join(", ") + "fields are required: ";
    return str;
  },

  NODEMAILER: {
    REGISTER: {
      SUBJECT: "Welcome to the Website",
      TEXT: (email) => {
      },
    },

    EMAIL_VERIFY_OTP: {
      SUBJECT: "Account Verification OTP",
      TEXT: (otp) => {
        return `Your OTP is ${otp}. Verify your account using this OTP.`;
      },
    },

    RESET_PASSWORD_OTP: {
      SUBJECT: "Password Reset OTP",
      TEXT: (otp) => {
        return `Your OTP for resetting your password is ${otp}. Use this OTP to proceed with resetting your password.`;
      },
    },

    SUBSCRIPTION: {
      SUBJECT: "Subcription Created Successfully"
    }
  },
};
