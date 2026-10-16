
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  MapPin,
  Package,
  ShoppingBag,
  Truck,
} from "lucide-react";

import { connectDB } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { getSession } from "@/lib/session";
import { Order } from "@/models/Order";

export const dynamic = "force-dynamic";

type OrderItem = {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  quantity: number;
  sellerId: string;
  sellerName: string;
};

type OrderDetails = {
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: Date;
};

type PageProps = {
  searchParams: Promise<{
    order?: string;
  }>;
};

export default async function OrderConfirmationPage({
  searchParams,
}: PageProps) {
  const { order: orderNumber } = await searchParams;

  if (
    !orderNumber ||
    orderNumber.length > 100 ||
    !/^BM-[A-Z0-9-]+$/i.test(orderNumber)
  ) {
    redirect("/dashboard");
  }

  const session = await getSession();

  if (!session?.user?.id) {
    redirect("/signin");
  }

  let order: OrderDetails | null = null;

  try {
    await connectDB();

    const foundOrder = await Order.findOne({
      orderNumber,
      buyerId: session.user.id,
    })
      .lean()
      .exec();

    if (foundOrder) {
      order = {
        orderNumber: foundOrder.orderNumber,
        customerName: foundOrder.customerName,
        phone: foundOrder.phone,
        address: foundOrder.address,
        city: foundOrder.city,
        items: foundOrder.items.map((item) => ({
          productId: item.productId,
          name: item.name,
          slug: item.slug,
          image: item.image ?? "",
          price: item.price,
          quantity: item.quantity,
          sellerId: item.sellerId,
          sellerName: item.sellerName,
        })),
        subtotal: foundOrder.subtotal,
        deliveryCharge: foundOrder.deliveryCharge,
        total: foundOrder.total,
        paymentMethod: foundOrder.paymentMethod,
        paymentStatus: foundOrder.paymentStatus,
        orderStatus: foundOrder.orderStatus,
        createdAt: foundOrder.createdAt,
      };
    }
  } catch {
    order = null;
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-paper px-4 py-16">
        <div className="mx-auto max-w-lg rounded-3xl border border-black/5 bg-white p-8 text-center shadow-sm">
          <Package className="mx-auto h-12 w-12 text-brand/60" />

          <h1 className="mt-5 text-2xl font-bold text-ink">
            Order not found
          </h1>

          <p className="mt-3 text-sm leading-6 text-ink/60">
            We couldn&apos;t find this order. Please check your order link or
            visit your dashboard.
          </p>

          <Link
            href="/dashboard"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand-dark"
          >
            <ArrowLeft size={17} />
            Go to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  const formattedDate = new Intl.DateTimeFormat("en-BD", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Asia/Dhaka",
  }).format(new Date(order.createdAt));

  return (
    <main className="min-h-screen bg-paper px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-4xl">
        {/* Success Header */}
        <section className="rounded-3xl border border-black/5 bg-white px-5 py-10 text-center shadow-sm sm:px-10">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
            <CheckCircle2 className="h-11 w-11 text-green-600" />
          </div>

          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-brand">
            Order placed successfully
          </p>

          <h1 className="mt-3 font-display text-3xl font-bold text-ink sm:text-4xl">
            Thank you for your order!
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-ink/60">
            Thank you for shopping with Bangla Mart. Your order has been
            received, and you can check its status from your dashboard.
          </p>

          <div className="mx-auto mt-7 inline-flex flex-wrap items-center justify-center gap-2 rounded-full bg-brand/5 px-5 py-3">
            <Package size={18} className="text-brand" />

            <span className="text-sm text-ink/60">Order number:</span>

            <span className="font-bold text-brand">{order.orderNumber}</span>
          </div>

          <p className="mt-4 text-xs text-ink/50">
            Placed on {formattedDate}
          </p>
        </section>

        <div className="mt-6 grid items-start gap-6 md:grid-cols-[1fr_320px]">
          {/* Ordered Products */}
          <section className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm sm:p-7">
            <h2 className="text-xl font-bold text-ink">Order Details</h2>

            <div className="mt-6 space-y-5">
              {order.items.map((item) => (
                <article
                  key={item.productId}
                  className="flex gap-4 border-b border-black/5 pb-5 last:border-0 last:pb-0"
                >
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-sand">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ShoppingBag className="h-8 w-8 text-brand/40" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-ink">{item.name}</h3>

                    <p className="mt-1 text-sm text-ink/60">
                      Quantity: {item.quantity}
                    </p>

                    <p className="mt-2 font-bold text-brand">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            {/* Price Summary */}
            <div className="mt-6 space-y-3 border-t border-black/10 pt-5 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-ink/60">Subtotal</span>
                <span className="font-medium text-ink">
                  {formatPrice(order.subtotal)}
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <span className="text-ink/60">Delivery charge</span>
                <span className="font-medium text-ink">
                  {order.deliveryCharge === 0
                    ? "Free"
                    : formatPrice(order.deliveryCharge)}
                </span>
              </div>

              <div className="flex justify-between gap-3 border-t border-black/10 pt-4">
                <span className="font-bold text-ink">Total</span>
                <span className="text-xl font-bold text-brand">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          </section>

          {/* Delivery and Payment */}
          <aside className="space-y-6">
            <section className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-bold text-ink">
                Delivery Information
              </h2>

              <div className="mt-5 flex gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand" />

                <div>
                  <p className="font-semibold text-ink">
                    {order.customerName}
                  </p>

                  <p className="mt-1 text-sm leading-6 text-ink/60">
                    {order.address}
                    <br />
                    {order.city}
                    <br />
                    Phone: {order.phone}
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-black/10 pt-5">
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-brand" />

                  <div>
                    <p className="text-sm font-semibold text-ink">
                      Order Status
                    </p>

                    <p className="mt-1 text-sm capitalize text-ink/60">
                      {order.orderStatus}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-3">
                  <Clock className="h-5 w-5 text-brand" />

                  <div>
                    <p className="text-sm font-semibold text-ink">
                      Payment Method
                    </p>

                    <p className="mt-1 text-sm text-ink/60">
                      {order.paymentMethod === "cod"
                        ? "Cash on Delivery"
                        : order.paymentMethod}
                    </p>
                  </div>
                </div>

                <p className="mt-4 rounded-xl bg-sand px-4 py-3 text-xs leading-5 text-ink/60">
                  Payment status:{" "}
                  <span className="font-semibold capitalize text-ink">
                    {order.paymentStatus}
                  </span>
                </p>
              </div>
            </section>

            <Link
              href="/dashboard"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-brand px-5 py-3.5 font-semibold text-white transition hover:bg-brand-dark"
            >
              Go to Dashboard
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Link>

            <Link
              href="/products"
              className="flex w-full items-center justify-center gap-2 rounded-full border border-brand/20 px-5 py-3.5 font-semibold text-brand transition hover:bg-brand/5"
            >
              <ShoppingBag className="h-4 w-4" />
              Continue Shopping
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
