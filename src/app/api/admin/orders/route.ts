
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { Order } from "@/models/Order";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireRole(["admin"], "/admin");
    await connectDB();

    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(100)
      .lean()
      .exec();

    return NextResponse.json({
      orders: orders.map((order) => ({
        id: String(order._id),
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        phone: order.phone,
        address: order.address,
        city: order.city,
        items: order.items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          sellerName: item.sellerName,
        })),
        subtotal: order.subtotal,
        deliveryCharge: order.deliveryCharge,
        total: order.total,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        createdAt: order.createdAt,
      })),
    });
  } catch (error) {
    console.error("Admin orders API error:", error);

    return NextResponse.json(
      { message: "Unable to load orders." },
      { status: 500 }
    );
  }
}
