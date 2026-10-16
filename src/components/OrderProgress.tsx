"use client";

const steps = [
{ key: "pending", label: "Pending" },
{ key: "confirmed", label: "Confirmed" },
{ key: "processing", label: "Processing" },
{ key: "shipped", label: "Shipped" },
{ key: "delivered", label: "Delivered" },
] as const;

export default function OrderProgress({
status,
}: {
status: string;
}) {
if (status === "cancelled") {
return ( <div className="mt-4 rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-700">
This order has been cancelled. </div>
);
}

const currentIndex = steps.findIndex(
(step) => step.key === status
);

return ( <div className="mt-5 rounded-2xl border border-base-300 bg-base-100 p-4 sm:p-5"> <h3 className="mb-5 text-sm font-bold">Order progress</h3>

```
  <ol className="grid grid-cols-5 gap-1">
    {steps.map((step, index) => {
      const completed =
        currentIndex >= 0 && index <= currentIndex;

      return (
        <li key={step.key} className="min-w-0 text-center">
          <div
            className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
              completed
                ? "bg-success text-success-content"
                : "bg-base-300 text-base-content/60"
            }`}
          >
            {index + 1}
          </div>

          <p
            className={`mt-2 text-[10px] leading-4 sm:text-xs ${
              completed
                ? "font-semibold text-base-content"
                : "text-base-content/60"
            }`}
          >
            {step.label}
          </p>
        </li>
      );
    })}
  </ol>
</div>


);
}
