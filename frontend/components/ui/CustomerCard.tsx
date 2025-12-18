"use client";

type Customer = {
  name: string;
  total: number;
};

export default function CustomerCard({ customer }: { customer: Customer }) {
  return (
    <div className="rounded-xl bg-white/70 backdrop-blur p-3 shadow border border-white/30">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium">{customer.name}</div>
          <div className="text-xs text-gray-500">Total Sales</div>
        </div>

        <div className="text-right">
          <div className="font-semibold text-emerald-600">
            ₹{customer.total.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
