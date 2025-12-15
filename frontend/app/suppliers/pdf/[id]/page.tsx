// /app/suppliers/pdf/[id]/page.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { fetcher } from "@/lib/api";
import { Printer, Download } from "lucide-react";
import Link from "next/link";

/**
 * Simple client-side printable profile page.
 * - Renders a styled HTML invoice/profile
 * - "Print / Save as PDF" uses window.print()
 * - Works without jspdf installed. If you prefer jspdf binary, we can switch later.
 */

export default function SupplierPDFPage() {
  const { id } = useParams() as any;
  const [supplier, setSupplier] = useState<any>(null);
  const [bills, setBills] = useState<any[]>([]);
  const [returnsList, setReturnsList] = useState<any[]>([]);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function load() {
    const sup = await fetcher(`/api/suppliers/${id}`).catch(() => null);
    setSupplier(
      sup ?? {
        name: "Mandal Supplier",
        gstin: "19XXXXX",
        address: "Tentulberia, Haldia",
      }
    );

    const billsRes = await fetcher(
      `/api/purchases?supplier=${id}&limit=10`
    ).catch(() => []);
    setBills(Array.isArray(billsRes) ? billsRes : []);

    const returnsRes = await fetcher(
      `/api/purchase-returns?supplier=${id}&limit=10`
    ).catch(() => []);
    setReturnsList(Array.isArray(returnsRes) ? returnsRes : []);
  }

  function printPage() {
    window.print();
  }

  function downloadHTMLAsPDF() {
    // Use built-in print to save as PDF. For advanced binary generation, we can add jspdf later.
    printPage();
  }

  if (!supplier) return <div className="p-6">Loading…</div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <Link href={`/suppliers/dashboard/${id}`} className="text-amber-600">
          Back
        </Link>
        <div className="flex gap-2">
          <button
            onClick={downloadHTMLAsPDF}
            className="px-3 py-2 bg-amber-500 text-white rounded"
          >
            {" "}
            <Download size={16} /> Download / Print
          </button>
          <button onClick={printPage} className="px-3 py-2 border rounded">
            {" "}
            <Printer size={16} /> Print
          </button>
        </div>
      </div>

      <div
        ref={ref}
        className="bg-white p-6 rounded-lg shadow max-w-3xl mx-auto"
      >
        <header className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">Mandal Cycle Store</h2>
            <div className="text-sm text-gray-600">
              Tentulberia, Haldia, Purba Medinipur
            </div>
            <div className="text-sm text-gray-600">
              Phone: 9564751552 / 9547472839
            </div>
            <div className="text-sm text-gray-600">GST: 19AAACH7409R1ZY</div>
          </div>

          <div className="text-right">
            <div className="font-semibold">Supplier Profile</div>
            <div className="mt-2">{supplier.name}</div>
            <div className="text-sm text-gray-600">{supplier.gstin}</div>
          </div>
        </header>

        <section className="mb-4">
          <h3 className="font-medium mb-2">Recent Bills</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th>Bill#</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((b) => (
                <tr key={b._id}>
                  <td className="py-2">{b.billNo}</td>
                  <td>₹{b.totalAmount}</td>
                  <td>₹{b.paidAmount}</td>
                  <td>{new Date(b.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section>
          <h3 className="font-medium mb-2">Recent Returns</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th>Return#</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {returnsList.map((r) => (
                <tr key={r._id}>
                  <td className="py-2">{r.returnNo}</td>
                  <td>₹{r.totalAmount}</td>
                  <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <footer className="mt-6 text-xs text-gray-500">
          Generated on {new Date().toLocaleString()} • Mandal Cycle Store
        </footer>
      </div>
    </div>
  );
}
