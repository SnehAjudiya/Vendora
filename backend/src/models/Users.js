import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = Schema({
  id: { type: Number, unique: true },
  fullName: { type: String },
  email: { type: String, unique: true },
  phone: { type: String },
  gender: { type: String },
  dob: { type: String },
  address: { type: String },
  country: { type: String },
  state: { type: String },
  city: { type: String },
  username: { type: String },
  password: { type: String },

  gallery: [{ type: String }],
  avatar: { type: String },

  status: {
    type: String,
    enum: ["Active", "Pending", "Inactive"],
    default: "Active",
  },
  role: {
    type: String,
    enum: ["Admin", "Vendor", "Customer"],
    default: "Customer",
  },
  createdAt: { type: String, default: new Date().toLocaleDateString() },

  verifyOtp: { type: String, default: "" },
  verifyOtpExpireAt: { type: Number, default: 0 },

  isAccountVerified: { type: Boolean, default: false },

  resetOtp: { type: String, default: "" },
  resetOtpExpireAt: { type: Number, default: 0 },

  isDeleted: { type: Boolean, default: false },

  stripeCustomerId: { type: String },
});

const userModel = mongoose.models.User || mongoose.model("User", userSchema);

export default userModel;
