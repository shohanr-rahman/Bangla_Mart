"use client";

import Link from "next/link";
import { CATEGORIES, SORT_OPTIONS } from "@/lib/constants";

type Values = {
q: string;
category: string;
sort: string;
min: string;
max: string;
};

export default function ProductFilters({ values }: { values: Values }) {
return ( <form
   action="/products"
   method="get"
   className="grid gap-3 rounded-2xl border border-base-300 bg-base-100 p-4 sm:grid-cols-2 lg:grid-cols-6"
 > <input
     name="q"
     defaultValue={values.q}
     placeholder="Search products..."
     className="input w-full lg:col-span-2"
   />


  <select
    name="category"
    defaultValue={values.category}
    className="select w-full"
  >
    <option value="">All categories</option>
    {CATEGORIES.map((category) => (
      <option key={category.slug} value={category.slug}>
        {category.label}
      </option>
    ))}
  </select>

  <select name="sort" defaultValue={values.sort} className="select w-full">
    {SORT_OPTIONS.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>

  <div className="flex gap-2">
    <input
      name="min"
      type="number"
      min="0"
      defaultValue={values.min}
      placeholder="Min ৳"
      className="input w-full"
    />
    <input
      name="max"
      type="number"
      min="0"
      defaultValue={values.max}
      placeholder="Max ৳"
      className="input w-full"
    />
  </div>

  <div className="flex items-center gap-2">
    <button type="submit" className="btn btn-primary flex-1">
      Apply
    </button>
    <Link href="/products" className="btn btn-ghost">
      Reset
    </Link>
  </div>
</form>


);
}
