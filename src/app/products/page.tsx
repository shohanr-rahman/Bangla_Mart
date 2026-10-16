import Link from "next/link";
import Pagination from "@/components/Pagination";
import ProductCard from "@/components/ProductCard";
import ProductFilters from "@/components/ProductFilters";
import { listProducts } from "@/lib/products";

export const dynamic = "force-dynamic";
export const metadata = { title: "Products" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const first = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v;

function toNumber(value: string) {
  if (!value) return undefined;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;

  const q = (first(sp.q) ?? "").trim().slice(0, 80);
  const category = first(sp.category) ?? "";
  const sort = first(sp.sort) ?? "newest";
  const min = first(sp.min) ?? "";
  const max = first(sp.max) ?? "";
  const page = Math.max(1, Math.floor(Number(first(sp.page))) || 1);

  const result = await listProducts({
    q,
    category,
    sort,
    min: toNumber(min),
    max: toNumber(max),
    page,
  });

  const params: Record<string, string> = {};
  if (q) params.q = q;
  if (category) params.category = category;
  if (sort !== "newest") params.sort = sort;
  if (min) params.min = min;
  if (max) params.max = max;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-5">
        <h1 className="text-3xl font-bold">All products</h1>
        <p className="mt-1 text-sm opacity-70">
          {result.total} {result.total === 1 ? "product" : "products"} found
        </p>
      </div>

      <ProductFilters values={{ q, category, sort, min, max }} />

      {result.products.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-base-300 bg-base-100 p-10 text-center">
          <p className="text-lg font-semibold">No products match your search</p>
          <p className="mt-1 text-sm opacity-70">
            Try a different keyword or clear the filters.
          </p>
          <Link href="/products" className="btn btn-primary mt-5">
            Clear filters
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {result.products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <Pagination
            page={result.page}
            totalPages={result.totalPages}
            params={params}
          />
        </>
      )}
    </div>
  );
}