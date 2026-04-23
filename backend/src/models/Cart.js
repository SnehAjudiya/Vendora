import mongoose from "mongoose";
const { Schema } = mongoose;

const cartSchema = Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Products" },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  quantity: { type: Number, default: 0 },
});

export default mongoose.model("Cart", cartSchema);
