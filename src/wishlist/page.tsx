"use client";

import Image from "next/image";
import Link from "next/link";
import {
ArrowLeft,
ArrowRight,
Heart,
ShoppingBag,
ShoppingCart,
Trash2,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import { useWishlist } from "@/components/WishlistProvider";
import { useCart } from "@/components/CartProvider";
import { formatPrice } from "@/lib/format";

export default function WishlistPage() {
const { items, removeFromWishlist } = useWishlist();
const { addToCart } = useCart();
const [ready, setReady] = useState(false);

function handleAddToCart(item: (typeof items)[number]) {
if (item.stock <= 0) {
toast.error("This product is out of stock.");
return;
}


addToCart(item);
toast.success(`${item.name} added to cart!`);


}

function handleRemove(id: string, name: string) {
removeFromWishlist(id);
toast.success(`${name} removed from wishlist.`);
}

return ( <div className="min-h-[70vh] bg-paper"> <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
{/* Page heading */} <div className="mb-10"> <Link
         href="/products"
         className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-base-content/60 transition hover:text-primary"
       > <ArrowLeft className="h-4 w-4" />
Continue shopping </Link>


      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[2px] text-primary">
            <Heart className="h-4 w-4" />
            Your favourites
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            My Wishlist<span className="text-primary">.</span>
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-base-content/60 sm:text-base">
            Keep the products you love in one place and come back to them
            whenever you like.
          </p>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-base-300 bg-base-100 px-4 py-2 text-sm font-semibold text-base-content/70">
          <Heart className="h-4 w-4 text-rose-500" />
          {items.length} {items.length === 1 ? "item" : "items"}
        </div>
      </div>
    </div>

    {/* Empty state */}
    {items.length === 0 ? (
      <div className="rounded-3xl border border-base-300 bg-base-100 px-5 py-16 text-center sm:py-20">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-rose-50 text-rose-500">
          <Heart className="h-9 w-9" />
        </div>

        <h2 className="mt-6 text-xl font-bold text-ink sm:text-2xl">
          Your wishlist is waiting
        </h2>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-base-content/60">
          You haven&apos;t saved any products yet. Explore our collection
          and tap the heart on products you love.
        </p>

        <Link
          href="/products"
          className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-content transition hover:opacity-90"
        >
          <ShoppingBag className="h-4 w-4" />
          Explore products
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    ) : (
      <>
        {/* Wishlist items */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm transition hover:shadow-md"
            >
              <Link
                href={`/products/${item.slug}`}
                className="relative block aspect-[4/3] overflow-hidden bg-base-200"
              >
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-300 hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <ShoppingBag className="h-12 w-12 text-base-content/30" />
                  </div>
                )}

                <span className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-rose-500 text-white shadow-md">
                  <Heart className="h-5 w-5" fill="currentColor" />
                </span>
              </Link>

              <div className="p-4 sm:p-5">
                <Link
                  href={`/products/${item.slug}`}
                  className="line-clamp-2 text-base font-bold text-ink transition hover:text-primary"
                >
                  {item.name}
                </Link>

                <p className="mt-3 text-xl font-extrabold text-primary">
                  {formatPrice(item.price)}
                </p>

                {item.stock <= 0 && (
                  <p className="mt-2 text-xs font-semibold text-error">
                    Currently out of stock
                  </p>
                )}

                <div className="mt-5 grid grid-cols-[1fr_auto] gap-2">
                  <button
                    type="button"
                    onClick={() => handleAddToCart(item)}
                    disabled={item.stock <= 0}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-content transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Add to cart
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemove(item.id, item.name)}
                    aria-label={`Remove ${item.name} from wishlist`}
                    title="Remove from wishlist"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-base-300 text-base-content/60 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-100 px-6 py-3 text-sm font-bold text-ink transition hover:border-primary/30 hover:text-primary"
          >
            Discover more products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </>
    )}
  </div>
</div>


);
}
