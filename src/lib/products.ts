import { cache } from "react";
import { Product } from "@/models/Product";
import { CATEGORY_SLUGS } from "./constants";
import { connectDB } from "./db";

export const PAGE_SIZE = 12;

export type ProductView = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  category: string;
  images: string[];
  stock: number;
  sellerId: string;
  sellerName: string;
  ratingAvg: number;
  ratingCount: number;
};

type Raw = {
  _id: unknown;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number | null;
  category: string;
  images?: string[];
  stock: number;
  sellerId: string;
  sellerName: string;
  ratingAvg?: number;
  ratingCount?: number;
};

function toView(d: Raw): ProductView {
  return {
    id: String(d._id),
    name: d.name,
    slug: d.slug,
    description: d.description,
    price: d.price,
    comparePrice: d.comparePrice ?? undefined,
    category: d.category,
    images: d.images ?? [],
    stock: d.stock,
    sellerId: d.sellerId,
    sellerName: d.sellerName,
    ratingAvg: d.ratingAvg ?? 0,
    ratingCount: d.ratingCount ?? 0,
  };
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export type ListFilters = {
  q?: string;
  category?: string;
  sort?: string;
  min?: number;
  max?: number;
  page?: number;
};

export async function listProducts(filters: ListFilters) {
  await connectDB();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const query: Record<string, any> = { status: "active" };

  if (filters.q) {
    query.name = { $regex: escapeRegex(filters.q), $options: "i" };
  }
  if (filters.category && CATEGORY_SLUGS.includes(filters.category)) {
    query.category = filters.category;
  }
  if (filters.min !== undefined || filters.max !== undefined) {
    query.price = {};
    if (filters.min !== undefined) query.price.$gte = filters.min;
    if (filters.max !== undefined) query.price.$lte = filters.max;
  }

  const sorts: Record<string, Record<string, 1 | -1>> = {
    newest: { createdAt: -1 },
    "price-asc": { price: 1 },
    "price-desc": { price: -1 },
    rating: { ratingAvg: -1, ratingCount: -1 },
  };
  const sort = sorts[filters.sort ?? "newest"] ?? sorts.newest;

  const page = Math.max(1, filters.page ?? 1);

  const [docs, total] = await Promise.all([
    Product.find(query)
      .sort(sort)
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .lean(),
    Product.countDocuments(query),
  ]);

  return {
    products: (docs as unknown as Raw[]).map(toView),
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

export async function getLatestProducts(limit = 8) {
  await connectDB();
  const docs = await Product.find({ status: "active" })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
  return (docs as unknown as Raw[]).map(toView);
}

export const getProductBySlug = cache(async (slug: string) => {
  await connectDB();
  const doc = await Product.findOne({ slug, status: "active" }).lean();
  return doc ? toView(doc as unknown as Raw) : null;
});

export async function getRelatedProducts(category: string, excludeId: string) {
  await connectDB();
  const docs = await Product.find({
    category,
    status: "active",
    _id: { $ne: excludeId },
  })
    .limit(4)
    .lean();
  return (docs as unknown as Raw[]).map(toView);
}