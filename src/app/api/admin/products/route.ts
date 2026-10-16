
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";

export const runtime = "nodejs";

// সব active product দেখাবে
export async function GET() {
  try {
    await connectDB();

    const products = await Product.find({ status: "active" })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Get products error:", error);

    return NextResponse.json(
      { success: false, message: "পণ্য লোড করা যায়নি।" },
      { status: 500 }
    );
  }
}

// নতুন product যোগ করবে
export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();

    const requiredFields = [
      "name",
      "slug",
      "description",
      "price",
      "category",
    ];

    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === "") {
        return NextResponse.json(
          { success: false, message: `${field} দেওয়া বাধ্যতামূলক।` },
          { status: 400 }
        );
      }
    }

    const product = await Product.create({
      name: body.name,
      slug: body.slug,
      description: body.description,
      price: Number(body.price),
      comparePrice: Number(body.comparePrice ?? body.price),
      category: body.category,
      images: body.images ?? [],
      stock: Number(body.stock ?? 0),
      sellerId: body.sellerId ?? "demo-seller",
      sellerName: body.sellerName ?? "Bangla Mart Demo Store",
      status: body.status ?? "active",
      ratingAvg: 0,
      ratingCount: 0,
    });

    return NextResponse.json(
      { success: true, message: "Product added successfully.", product },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create product error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Product যোগ করা যায়নি। Slug আগে থেকে থাকলে অন্য slug ব্যবহার করো।",
      },
      { status: 500 }
    );
  }
}
