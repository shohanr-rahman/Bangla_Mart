
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  LoaderCircle,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import toast from "react-hot-toast";

import { useCart } from "@/components/CartProvider";
import { formatPrice } from "@/lib/format";

type CheckoutForm = {
  customerName: string;
  phone: string;
  address: string;
  city: string;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  const [form, setForm] = useState<CheckoutForm>({
    customerName: "",
    phone: "",
    address: "",
    city: "Dhaka",
  });

  const [submitting, setSubmitting] = useState(false);

  const deliveryCharge = 0;
  const total = subtotal + deliveryCharge;

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (items.length === 0) {
      toast.error("আপনার কার্টে কোনো পণ্য নেই।");
      router.push("/products");
      return;
    }

    if (submitting) return;

    setSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          items: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "অর্ডার সম্পন্ন করা যায়নি।");
        return;
      }

      clearCart();

      toast.success("আপনার অর্ডার সফলভাবে সম্পন্ন হয়েছে!");

      router.push(
        `/order-confirmation?order=${encodeURIComponent(result.order.orderNumber)}`
      );
    } catch {
      toast.error("সার্ভারের সঙ্গে সংযোগ করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <section className="min-h-[65vh] bg-base-100 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-xl rounded-3xl border border-base-300 bg-base-200/30 p-8 text-center sm:p-12">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <ShoppingBag className="h-8 w-8" />
          </span>

          <h1 className="mt-6 text-2xl font-extrabold text-base-content">
            আপনার কার্ট খালি
          </h1>

          <p className="mt-3 text-sm leading-6 text-base-content/60">
            Checkout করার আগে আপনার পছন্দের পণ্য কার্টে যোগ করুন।
          </p>

          <Link
            href="/products"
            className="btn btn-primary mt-7 rounded-xl px-6"
          >
            পণ্য দেখুন
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-base-100 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Breadcrumb */}
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-sm font-semibold text-base-content/60 transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          কার্টে ফিরে যান
        </Link>

        {/* Page heading */}
        <div className="mt-7">
          <span className="text-xs font-bold uppercase tracking-[2px] text-primary">
            নিরাপদ কেনাকাটা
          </span>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-base-content sm:text-4xl">
            Checkout
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-base-content/60">
            আপনার ডেলিভারি তথ্য দিন এবং অর্ডারের বিবরণ যাচাই করে অর্ডার সম্পন্ন করুন।
          </p>
        </div>

        {/* Checkout layout */}
        <div className="mt-9 grid gap-8 lg:grid-cols-[1fr_390px] lg:items-start">
          {/* Customer form */}
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-8"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <MapPin className="h-5 w-5" />
              </span>

              <div>
                <h2 className="text-lg font-bold text-base-content">
                  ডেলিভারি তথ্য
                </h2>
                <p className="mt-1 text-xs text-base-content/55">
                  পণ্য পৌঁছে দেওয়ার জন্য প্রয়োজনীয় তথ্য দিন।
                </p>
              </div>
            </div>

            <div className="mt-7 space-y-5">
              {/* Customer name */}
              <div>
                <label
                  htmlFor="customerName"
                  className="mb-2 block text-sm font-semibold text-base-content"
                >
                  আপনার নাম <span className="text-error">*</span>
                </label>

                <input
                  id="customerName"
                  name="customerName"
                  type="text"
                  autoComplete="name"
                  maxLength={100}
                  required
                  value={form.customerName}
                  onChange={handleChange}
                  placeholder="আপনার পুরো নাম লিখুন"
                  className="input h-12 w-full rounded-xl border-base-300 bg-base-100 focus:border-primary focus:outline-none"
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-semibold text-base-content"
                >
                  মোবাইল নম্বর <span className="text-error">*</span>
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  maxLength={20}
                  required
                  pattern="[0-9+()\-\s]{7,20}"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="01XXXXXXXXX"
                  className="input h-12 w-full rounded-xl border-base-300 bg-base-100 focus:border-primary focus:outline-none"
                />
              </div>

              {/* Address */}
              <div>
                <label
                  htmlFor="address"
                  className="mb-2 block text-sm font-semibold text-base-content"
                >
                  সম্পূর্ণ ঠিকানা <span className="text-error">*</span>
                </label>

                <textarea
                  id="address"
                  name="address"
                  autoComplete="street-address"
                  maxLength={500}
                  required
                  rows={4}
                  value={form.address}
                  onChange={handleChange}
                  placeholder="বাড়ি/ফ্ল্যাট নম্বর, রোড, এলাকা ইত্যাদি লিখুন"
                  className="textarea min-h-28 w-full resize-y rounded-xl border-base-300 bg-base-100 focus:border-primary focus:outline-none"
                />
              </div>

              {/* City */}
              <div>
                <label
                  htmlFor="city"
                  className="mb-2 block text-sm font-semibold text-base-content"
                >
                  শহর <span className="text-error">*</span>
                </label>

                <input
                  id="city"
                  name="city"
                  type="text"
                  autoComplete="address-level2"
                  maxLength={100}
                  required
                  value={form.city}
                  onChange={handleChange}
                  placeholder="আপনার শহরের নাম"
                  className="input h-12 w-full rounded-xl border-base-300 bg-base-100 focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            {/* Payment method */}
            <div className="mt-8 border-t border-base-300 pt-7">
              <h2 className="text-lg font-bold text-base-content">
                পেমেন্ট পদ্ধতি
              </h2>

              <div className="mt-4 flex items-start gap-4 rounded-2xl border-2 border-primary/40 bg-primary/5 p-4">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-primary">
                  <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                </span>

                <div className="flex-1">
                  <p className="text-sm font-bold text-base-content">
                    Cash on Delivery (COD)
                  </p>
                  <p className="mt-1 text-xs leading-5 text-base-content/60">
                    পণ্য হাতে পাওয়ার সময় টাকা পরিশোধ করুন।
                  </p>
                </div>

                <Truck className="h-5 w-5 shrink-0 text-primary" />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting || items.length === 0}
              className="btn btn-primary mt-8 h-13 w-full rounded-xl text-base font-bold shadow-lg shadow-primary/15"
            >
              {submitting ? (
                <>
                  <LoaderCircle className="h-5 w-5 animate-spin" />
                  অর্ডার করা হচ্ছে...
                </>
              ) : (
                <>
                  অর্ডার সম্পন্ন করুন
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>

            <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-base-content/50">
              <ShieldCheck className="h-4 w-4 text-primary" />
              আপনার তথ্য নিরাপদে ব্যবহারের জন্য সংরক্ষিত হবে।
            </p>
          </form>

          {/* Order summary */}
          <aside className="lg:sticky lg:top-28">
            <div className="rounded-3xl border border-base-300 bg-base-200/30 p-5 sm:p-7">
              <h2 className="text-lg font-extrabold text-base-content">
                আপনার অর্ডার
              </h2>

              <p className="mt-1 text-sm text-base-content/55">
                {items.length} ধরনের পণ্য
              </p>

              <div className="mt-6 space-y-5">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-4"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="break-words text-sm font-semibold leading-5 text-base-content">
                        {item.name}
                      </p>

                      <p className="mt-1 text-xs text-base-content/55">
                        পরিমাণ: {item.quantity}
                      </p>

                      <p className="mt-1 text-xs text-base-content/55">
                        প্রতি পিস: {formatPrice(item.price)}
                      </p>
                    </div>

                    <p className="shrink-0 text-sm font-bold text-base-content">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="my-6 border-t border-dashed border-base-300" />

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-base-content/60">পণ্যের মূল্য</span>
                  <span className="font-semibold text-base-content">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-base-content/60">ডেলিভারি চার্জ</span>
                  <span className="font-semibold text-success">
                    {deliveryCharge === 0
                      ? "ফ্রি"
                      : formatPrice(deliveryCharge)}
                  </span>
                </div>
              </div>

              <div className="my-5 border-t border-base-300" />

              <div className="flex items-center justify-between gap-3">
                <span className="font-bold text-base-content">
                  সর্বমোট
                </span>

                <span className="text-2xl font-extrabold text-primary">
                  {formatPrice(total)}
                </span>
              </div>

              <div className="mt-6 flex items-start gap-3 rounded-2xl bg-base-100 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                <p className="text-xs leading-5 text-base-content/60">
                  অর্ডার নিশ্চিত করার আগে আপনার দেওয়া ঠিকানা ও পণ্যের পরিমাণ
                  ভালোভাবে যাচাই করুন।
                </p>
              </div>
            </div>

            <Link
              href="/products"
              className="mt-4 flex items-center justify-center gap-2 py-3 text-sm font-semibold text-base-content/60 transition-colors hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              আরও পণ্য দেখুন
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}