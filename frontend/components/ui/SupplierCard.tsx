"use client";
export default function SupplierCard({ supplier }: any) {
  return (
    <div className="bg-white/60 p-3 rounded-lg border shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium">{supplier.name}</div>
          <div className="text-xs text-gray-500">
            Invoices: {supplier.invoices || Math.round(Math.random() * 20)}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-semibold">
            ₹{(supplier.total || 0).toLocaleString()}
          </div>
          <div className="text-xs text-gray-400">This month</div>
        </div>
      </div>
    </div>
  );
}
