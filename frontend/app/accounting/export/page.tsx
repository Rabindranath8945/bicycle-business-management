"use client";
import React from "react";
export default function AccountingExport() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Export (PDF / Excel)</h2>
      <div className="bg-white/70 p-4 rounded-2xl shadow border">
        <p>
          Select report → choose format → export. Supports PL, Balance Sheet,
          Ledger, GST. (Backend endpoints to be hooked.)
        </p>
      </div>
    </div>
  );
}
