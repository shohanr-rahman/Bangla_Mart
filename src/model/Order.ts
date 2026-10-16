import mongoose, {
Schema,
type InferSchemaType,
type Model,
} from "mongoose";

const orderItemSchema = new Schema(
{
productId: { type: String, required: true },
name: { type: String, required: true },
slug: { type: String, required: true },
image: { type: String, default: "" },
price: { type: Number, required: true, min: 0 },
quantity: { type: Number, required: true, min: 1 },
sellerId: { type: String, required: true },
sellerName: { type: String, required: true },
},
{ _id: false },
);

const orderSchema = new Schema(
{
orderNumber: {
type: String,
required: true,
unique: true,
index: true,
},
buyerId: {
type: String,
required: true,
index: true,
},
customerName: {
type: String,
required: true,
trim: true,
maxlength: 100,
},
phone: {
type: String,
required: true,
trim: true,
maxlength: 20,
},
address: {
type: String,
required: true,
trim: true,
maxlength: 500,
},
city: {
type: String,
required: true,
trim: true,
maxlength: 100,
},
items: {
type: [orderItemSchema],
required: true,
validate: {
validator: (items: unknown[]) => items.length > 0,
message: "Order must contain at least one product.",
},
},
subtotal: { type: Number, required: true, min: 0 },
deliveryCharge: { type: Number, required: true, min: 0, default: 0 },
total: { type: Number, required: true, min: 0 },
paymentMethod: {
type: String,
enum: ["cod"],
default: "cod",
required: true,
},
paymentStatus: {
type: String,
enum: ["pending", "paid", "failed", "refunded"],
default: "pending",
},
orderStatus: {
type: String,
enum: [
"pending",
"confirmed",
"processing",
"shipped",
"delivered",
"cancelled",
],
default: "pending",
index: true,
},
},
{ timestamps: true },
);

orderSchema.index({ buyerId: 1, createdAt: -1 });

export type OrderDoc = InferSchemaType<typeof orderSchema>;

export const Order: Model<OrderDoc> =
(mongoose.models.Order as Model<OrderDoc> | undefined) ??
mongoose.model<OrderDoc>("Order", orderSchema);

