"use client";

import { Heart, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { categoryMeta } from "@/lib/constants";
import { formatPrice } from "@/lib/format";
import type { ProductView } from "@/lib/products";
import { useWishlist } from "@/components/WishlistProvider";

export default function ProductCard({
product,
}: {
product: ProductView;
}) {
const category = categoryMeta(product.category);
const soldOut = product.stock <= 0;

const { isWishlisted, toggleWishlist } = useWishlist();
const [ready, setReady] = useState(false);

const wishlisted = ready && isWishlisted(String(product.id));

const discount =
product.comparePrice && product.comparePrice > product.price
? Math.round(
((product.comparePrice - product.price) / product.comparePrice) * 100
)
: 0;

function handleWishlistClick(
event: React.MouseEvent<HTMLButtonElement>
) {
event.preventDefault();
event.stopPropagation();


toggleWishlist({
  id: String(product.id),
  name: product.name,
  slug: product.slug,
  price: product.price,
  image: product.images[0] ?? "",
  stock: product.stock,
});

setReady(true);


}

return (
<Link
href={`/products/${product.slug}`}
className="group flex flex-col overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
> <div className="relative aspect-square bg-base-200">
{product.images[0] ? ( <img
         src={product.images[0]}
         alt={product.name}
         className="h-full w-full object-cover"
       />
) : ( <div className="flex h-full w-full items-center justify-center text-6xl">
{category.emoji} </div>
)}


    {discount > 0 && !soldOut && (
      <span className="badge badge-secondary absolute left-2 top-2 font-semibold">
        -{discount}%
      </span>
    )}

    {soldOut && (
      <span className="badge badge-neutral absolute left-2 top-2">
        Out of stock
      </span>
    )}

    <button
      type="button"
      onClick={handleWishlistClick}
      aria-label={
        wishlisted ? "Remove from wishlist" : "Add to wishlist"
      }
      aria-pressed={wishlisted}
      title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      className={`absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full shadow-md backdrop-blur-sm transition-all duration-200 hover:scale-110 ${
        wishlisted
          ? "bg-rose-500 text-white"
          : "bg-base-100/90 text-base-content hover:bg-rose-50 hover:text-rose-500"
      }`}
    >
      <Heart
        className="h-5 w-5"
        fill={wishlisted ? "currentColor" : "none"}
        strokeWidth={2}
      />
    </button>
  </div>

  <div className="flex flex-1 flex-col gap-1 p-3 sm:p-4">
    <p className="text-xs opacity-60">{category.label}</p>

    <h3 className="line-clamp-2 font-semibold group-hover:text-primary">
      {product.name}
    </h3>

    {product.ratingCount > 0 && (
      <p className="flex items-center gap-1 text-xs opacity-80">
        <Star className="h-4 w-4 fill-secondary text-secondary" />
        {product.ratingAvg.toFixed(1)}
        <span className="opacity-60">({product.ratingCount})</span>
      </p>
    )}

    <div className="mt-auto flex items-baseline gap-2 pt-2">
      <span className="text-lg font-bold text-primary">
        {formatPrice(product.price)}
      </span>

      {discount > 0 && (
        <span className="text-sm line-through opacity-50">
          {formatPrice(product.comparePrice as number)}
        </span>
      )}
    </div>
  </div>
</Link>


);
}
