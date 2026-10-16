
"use client";

import { useCart } from "@/components/CartProvider";
import { formatPrice } from "@/lib/format";
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const {
    items,
    count,
    subtotal,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  return (
    <div className="min-h-screen bg-paper">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        {/* Page Header */}
        <div className="mb-8">
          <Link
            href="/products"
            className="mb-5 inline-flex items-center gap-2 text-sm text-brand transition hover:opacity-70"
          >
            <ArrowLeft size={16} />
            Continue shopping
          </Link>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-brand">
                Your shopping bag
              </p>

              <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">
                Shopping Cart
              </h1>

              <p className="mt-2 text-sm text-ink/60">
                Review your items before checkout.
              </p>
            </div>

            {items.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="text-sm font-medium text-red-600 transition hover:text-red-700"
              >
                Clear cart
              </button>
            )}
          </div>
        </div>

        {/* Empty Cart */}
        {items.length === 0 ? (
          <div className="rounded-3xl border border-black/5 bg-white px-5 py-16 text-center shadow-sm sm:py-20">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand/10 text-brand">
              <ShoppingBag size={36} />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-ink">
              Your cart is empty
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-ink/60">
              Looks like you haven&apos;t added anything to your cart yet.
              Explore our products and find something you love.
            </p>

            <Link
              href="/products"
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-brand px-7 py-3 font-semibold text-white transition hover:bg-brand-dark"
            >
              <ShoppingCart size={18} />
              Explore products
            </Link>
          </div>
        ) : (
          <div className="grid items-start gap-6 lg:grid-cols-[1fr_360px]">
            {/* Cart Items */}
            <section className="rounded-3xl border border-black/5 bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center justify-between border-b border-black/5 pb-4">
                <h2 className="text-lg font-bold text-ink">Cart items</h2>

                <span className="rounded-full bg-brand/10 px-3 py-1 text-sm font-semibold text-brand">
                  {count} {count === 1 ? "item" : "items"}
                </span>
              </div>

              <div className="space-y-5">
                {items.map((item) => (
                  <article
                    key={item.id}
                    className="flex flex-col gap-4 border-b border-black/5 pb-5 last:border-b-0 last:pb-0 sm:flex-row"
                  >
                    {/* Product Image */}
                    <Link
                      href={`/products/${item.slug}`}
                      className="flex h-28 w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-sand sm:h-28 sm:w-28"
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ShoppingBag size={32} className="text-brand/40" />
                      )}
                    </Link>

                    {/* Product Details */}
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Link
                            href={`/products/${item.slug}`}
                            className="font-semibold text-ink transition hover:text-brand"
                          >
                            {item.name}
                          </Link>

                          <p className="mt-1 text-sm text-ink/60">
                            {formatPrice(item.price)} each
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          aria-label={`Remove ${item.name} from cart`}
                          className="rounded-full p-2 text-ink/50 transition hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        {/* Quantity Controls */}
                        <div className="inline-flex items-center rounded-full border border-black/10">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            aria-label={`Decrease quantity of ${item.name}`}
                            className="rounded-l-full p-2 transition hover:bg-sand disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            <Minus size={15} />
                          </button>

                          <span className="min-w-9 text-center text-sm font-semibold">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            disabled={item.quantity >= item.stock}
                            aria-label={`Increase quantity of ${item.name}`}
                            className="rounded-r-full p-2 transition hover:bg-sand disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            <Plus size={15} />
                          </button>
                        </div>

                        {/* Item Total */}
                        <p className="font-bold text-brand">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>

                      {item.quantity >= item.stock && item.stock > 0 && (
                        <p className="mt-2 text-xs text-ink/50">
                          Maximum available quantity reached.
                        </p>
                      )}

                      {item.stock <= 0 && (
                        <p className="mt-2 text-xs font-medium text-red-600">
                          This product is currently out of stock.
                        </p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Order Summary */}
            <aside className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-6">
              <h2 className="text-xl font-bold text-ink">Order Summary</h2>

              <div className="mt-6 space-y-4 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-ink/60">Subtotal</span>

                  <span className="font-semibold text-ink">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-ink/60">Shipping</span>

                  <span className="font-medium text-ink/60">
                    Calculated at checkout
                  </span>
                </div>

                <div className="border-t border-black/10 pt-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold text-ink">Total</span>

                    <span className="text-xl font-bold text-brand">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  <p className="mt-2 text-xs leading-5 text-ink/50">
                    Delivery charges, if applicable, will be added at checkout.
                  </p>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-brand px-5 py-3.5 font-semibold text-white transition hover:bg-brand-dark"
              >
                Proceed to Checkout
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/products"
                className="mt-3 flex w-full items-center justify-center rounded-full border border-brand/20 px-5 py-3 text-sm font-semibold text-brand transition hover:bg-brand/5"
              >
                Continue shopping
              </Link>

              <p className="mt-5 text-center text-xs leading-5 text-ink/50">
                Your cart is saved in this browser.
              </p>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

