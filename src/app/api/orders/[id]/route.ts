import { NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectDB } from "@/lib/db";
import { getSession } from "@/lib/session";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";

export const runtime = "nodejs";

type RouteContext = {
params: Promise<{ id: string }>;
};

export async function PATCH(
request: Request,
{ params }: RouteContext,
) {
try {
const session = await getSession();


if (!session?.user?.id) {
  return NextResponse.json(
    { message: "Please sign in first." },
    { status: 401 },
  );
}

const { id } = await params;

if (!mongoose.isValidObjectId(id)) {
  return NextResponse.json(
    { message: "Invalid order ID." },
    { status: 400 },
  );
}

const body = await request.json().catch(() => null);

if (body?.action !== "cancel") {
  return NextResponse.json(
    { message: "Invalid order action." },
    { status: 400 },
  );
}

await connectDB();

const mongoSession = await mongoose.startSession();

try {
  let cancelledOrder: {
    id: string;
    orderNumber: string;
    orderStatus: string;
  } | null = null;

  await mongoSession.withTransaction(async () => {
    // Only the owner can cancel their own pending order.
    const order = await Order.findOne({
      _id: id,
      buyerId: session.user.id,
      orderStatus: "pending",
    }).session(mongoSession);

    if (!order) {
      throw new Error("ORDER_NOT_CANCELLABLE");
    }

    // Restore the stock for every product in the order.
    for (const item of order.items) {
      const product = await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: item.quantity } },
        { session: mongoSession },
      );

      if (!product) {
        throw new Error("PRODUCT_NOT_FOUND");
      }
    }

    order.orderStatus = "cancelled";
    await order.save({ session: mongoSession });

    cancelledOrder = {
      id: String(order._id),
      orderNumber: order.orderNumber,
      orderStatus: order.orderStatus,
    };
  });

  if (!cancelledOrder) {
    throw new Error("ORDER_NOT_CANCELLABLE");
  }

  return NextResponse.json({
    message: "Order cancelled successfully.",
    order: cancelledOrder,
  });
} finally {
  await mongoSession.endSession();
}


} catch (error) {
if (
error instanceof Error &&
error.message === "ORDER_NOT_CANCELLABLE"
) {
return NextResponse.json(
{
message:
"This order cannot be cancelled. Only pending orders can be cancelled.",
},
{ status: 409 },
);
}

if (
  error instanceof Error &&
  error.message === "PRODUCT_NOT_FOUND"
) {
  return NextResponse.json(
    { message: "A product in this order could not be found." },
    { status: 409 },
  );
}

console.error("PATCH /api/orders/[id] error:", error);

return NextResponse.json(
  { message: "Could not cancel the order. Please try again." },
  { status: 500 },
);

}
}