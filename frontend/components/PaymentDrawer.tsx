"use client";

import { motion } from "framer-motion";
import { X, CreditCard, Smartphone, Wallet } from "lucide-react";
import { useMemo, useState } from "react";

type PaymentMethod = "Cash" | "UPI" | "Card" | "Split";

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
  const [method, setMethod] = useState<PaymentMethod>("Cash");

  // amounts
  const [cash, setCash] = useState<number>(0);
  const [upi, setUpi] = useState<number>(0);
  const [card, setCard] = useState<number>(0);

  // refs
  const [upiRef, setUpiRef] = useState("");
  const [cardLast4, setCardLast4] = useState("");

  /* ---------------- calculations ---------------- */

  const paid = useMemo(() => {
    if (method === "Cash") return cash;
    if (method === "UPI") return total;
    if (method === "Card") return total;
    return cash + upi + card;
  }, [method, cash, upi, card, total]);

  const balance = paid - total;
  const isValid = paid >= total;

  /* ---------------- confirm ---------------- */

  const confirm = () => {
    if (!isValid) return;

    onConfirm({
      method,
      total,
      cash,
      upi,
      card,
      upiRef,
      cardLast4,
      change: method === "Cash" ? Math.max(0, balance) : 0,
    });
  };

  /* ---------------- UI ---------------- */

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={open ? { x: 0 } : { x: "100%" }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="fixed right-0 top-0 bottom-0 w-full md:w-[420px] bg-white border-l shadow-xl z-50"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Payment</h2>
        <button
          onClick={onClose}
          className="p-2 rounded border hover:bg-gray-100"
        >
          <X size={18} />
        </button>
      </div>

      <div className="p-4 space-y-5 overflow-auto">
        {/* TOTAL */}
        <div className="p-4 rounded-xl border bg-gray-50">
          <div className="text-sm text-gray-500">Grand Total</div>
          <div className="text-3xl font-bold text-emerald-600">
            ₹{total.toFixed(2)}
          </div>
        </div>

        {/* METHODS */}
        <div className="grid grid-cols-2 gap-3">
          <MethodButton
            active={method === "Cash"}
            label="Cash"
            icon={<Wallet />}
            onClick={() => setMethod("Cash")}
          />
          <MethodButton
            active={method === "UPI"}
            label="UPI"
            icon={<Smartphone />}
            onClick={() => setMethod("UPI")}
          />
          <MethodButton
            active={method === "Card"}
            label="Card"
            icon={<CreditCard />}
            onClick={() => setMethod("Card")}
          />
          <MethodButton
            active={method === "Split"}
            label="Split"
            icon={<Wallet />}
            onClick={() => setMethod("Split")}
          />
        </div>

        {/* CASH */}
        {method === "Cash" && (
          <Field
            label="Cash Received"
            value={cash}
            onChange={setCash}
            placeholder="Enter amount"
          />
        )}

        {/* UPI */}
        {method === "UPI" && (
          <>
            <Field
              label="UPI Amount"
              value={total}
              disabled
              onChange={() => {}}
            />
            <TextField
              label="UPI Reference (optional)"
              value={upiRef}
              onChange={setUpiRef}
            />
          </>
        )}

        {/* CARD */}
        {method === "Card" && (
          <>
            <Field
              label="Card Amount"
              value={total}
              disabled
              onChange={() => {}}
            />
            <TextField
              label="Card Last 4 Digits"
              value={cardLast4}
              onChange={setCardLast4}
              maxLength={4}
            />
          </>
        )}

        {/* SPLIT */}
        {method === "Split" && (
          <div className="space-y-3">
            <Field label="Cash" value={cash} onChange={setCash} />
            <Field label="UPI" value={upi} onChange={setUpi} />
            <Field label="Card" value={card} onChange={setCard} />
          </div>
        )}

        {/* STATUS */}
        <div className="text-sm">
          {balance >= 0 ? (
            <span className="text-emerald-600">
              Change: ₹{balance.toFixed(2)}
            </span>
          ) : (
            <span className="text-red-500">
              Balance Due: ₹{Math.abs(balance).toFixed(2)}
            </span>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div className="p-4 border-t">
        <button
          disabled={!isValid}
          onClick={confirm}
          className="w-full py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold disabled:opacity-50"
        >
          Confirm Payment
        </button>
      </div>
    </motion.div>
  );
}

/* ---------------- helpers ---------------- */

function MethodButton({ active, label, icon, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`p-3 rounded-lg border flex flex-col items-center gap-1 ${
        active
          ? "border-emerald-600 bg-emerald-50 text-emerald-700"
          : "hover:bg-gray-50"
      }`}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </button>
  );
}

function Field({ label, value, onChange, placeholder, disabled }: any) {
  return (
    <div>
      <label className="text-sm text-gray-600">{label}</label>
      <input
        type="number"
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => onChange(Number(e.target.value || 0))}
        className="w-full mt-1 px-3 py-2 border rounded-lg disabled:bg-gray-100"
      />
    </div>
  );
}

function TextField({ label, value, onChange, maxLength }: any) {
  return (
    <div>
      <label className="text-sm text-gray-600">{label}</label>
      <input
        value={value}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-1 px-3 py-2 border rounded-lg"
      />
    </div>
  );
}
