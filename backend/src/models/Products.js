import mongoose from "mongoose";
const { Schema } = mongoose;

const productsSchema = Schema(
  {
    vendorId: { type: Schema.Types.ObjectId, ref: "User" },
    id: { type: Number, unique: true },
    image: { type: String },
    name: { type: String },
    description: { type: String },
    price: { type: Number },
    category: {
      type: String,
      enum: [
        "Beauty & Personal Care",
        "Electronics & Gadgets",
        "Fashion & Apparel",
        "Home & Kitchen",
        "Health & Fitness",
      ],
    },
    subCategory: { type: String },
    rating: {
      stars: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    keywords: [{ type: String, index: true }],
    isDeleted: { type: Boolean, default: false },

    stripeProductId: { type: String },
  },
  { timestamps: true },
);

const productsModel =
  mongoose.models.products || mongoose.model("Products", productsSchema);

export default productsModel;
