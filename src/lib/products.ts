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

type CategoryData = {
names: string[];
imageIds: string[];
basePrice: number;
};

const categoryData: Record<string, CategoryData> = {
fashion: {
names: [
"Classic T-Shirt", "Denim Jeans", "Casual Shirt", "Hoodie",
"Sneakers", "Leather Wallet", "Wrist Watch", "Travel Backpack",
"Sunglasses", "Polo Shirt", "Baseball Cap", "Running Shoes",
],
imageIds: [
"photo-1521572163474-6864f9cf17ab",
"photo-1542272604-787c3835535d",
"photo-1603252109303-2751441dd157",
"photo-1556821840-3a63f95609a7",
"photo-1542291026-7eec264c27ff",
"photo-1627123424574-724758594e93",
"photo-1523275335684-37898b6baf30",
"photo-1553062407-98eeb64c6a62",
"photo-1511499767150-a48a237f0083",
"photo-1586790170083-2f9ceadc732d",
"photo-1588850561407-ed78c282e89b",
"photo-1460353581641-37baddab0fa2",
],
basePrice: 500,
},

electronics: {
names: [
"Wireless Headphones", "Bluetooth Speaker", "Smart Watch",
"Wireless Mouse", "Mechanical Keyboard", "Power Bank",
"USB-C Charger", "Webcam", "Gaming Headset", "Laptop Stand",
"Portable SSD", "Desk Microphone",
],
imageIds: [
"photo-1505740420928-5e560c06d30e",
"photo-1608043152269-423dbba4e7e1",
"photo-1523275335684-37898b6baf30",
"photo-1527814050087-3793815479db",
"photo-1587829741301-dc798b83add3",
"photo-1609091839311-d5365f9ff1c5",
"photo-1583394838336-acd977736f90",
"photo-1587829741301-dc798b83add3",
"photo-1590658268037-6bf12165a8df",
"photo-1527864550417-7fd91fc51a46",
"photo-1597872200969-2b65d56bd16b",
"photo-1590602847861-f357a9332bbc",
],
basePrice: 800,
},

"home-living": {
names: [
"Modern Desk Lamp", "Wall Clock", "Cushion Set", "Ceramic Vase",
"Bedsheet Set", "Storage Organizer", "Table Lamp",
"Coffee Mug Set", "Wall Art", "Laundry Basket", "Floor Mat",
"Plant Pot",
],
imageIds: [
"photo-1507473885765-e6ed057f782c",
"photo-1563861826100-9cb868fdbe1c",
"photo-1584100936595-c0654b55a2e2",
"photo-1578500494198-246f612d3b3d",
"photo-1631049307264-da0ec9d70304",
"photo-1593085260707-5377ba37f868",
"photo-1507473885765-e6ed057f782c",
"photo-1514228742587-6b1558fcca3d",
"photo-1579783902614-a3fb3927b6a5",
"photo-1545173168-9f1947eebb7f",
"photo-1600210492486-724fe5c67fb0",
"photo-1485955900006-10f4d324d411",
],
basePrice: 300,
},

books: {
names: [
"Programming Fundamentals", "Learn JavaScript", "Clean Code",
"Atomic Habits", "Deep Work", "Psychology of Money",
"Think and Grow Rich", "Rich Dad Poor Dad", "English Grammar",
"Data Structures", "Artificial Intelligence", "Web Development Guide",
],
imageIds: [
"photo-1544947950-fa07a98d237f",
"photo-1512820790803-83ca734da794",
"photo-1543002588-bfa74002ed7e",
"photo-1541961017774-22349e4a1262",
"photo-1519682337058-a94d519337bc",
"photo-1553729459-efe14ef6055d",
"photo-1544947950-fa07a98d237f",
"photo-1543002588-bfa74002ed7e",
"photo-1456513080510-7bf3a84b82f8",
"photo-1532012197267-da84d127e765",
"photo-1512820790803-83ca734da794",
"photo-1544947950-fa07a98d237f",
],
basePrice: 200,
},

beauty: {
names: [
"Face Wash", "Moisturizing Cream", "Sunscreen Lotion",
"Perfume", "Hair Shampoo", "Hair Conditioner", "Body Lotion",
"Lip Balm", "Face Serum", "Hand Cream", "Makeup Brush Set",
"Body Wash",
],
imageIds: [
"photo-1556229010-6c3f2c9ca5f8",
"photo-1608248543803-ba4f8c70ae0b",
"photo-1556228720-195a672e8a03",
"photo-1541643600914-78b084683601",
"photo-1608248543803-ba4f8c70ae0b",
"photo-1608248543803-ba4f8c70ae0b",
"photo-1601049541289-9b1b7bbbfe19",
"photo-1586495777744-4413f21062fa",
"photo-1620916566398-39f1143ab7be",
"photo-1608248543803-ba4f8c70ae0b",
"photo-1522335789203-aabd1fc54bc9",
"photo-1601049541289-9b1b7bbbfe19",
],
basePrice: 250,
},

fitness: {
names: [
"Yoga Mat", "Dumbbell Set", "Resistance Bands", "Skipping Rope",
"Water Bottle", "Gym Gloves", "Exercise Ball", "Foam Roller",
"Push Up Bars", "Ankle Weights", "Fitness Tracker", "Gym Bag",
],
imageIds: [
"photo-1544367567-0f2fcb009e0b",
"photo-1583454110551-21f2fa2afe61",
"photo-1598289431512-b97b0917affc",
"photo-1434596922112-19c563067271",
"photo-1523362628745-0c100150b504",
"photo-1517836357463-d25dfeac3438",
"photo-1518611012118-696072aa579a",
"photo-1518611012118-696072aa579a",
"photo-1517836357463-d25dfeac3438",
"photo-1534438327276-14e5300c3a48",
"photo-1571019613454-1cb2f99b2d8b",
"photo-1517836357463-d25dfeac3438",
],
basePrice: 300,
},

grocery: {
names: [
"Basmati Rice", "Lentils", "Olive Oil", "Green Tea",
"Honey Jar", "Breakfast Oats", "Peanut Butter", "Pasta Pack",
"Mixed Nuts", "Coffee Beans", "Cereal Box", "Spice Set",
],
imageIds: [
"photo-1586201375761-83865001e31c",
"photo-1515543904379-3d757afe72e4",
"photo-1474979266404-7eaacbcd87c5",
"photo-1556679343-c7306c1976bc",
"photo-1587049352846-4a222e784d38",
"photo-1574323347407-f5e1ad6d020b",
"photo-1599599810694-b5b37304c041",
"photo-1551462147-ff29053bfc14",
"photo-1505576399274-565b52d4ac71",
"photo-1559056199-641a0ac8b55e",
"photo-1521483451569-e33803c0330c",
"photo-1596040033229-a9821ebd058d",
],
basePrice: 100,
},

kids: {
names: [
"Kids T-Shirt", "Baby Romper", "Building Blocks", "Toy Car",
"Story Book", "School Backpack", "Kids Sneakers",
"Plush Teddy Bear", "Coloring Set", "Baby Blanket",
"Kids Water Bottle", "Puzzle Game",
],
imageIds: [
"photo-1519238263530-99bdd11df2ea",
"photo-1519689680058-324335c77eba",
"photo-1599623560574-39d485900c95",
"photo-1594787318286-3d835c1d207f",
"photo-1512820790803-83ca734da794",
"photo-1553062407-98eeb64c6a62",
"photo-1503919005314-30d93d07d823",
"photo-1559454403-b8fb88521f11",
"photo-1513364776144-60967b0f800f",
"photo-1519689680058-324335c77eba",
"photo-1523362628745-0c100150b504",
"photo-1587654780291-39c9404d746b",
],
basePrice: 200,
},
};

export const CATEGORY_SLUGS = Object.keys(categoryData);

export const CATEGORY_LIST = [
{ slug: "fashion", name: "Fashion" },
{ slug: "electronics", name: "Electronics" },
{ slug: "home-living", name: "Home & Living" },
{ slug: "books", name: "Books" },
{ slug: "beauty", name: "Beauty & Personal Care" },
{ slug: "fitness", name: "Fitness" },
{ slug: "grocery", name: "Grocery" },
{ slug: "kids", name: "Kids" },
];

const categoryEntries = Object.entries(categoryData);

export const products: ProductView[] = Array.from(
{ length: 800 },
(_, index) => {
const categoryIndex = Math.floor(index / 100);
const itemIndex = index % 100;
const templateIndex = itemIndex % 12;
const [category, data] = categoryEntries[categoryIndex];


const name = data.names[templateIndex];
const slug = `${category}-${itemIndex + 1}`;
const price =
  data.basePrice +
  templateIndex * 100 +
  Math.floor(itemIndex / 12) * 25;

const categoryName =
  CATEGORY_LIST.find((item) => item.slug === category)?.name ?? category;

return {
  id: slug,
  slug,
  name: `${name} ${Math.floor(itemIndex / 12) + 1}`,
  description: `${name} from our ${categoryName} collection at Bangla Mart.`,
  price,
  comparePrice: Math.round(price * 1.2),
  category,
  images: [
    `https://images.unsplash.com/${data.imageIds[templateIndex]}?auto=format&fit=crop&w=600&q=80`,
  ],
  stock: 10 + (itemIndex % 40),
  sellerId: "bangla-mart",
  sellerName: "Bangla Mart Store",
  ratingAvg: 4 + (itemIndex % 10) / 10,
  ratingCount: 10 + itemIndex,
};


}
);

export async function getLatestProducts(limit = 8) {
return products.slice(0, limit);
}

export async function getProductBySlug(slug: string) {
return products.find((product) => product.slug === slug) ?? null;
}

export async function getRelatedProducts(
category: string,
excludeSlug?: string,
limit = 4
) {
return products
.filter(
(product) =>
product.category === category && product.slug !== excludeSlug
)
.slice(0, limit);
}

export async function listProducts({
q = "",
category = "",
sort = "newest",
min,
max,
page = 1,
limit = PAGE_SIZE,
}: {
q?: string;
category?: string;
sort?: string;
min?: number;
max?: number;
page?: number;
limit?: number;
} = {}) {
let filtered = [...products];

if (category) {
filtered = filtered.filter(
(product) => product.category === category
);
}

if (q.trim()) {
const query = q.trim().toLowerCase();


filtered = filtered.filter(
  (product) =>
    product.name.toLowerCase().includes(query) ||
    product.description.toLowerCase().includes(query)
);


}

if (min !== undefined) {
filtered = filtered.filter((product) => product.price >= min);
}

if (max !== undefined) {
filtered = filtered.filter((product) => product.price <= max);
}

if (sort === "price-asc") {
filtered.sort((a, b) => a.price - b.price);
} else if (sort === "price-desc") {
filtered.sort((a, b) => b.price - a.price);
} else if (sort === "rating") {
filtered.sort((a, b) => b.ratingAvg - a.ratingAvg);
} else {
filtered.sort((a, b) => b.id.localeCompare(a.id));
}

const total = filtered.length;
const totalPages = Math.ceil(total / limit);
const currentPage = Math.min(
Math.max(1, Math.floor(page) || 1),
Math.max(1, totalPages)
);
const start = (currentPage - 1) * limit;

return {
products: filtered.slice(start, start + limit),
total,
page: currentPage,
limit,
totalPages,
};
}
