import mongoose from "mongoose";
const { Schema } = mongoose;

const subscriptionSchema = Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  paymentsId: { type: Schema.Types.ObjectId, ref: "Payments" },

  subscriptionId: { type: String },
  subscriptionStatus: { type: String, enum: ["active", "past_due", "unpaid", "canceled", "incomplete", "incomplete_expired", "trialing", "paused", 'ended'] },

  stripeCustomerId: { type: String },
  name: { type: String },
  amount: { type: Number },
  interval: { type: String, enum: ["day", "week", "month", "year"] },
  interval_count: { type: Number },
  stripeProductId: { type: String },
  stripePriceId: { type: String },

  lastReminderSentAt: { type: Date, default: null },

}, { timestamps: true, versionKey: false });

export default mongoose.model("Subscription", subscriptionSchema);