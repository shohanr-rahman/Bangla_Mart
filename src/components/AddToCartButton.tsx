
"use client";

import { useState } from "react";
import { Check, ShoppingCart } from "lucide-react";
import { useCart } from "@/components/CartProvider";

type Props = {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: string[];
    stock: number;
  };
};

export default function AddToCartButton({ product }: Props) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const soldOut = product.stock <= 0;

  function handleAddToCart() {
    if (soldOut) return;

    addToCart({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.images[0] ?? "",
      stock: product.stock,
    });

    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={soldOut}
      className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
    >
      {soldOut ? (
        "Out of stock"
      ) : added ? (
        <>
          <Check size={18} />
          Added to cart
        </>
      ) : (
        <>
          <ShoppingCart size={18} />
          Add to cart
        </>
      )}
    </button>
  );
}
