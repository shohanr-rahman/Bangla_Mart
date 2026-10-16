export const CATEGORIES = [
{ slug: "fashion", label: "Fashion" },
{ slug: "electronics", label: "Electronics" },
{ slug: "home-living", label: "Home & Living" },
{ slug: "books", label: "Books" },
{ slug: "beauty", label: "Beauty & Personal Care" },
{ slug: "fitness", label: "Fitness" },
{ slug: "grocery", label: "Grocery" },
{ slug: "kids", label: "Kids" },
];

export const CATEGORY_SLUGS = CATEGORIES.map(
(category) => category.slug
);

export const SORT_OPTIONS = [
{ value: "newest", label: "Newest" },
{ value: "price-asc", label: "Price: Low to High" },
{ value: "price-desc", label: "Price: High to Low" },
{ value: "rating", label: "Top Rated" },
];

export function categoryMeta(categorySlug: string) {
const category = CATEGORIES.find(
(category) => category.slug === categorySlug
);

const emojiMap: Record<string, string> = {
fashion: "👕",
electronics: "📱",
"home-living": "🏠",
books: "📚",
beauty: "💄",
fitness: "🏋️",
grocery: "🛒",
kids: "🧸",
};

return {
label: category?.label ?? "Other",
emoji: emojiMap[categorySlug] ?? "📦",
};
}
