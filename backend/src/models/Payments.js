import mongoose from "mongoose";
const { Schema } = mongoose;

const paymentsSchema = Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  sessionId: { type: String },
  sessionStatus: { type: String, enum: ['open', 'complete', 'expired'] },
  paymentStatus: { type: String, enum: ["paid", "unpaid", "no_payment_required"] },
  paymentMode: { type: String, enum: ["payment", "subscription", "setup"] },
  paymentMethodTypes: [{ type: String }],
  amountTotal: { type: Number },
  // customerId: { type: String },
  customerEmail: { type: String },
  paymentIntentId: { type: String },
}, { timestamps: true, versionKey: false })

export default mongoose.model("Payments", paymentsSchema);