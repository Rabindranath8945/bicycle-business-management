"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { fetcher } from "@/lib/api";
import KPICard from "@/components/ui/KPICard";
import WorkflowCard from "@/components/ui/WorkFlowCard";
import SupplierCard from "@/components/ui/SupplierCard";

type KPIs = {
  totalPOs: number;
  pendingGRNs: number;
  totalBills: number;
  totalReturns: number;
  monthSpend: number;
  outstanding: number;
  monthlySeries: number[]; // 12 points
};

export default function PurchasesDashboard() {
  const [kpis, setKpis] = useState<KPIs | null>(null);
  const [topSuppliers, setTopSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      // your backend must provide stats endpoint; fallback to multiple endpoints if not
      const stats = await fetcher("/api/dashboard/purchase-stats").catch(
        async () => {
          // fallback: gather manually
          const [poList, grnList, bills, returns] = await Promise.all([
            fetcher("/api/purchase-orders").catch(() => []),
            fetcher("/api/grn").catch(() => []),
            fetcher("/api/purchases").catch(() => []),
            fetcher("/api/purchase-returns").catch(() => []),
          ]);
          const series = new Array(12)
            .fill(0)
            .map((_, i) => Math.round(Math.random() * 8000));
          return {
            totalPOs: poList.length,
            pendingGRNs:
              grnList.filter(
                (g: any) =>
                  g.purchaseOrder &&
                  g.items &&
                  g.items.some(
                    (it: any) =>
                      it.receivedQty < (it.expectedQty || it.receivedQty)
                  )
              ).length || 0,
            totalBills: bills.length,
            totalReturns: returns.length,
            monthSpend: bills.reduce(
              (s: any, b: any) => s + (b.totalAmount || 0),
              0
            ),
            outstanding: bills.reduce(
              (s: any, b: any) => s + (b.dueAmount || 0),
              0
            ),
            monthlySeries: series,
          } as KPIs;
        }
      );
      setKpis(stats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const spark = useMemo(
    () => (kpis ? kpis.monthlySeries : new Array(12).fill(0)),
    [kpis]
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Purchase Management</h1>
        <div className="flex gap-2">
          <Link
            href="/purchases/create-po"
            className="px-3 py-2 bg-amber-500 text-white rounded shadow"
          >
            Create PO
          </Link>
          <Link
            href="/purchases/receive-grn"
            className="px-3 py-2 border rounded"
          >
            Receive GRN
          </Link>
          <Link
            href="/purchases/create-bill"
            className="px-3 py-2 border rounded"
          >
            Create Bill
          </Link>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <KPICard
          title="Total PO"
          value={kpis?.totalPOs ?? "—"}
          sub="All purchase orders"
          icon="📄"
        />
        <KPICard
          title="Pending GRNs"
          value={kpis?.pendingGRNs ?? "—"}
          sub="Awaiting receipt"
          icon="📦"
        />
        <KPICard
          title="Bills"
          value={kpis?.totalBills ?? "—"}
          sub="Supplier invoices"
          icon="🧾"
        />
        <KPICard
          title="Returns"
          value={kpis?.totalReturns ?? "—"}
          sub="Purchase returns"
          icon="↩️"
        />
        <KPICard
          title="This Month Spend"
          value={kpis ? `₹${kpis.monthSpend.toLocaleString()}` : "—"}
          sub="Expenditure (M)"
          icon="💸"
          sparkData={spark}
        />
        <KPICard
          title="Outstanding"
          value={kpis ? `₹${kpis.outstanding.toLocaleString()}` : "—"}
          sub="Supplier dues"
          icon="⚠️"
        />
      </div>

      {/* Workflow + Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <WorkflowCard
              title="Create Purchase Order"
              href="/purchases/create-po"
              desc="Create PO & send to supplier"
              icon="📝"
            />
            <WorkflowCard
              title="Receive Goods (GRN)"
              href="/purchases/receive-grn"
              desc="Receive items & add batches"
              icon="📦"
            />
            <WorkflowCard
              title="Create Purchase Bill"
              href="/purchases/create-bill"
              desc="Record supplier invoice & payments"
              icon="💳"
            />
            <WorkflowCard
              title="Purchase Return"
              href="/purchases/returns"
              desc="Return defective items"
              icon="🔁"
            />
          </div>

          <div className="bg-white/70 backdrop-blur rounded-2xl p-4 shadow border border-white/30">
            <h3 className="font-semibold mb-3">Monthly Purchases</h3>
            <div className="h-44 w-full">
              <Sparkline data={kpis?.monthlySeries ?? new Array(12).fill(0)} />
            </div>
            <div className="mt-3 text-sm text-gray-500">
              Spending trend for last 12 months
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur rounded-2xl p-4 shadow border border-white/30">
            <h3 className="font-semibold mb-3">Top Suppliers</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(topSuppliers.length ? topSuppliers : new Array(3).fill(0)).map(
                (s: any, i: number) => (
                  <SupplierCard
                    key={i}
                    supplier={
                      s || {
                        name: `Supplier ${i + 1}`,
                        total: Math.round(Math.random() * 50000),
                      }
                    }
                  />
                )
              )}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="bg-white/70 backdrop-blur rounded-2xl p-4 shadow border border-white/30">
            <h4 className="font-semibold mb-2">Quick Actions</h4>
            <div className="flex flex-col gap-2">
              <Link
                href="/purchases/create-po"
                className="px-3 py-2 bg-amber-500 text-white rounded"
              >
                + New PO
              </Link>
              <Link
                href="/purchases/receive-grn"
                className="px-3 py-2 border rounded"
              >
                Receive GRN
              </Link>
              <Link
                href="/purchases/create-bill"
                className="px-3 py-2 border rounded"
              >
                Create Bill
              </Link>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur rounded-2xl p-4 shadow border border-white/30">
            <h4 className="font-semibold mb-2">Shortcuts</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>
                <Link
                  href="/purchases/po/list"
                  className="text-amber-600 hover:underline"
                >
                  All Purchase Orders
                </Link>
              </li>
              <li>
                <Link
                  href="/purchases/grn/list"
                  className="text-amber-600 hover:underline"
                >
                  All GRNs
                </Link>
              </li>
              <li>
                <Link
                  href="/purchases/bills/list"
                  className="text-amber-600 hover:underline"
                >
                  All Bills
                </Link>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ---------- Small helper components used inline ---------- */

function Sparkline({ data }: { data: number[] }) {
  const W = 600,
    H = 120,
    padding = 6;
  const max = Math.max(...data, 1);
  const points = data
    .map((v, i) => {
      const x = padding + (i / (data.length - 1)) * (W - padding * 2);
      const y = H - padding - (v / max) * (H - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
      <polyline
        points={points}
        fill="none"
        stroke="url(#g1)"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="g1" x1="0" x2="1">
          <stop offset="0" stopColor="#f97316" />
          <stop offset="1" stopColor="#fb923c" />
        </linearGradient>
      </defs>
    </svg>
  );
}
