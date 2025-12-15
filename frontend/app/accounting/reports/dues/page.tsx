"use client";
import React from "react";
export default function OutstandingDues() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">
        Outstanding Receivable / Payables
      </h2>
      <div className="bg-white/70 p-4 rounded-2xl shadow border">
        List of customers & suppliers with aging periods. Add export/email
        actions.
      </div>
    </div>
  );
}
