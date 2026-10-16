export const CATEGORIES = [
  { slug: "electronics", label: "Electronics", emoji: "📱" },
  { slug: "fashion", label: "Fashion", emoji: "👕" },
  { slug: "home-living", label: "Home & Living", emoji: "🏠" },
  { slug: "groceries", label: "Groceries", emoji: "🛒" },
  { slug: "beauty", label: "Beauty & Care", emoji: "💄" },
  { slug: "books", label: "Books & Stationery", emoji: "📚" },
  { slug: "sports", label: "Sports & Fitness", emoji: "⚽" },
  { slug: "toys", label: "Toys & Kids", emoji: "🧸" },
] as const;

export const CATEGORY_SLUGS: string[] = CATEGORIES.map((c) => c.slug);

export function categoryMeta(slug: string) {
  return (
    CATEGORIES.find((c) => c.slug === slug) ?? {
      slug,
      label: slug,
      emoji: "🛍️",
    }
  );
}

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
] as const;