import { connectDB } from "../src/lib/db";
import { Product } from "../src/models/Product";
import mongoose from "mongoose";

type Seed = [
  category: string,
  name: string,
  price: number,
  comparePrice: number,
  stock: number,
  description: string,
];

const DATA: Seed[] = [
  ["electronics", "Wireless Bluetooth Earbuds", 1890, 2490, 40, "Low-latency earbuds with up to 24 hours of battery life with the charging case and a built-in microphone."],
  ["electronics", "20000mAh Power Bank", 2250, 2800, 25, "Fast-charging power bank with dual USB output, LED indicator and over-charge protection."],
  ["fashion", "Cotton Panjabi - Classic Fit", 1650, 1990, 30, "Soft, breathable cotton panjabi with fine embroidery, perfect for festivals and everyday wear."],
  ["fashion", "Women's Printed Three-Piece", 2890, 3490, 18, "Lightweight printed three-piece set with a matching dupatta, comfortable for all-day wear."],
  ["home-living", "Stainless Steel Water Bottle 1L", 750, 950, 60, "Double-wall insulated bottle that keeps drinks cold for 12 hours and hot for 8 hours."],
  ["home-living", "Cotton Bed Sheet Set - Double", 1990, 2490, 22, "Premium cotton double bed sheet with two pillow covers, colour-fast and easy to wash."],
  ["groceries", "Premium Miniket Rice 5kg", 460, 520, 100, "Fresh, polished miniket rice, carefully sorted and packed for long-lasting aroma."],
  ["groceries", "Pure Mustard Oil 1L", 330, 370, 80, "Cold-pressed mustard oil with the traditional pungent taste, ideal for cooking and pickles."],
  ["beauty", "Herbal Face Wash 100ml", 280, 350, 70, "Gentle herbal face wash that removes oil and dirt without drying out your skin."],
  ["beauty", "Natural Aloe Vera Gel 200ml", 390, 450, 55, "Soothing multipurpose aloe vera gel for skin and hair, free from harsh chemicals."],
  ["books", "Programming Fundamentals (Bangla)", 520, 650, 45, "A beginner-friendly Bangla guide to programming concepts with practical examples."],
  ["books", "Notebook Pack - 5 Pcs A5", 350, 420, 90, "Five ruled A5 notebooks with sturdy covers and smooth, ink-friendly paper."],
  ["sports", "Yoga Mat 6mm Anti-slip", 980, 1250, 35, "Cushioned 6mm yoga mat with a textured anti-slip surface and a carrying strap."],
  ["sports", "Adjustable Skipping Rope", 260, 320, 75, "Tangle-free skipping rope with foam handles and an adjustable length for all heights."],
  ["toys", "Wooden Building Blocks 100 Pcs", 890, 1100, 28, "Colourful non-toxic wooden blocks that boost creativity and motor skills in kids."],
  ["toys", "Remote Control Car", 1450, 1790, 0, "Rechargeable remote control car with shock-absorbing wheels and LED headlights."],
];

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function main() {
  await connectDB();

  await Product.deleteMany({ sellerId: "seed-demo" });

  const docs = DATA.map(
    ([category, name, price, comparePrice, stock, description], i) => ({
      name,
      slug: slugify(name),
      description,
      price,
      comparePrice,
      category,
      images: [],
      stock,
      sellerId: "seed-demo",
      sellerName: "Bangla Mart Demo Store",
      status: "active" as const,
      ratingAvg: Number((4 + ((i * 3) % 9) / 10).toFixed(1)),
      ratingCount: 12 + i * 7,
    })
  );

  await Product.insertMany(docs);
  console.log(`Seeded ${docs.length} products`);

  await mongoose.disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});