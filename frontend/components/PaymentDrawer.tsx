"use client";

import { motion } from "framer-motion";
import { X, CreditCard, Smartphone, Wallet } from "lucide-react";
import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  total: number;
  onConfirm: (payment: any) => void;
};

export default function PaymentDrawer({
  open,
  onClose,
  total,
  onConfirm,
}: Props) {
  const [method, setMethod] = useState<"Cash" | "UPI" | "Card" | "Split">(
    "Cash"
  );
  const [cashGiven, setCashGiven] = useState("");
  const [upiRef, setUpiRef] = useState("");
  const [cardLast4, setCardLast4] = useState("");

  const cashNum = Number(cashGiven || 0);
  const change = cashNum > total ? cashNum - total : 0;

  const confirm = () => {
    onConfirm({ method, cashGiven, upiRef, cardLast4, change });
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={open ? { x: 0 } : { x: "100%" }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="fixed right-0 top-0 bottom-0 w-full md:w-[420px] bg-slate-900/90 backdrop-blur-xl border-l border-slate-700 z-50"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <h2 className="text-xl font-semibold">Complete Payment</h2>
        <button
          onClick={onClose}
          className="p-2 rounded bg-slate-800 border border-slate-700"
        >
          <X size={18} />
        </button>
      </div>

      <div className="p-4 flex-1 overflow-auto">
        {/* TOTAL */}
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 mb-5">
          <div className="text-sm text-slate-400">Grand Total</div>
          <div className="text-3xl font-bold text-emerald-400">
            ₹{total.toFixed(2)}
          </div>
        </div>

        {/* METHODS */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => setMethod("Cash")}
            className={`p-3 flex flex-col items-center gap-2 rounded-lg border ${
              method === "Cash"
                ? "bg-emerald-600 text-black border-emerald-400"
                : "bg-slate-800 border-slate-700"
            }`}
          >
            <Wallet />
            Cash
          </button>

          <button
            onClick={() => setMethod("UPI")}
            className={`p-3 flex flex-col items-center gap-2 rounded-lg border ${
              method === "UPI"
                ? "bg-emerald-600 text-black border-emerald-400"
                : "bg-slate-800 border-slate-700"
            }`}
          >
            <Smartphone />
            UPI
          </button>

          <button
            onClick={() => setMethod("Card")}
            className={`p-3 flex flex-col items-center gap-2 rounded-lg border ${
              method === "Card"
                ? "bg-emerald-600 text-black border-emerald-400"
                : "bg-slate-800 border-slate-700"
            }`}
          >
            <CreditCard />
            Card
          </button>

          <button
            onClick={() => setMethod("Split")}
            className={`p-3 flex flex-col items-center gap-2 rounded-lg border ${
              method === "Split"
                ? "bg-emerald-600 text-black border-emerald-400"
                : "bg-slate-800 border-slate-700"
            }`}
          >
            <Wallet />
            Split
          </button>
        </div>

        {/* CASH SECTION */}
        {method === "Cash" && (
          <div className="space-y-3">
            <label className="text-sm">Cash Given (Customer)</label>
            <input
              value={cashGiven}
              onChange={(e) => setCashGiven(e.target.value)}
              placeholder="Enter amount"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2"
            />

            {/* Change */}
            {cashNum >= total && (
              <div className="mt-2 p-3 bg-slate-800 border border-slate-700 rounded-lg text-emerald-400">
                Change to Return: ₹{change.toFixed(2)}
              </div>
            )}
          </div>
        )}

        {/* UPI SECTION */}
        {method === "UPI" && (
          <div className="space-y-3">
            <label className="text-sm">UPI Reference ID</label>
            <input
              value={upiRef}
              onChange={(e) => setUpiRef(e.target.value)}
              placeholder="Enter UPI Ref ID"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2"
            />
          </div>
        )}

        {/* CARD SECTION */}
        {method === "Card" && (
          <div className="space-y-3">
            <label className="text-sm">Last 4 digits</label>
            <input
              value={cardLast4}
              maxLength={4}
              onChange={(e) => setCardLast4(e.target.value)}
              placeholder="1234"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2"
            />
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="p-4 border-t border-slate-700">
        <button
          onClick={confirm}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-black font-semibold text-lg"
        >
          Confirm Payment
        </button>
      </div>
    </motion.div>
  );
}
