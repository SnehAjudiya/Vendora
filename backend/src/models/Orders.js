import mongoose from "mongoose";
const { Schema } = mongoose;

const ordersSchema = Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    paymentId: { type: Schema.Types.ObjectId, ref: "Payments" },
    items: [{
      stripeProductId: { type: String },
      name: { type: String },
      price: { type: Number },
      quantity: { type: Number },
    }],
    amountTotal: { type: Number },
  },
  { timestamps: true, versionKey: false }
)

export default mongoose.model("Orders", ordersSchema);