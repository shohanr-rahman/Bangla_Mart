import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true, maxlength: 2000 },
    price: { type: Number, required: true, min: 0 },
    comparePrice: { type: Number, min: 0 },
    category: { type: String, required: true, index: true },
    images: { type: [String], default: [] },
    stock: { type: Number, required: true, min: 0, default: 0 },
    sellerId: { type: String, required: true, index: true },
    sellerName: { type: String, required: true },
    status: {
      type: String,
      enum: ["active", "draft"],
      default: "active",
      index: true,
    },
    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.index({ createdAt: -1 });
productSchema.index({ price: 1 });

export type ProductDoc = InferSchemaType<typeof productSchema>;

export const Product: Model<ProductDoc> =
  (mongoose.models.Product as Model<ProductDoc> | undefined) ??
  mongoose.model<ProductDoc>("Product", productSchema);