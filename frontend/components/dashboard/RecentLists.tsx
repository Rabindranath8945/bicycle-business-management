"use client";

export default function RecentLists() {
  const recentSales = [
    { inv: "INV-1001", customer: "Ravi", amount: 1200 },
    { inv: "INV-1002", customer: "Sita", amount: 450 },
    { inv: "INV-1003", customer: "Aman", amount: 980 },
    { inv: "INV-1004", customer: "Geeta", amount: 2300 },
    { inv: "INV-1005", customer: "Rahul", amount: 150 },
  ];

  const recentProducts = [
    { name: "Roadster 26", category: "Road", stock: 5 },
    { name: "Mountain X1", category: "MTB", stock: 2 },
    { name: "Kiddo 16", category: "Kids", stock: 12 },
    { name: "Hybrid H3", category: "Hybrid", stock: 8 },
    { name: "City Comf", category: "City", stock: 3 },
  ];

  const recentExpenses = [
    { inv: "EXP-1001", category: "Rent", amount: 3200 },
    { inv: "EXP-1002", category: "Electricity", amount: 1450 },
    { inv: "EXP-1003", category: "Maintenance", amount: 2100 },
    { inv: "EXP-1004", category: "Transport", amount: 800 },
    { inv: "EXP-1005", category: "Office Supplies", amount: 600 },
  ];

  const reports = [
    { title: "Sales Report", date: "Nov 2025", status: "Completed" },
    { title: "Purchase Report", date: "Nov 2025", status: "Completed" },
    { title: "Expense Report", date: "Nov 2025", status: "In Progress" },
    { title: "Profit & Loss", date: "Oct 2025", status: "Completed" },
    { title: "Stock Summary", date: "Nov 2025", status: "Pending" },
  ];

  return (
    <section className="mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Recent Sales */}
        <Card title="Recent Sales">
          {recentSales.map((s) => (
            <ListRow
              key={s.inv}
              primary={s.inv}
              secondary={s.customer}
              badge={`₹ ${s.amount}`}
              badgeColor="text-slate-800 dark:text-slate-200 font-semibold"
            />
          ))}
        </Card>

        {/* Recent Products */}
        <Card title="Recent Products">
          {recentProducts.map((p) => (
            <ListRow
              key={p.name}
              primary={p.name}
              secondary={p.category}
              badge={`${p.stock} in stock`}
              badgeColor={
                p.stock <= 3
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }
            />
          ))}
        </Card>

        {/* Recent Expenses */}
        <Card title="Recent Expenses">
          {recentExpenses.map((e) => (
            <ListRow
              key={e.inv}
              primary={e.inv}
              secondary={e.category}
              badge={`₹ ${e.amount}`}
              badgeColor="text-slate-800 dark:text-slate-200 font-semibold"
            />
          ))}
        </Card>

        {/* Reports */}
        <Card title="Reports">
          {reports.map((r) => (
            <ListRow
              key={r.title}
              primary={r.title}
              secondary={r.date}
              badge={r.status}
              badgeColor={
                r.status === "Completed"
                  ? "bg-emerald-100 text-emerald-700"
                  : r.status === "In Progress"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }
            />
          ))}
        </Card>
      </div>
    </section>
  );
}

/* -------------------------
   🔹 Reusable Components
-------------------------- */

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 transition">
      <h2 className="font-semibold mb-3 text-sm text-slate-700 dark:text-slate-200">
        {title}
      </h2>
      <div className="divide-y divide-slate-200 dark:divide-slate-700">
        {children}
      </div>
    </div>
  );
}

function ListRow({
  primary,
  secondary,
  badge,
  badgeColor,
}: {
  primary: string;
  secondary?: string;
  badge?: string;
  badgeColor?: string;
}) {
  return (
    <div className="py-2 flex items-center justify-between">
      <div>
        <div className="font-medium text-slate-800 dark:text-slate-100">
          {primary}
        </div>
        {secondary && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {secondary}
          </div>
        )}
      </div>
      {badge && (
        <div
          className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${badgeColor}`}
        >
          {badge}
        </div>
      )}
    </div>
  );
}
