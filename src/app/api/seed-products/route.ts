import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";

export const runtime = "nodejs";

const sampleProducts = [
{
name: "Wireless Headphones",
slug: "demo-wireless-headphones",
description: "Comfortable wireless headphones for music and everyday use.",
price: 1500,
comparePrice: 2000,
category: "electronics",
images: [],
stock: 20,
sellerId: "demo-seller",
sellerName: "Bangla Mart Demo Store",
status: "active" as const,
ratingAvg: 4.5,
ratingCount: 12,
},
{
name: "Classic Backpack",
slug: "demo-classic-backpack",
description: "A practical backpack for university, work, and travel.",
price: 1200,
comparePrice: 1600,
category: "fashion",
images: [],
stock: 15,
sellerId: "demo-seller",
sellerName: "Bangla Mart Demo Store",
status: "active" as const,
ratingAvg: 4.3,
ratingCount: 8,
},
{
name: "Desk Lamp",
slug: "demo-desk-lamp",
description: "A simple desk lamp for studying and working.",
price: 850,
comparePrice: 1000,
category: "home-living",
images: [],
stock: 25,
sellerId: "demo-seller",
sellerName: "Bangla Mart Demo Store",
status: "active" as const,
ratingAvg: 4.2,
ratingCount: 6,
},
{
name: "Programming Basics Book",
slug: "demo-programming-book",
description: "A beginner-friendly introduction to programming concepts.",
price: 500,
comparePrice: 650,
category: "books",
images: [],
stock: 30,
sellerId: "demo-seller",
sellerName: "Bangla Mart Demo Store",
status: "active" as const,
ratingAvg: 4.7,
ratingCount: 10,
},
];

export async function POST() {
try {
await connectDB();


const results = await Promise.all(
  sampleProducts.map((product) =>
    Product.updateOne(
      { slug: product.slug },
      { $setOnInsert: product },
      { upsert: true }
    )
  )
);

const inserted = results.filter(
  (result) => result.upsertedCount > 0
).length;

return NextResponse.json({
  success: true,
  message: `${inserted} new demo products added. Existing demo products were kept.`,
});


} catch (error) {
console.error("Seed products error:", error);


return NextResponse.json(
  { success: false, message: "Could not add demo products." },
  { status: 500 }
);


}
}
