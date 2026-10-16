import { Star } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { categoryMeta } from "@/lib/constants";
import { formatPrice } from "@/lib/format";
import { getProductBySlug, getRelatedProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return { title: product?.name ?? "Product not found" };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const category = categoryMeta(product.category);
  const related = await getRelatedProducts(product.category, product.id);
  const soldOut = product.stock <= 0;
  const discount =
    product.comparePrice && product.comparePrice > product.price
      ? Math.round(
          ((product.comparePrice - product.price) / product.comparePrice) * 100
        )
      : 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav className="mb-5 flex flex-wrap items-center gap-2 text-sm opacity-80">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        <span>›</span>
        <Link href="/products" className="hover:text-primary">
          Products
        </Link>
        <span>›</span>
        <Link
          href={`/products?category=${product.category}`}
          className="hover:text-primary"
        >
          {category.label}
        </Link>
      </nav>

      <div className="grid gap-8 rounded-2xl border border-base-300 bg-base-100 p-4 shadow-sm sm:p-6 md:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-xl bg-base-200">
          {product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-9xl">
              {category.emoji}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <Link
            href={`/products?category=${product.category}`}
            className="badge badge-primary badge-outline w-fit"
          >
            {category.emoji} {category.label}
          </Link>

          <h1 className="mt-3 text-2xl font-bold sm:text-3xl">{product.name}</h1>

          {product.ratingCount > 0 && (
            <p className="mt-2 flex items-center gap-1 text-sm">
              <Star className="h-5 w-5 fill-secondary text-secondary" />
              <span className="font-semibold">{product.ratingAvg.toFixed(1)}</span>
              <span className="opacity-60">({product.ratingCount} reviews)</span>
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            {discount > 0 && (
              <>
                <span className="text-lg line-through opacity-50">
                  {formatPrice(product.comparePrice as number)}
                </span>
                <span className="badge badge-secondary font-semibold">
                  Save {discount}%
                </span>
              </>
            )}
          </div>

          <p className="mt-4 leading-relaxed opacity-80">{product.description}</p>

          <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-base-200 p-3">
              <dt className="opacity-60">Availability</dt>
              <dd className={`font-semibold ${soldOut ? "text-error" : "text-success"}`}>
                {soldOut ? "Out of stock" : `In stock (${product.stock})`}
              </dd>
            </div>
            <div className="rounded-xl bg-base-200 p-3">
              <dt className="opacity-60">Sold by</dt>
              <dd className="font-semibold">{product.sellerName}</dd>
            </div>
          </dl>

          <div className="mt-6">
            <button type="button" disabled className="btn btn-primary btn-lg w-full sm:w-auto">
              {soldOut ? "Out of stock" : "Add to cart (coming soon)"}
            </button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-bold">Related products</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}