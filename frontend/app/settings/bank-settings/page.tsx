"use client";

import React, { useState } from "react";
import {
  Banknote,
  CreditCard,
  Smartphone,
  Save,
  Briefcase,
  ArrowRight,
  ShieldCheck,
  Zap,
  IndianRupee,
  Users,
  MapPin,
  Info,
  Link as LinkIcon,
  FileText,
  MessageSquare,
  BarChart3,
  Receipt,
  History as HistoryIcon,
  LucideIcon,
  Copy,
  Check,
  Globe,
} from "lucide-react";
import { motion } from "framer-motion";

export default function PaymentSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);

  const [bankDetails, setBankDetails] = useState({
    bankName: "State Bank of India",
    accountHolder: "MANDAL CYCLE STORE",
    accountNumber: "XXXXXXXXXX12345",
    ifscCode: "SBIN0001234",
    branch: "Haldia Branch",
    upiId: "mandalcycle@upi",
  });

  const [paymentToggles, setPaymentToggles] = useState({
    cash: true,
    upi: true,
    card: true,
    bankTransfer: true,
    credit: true,
  });

  const [usageControls, setUsageControls] = useState({
    showInInvoiceFooter: true,
    showInPaymentSummary: true,
    shareViaWhatsApp: true,
    includeInLedgers: true,
  });

  const handleBankInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setBankDetails({ ...bankDetails, [e.target.name]: e.target.value });
  const handleToggleChange = (method: keyof typeof paymentToggles) =>
    setPaymentToggles({ ...paymentToggles, [method]: !paymentToggles[method] });
  const handleUsageChange = (feature: keyof typeof usageControls) =>
    setUsageControls({ ...usageControls, [feature]: !usageControls[feature] });

  const saveSettings = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Financial & Module Settings Synchronized for 2026.");
    }, 1500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const toggleSwitchClasses = (isActive: boolean) =>
    `relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
      isActive ? "bg-emerald-600" : "bg-gray-200"
    }`;

  const toggleSpanClasses = (isActive: boolean) =>
    `inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
      isActive ? "translate-x-6" : "translate-x-1"
    }`;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <Banknote className="text-indigo-600" size={32} /> Financial &
              Payment Hub
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-1">
              Manage accounts and document visibility for 2026.
            </p>
          </div>
          <button
            onClick={saveSettings}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50"
          >
            {loading ? (
              "Syncing..."
            ) : (
              <>
                <Save size={18} /> Sync Settings
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT: BANK DETAILS INPUTS */}
          <section className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck size={14} /> Settlement Account
            </h3>
            <div className="space-y-4">
              {[
                { label: "Bank Name", name: "bankName", icon: Briefcase },
                { label: "Account Holder", name: "accountHolder", icon: Users },
                {
                  label: "Account Number",
                  name: "accountNumber",
                  icon: CreditCard,
                  type: "number",
                },
                { label: "IFSC Code", name: "ifscCode", icon: LinkIcon },
                { label: "Branch & City", name: "branch", icon: MapPin },
              ].map(({ label, name, icon: Icon, type = "text" }) => (
                <div key={name} className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 ml-1.5">
                    {label}
                  </label>
                  <div className="relative">
                    <Icon
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      size={16}
                    />
                    <input
                      type={type}
                      name={name}
                      value={(bankDetails as any)[name]}
                      onChange={handleBankInputChange}
                      className="w-full bg-slate-50 border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider">
                Digital UPI Settlement
              </p>
              <div className="relative">
                <Zap
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500"
                  size={16}
                />
                <input
                  name="upiId"
                  value={bankDetails.upiId}
                  onChange={handleBankInputChange}
                  className="w-full bg-slate-50 border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
                  placeholder="business@upi"
                />
              </div>
            </div>
          </section>

          {/* RIGHT SIDEBAR SECTIONS */}
          <div className="space-y-6">
            {/* MODULE USAGE CONTROLS */}
            <section className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-6">
                <BarChart3 size={14} /> Global Usage Controls
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {[
                  {
                    key: "showInInvoiceFooter",
                    label: "Display on Invoice Footer",
                    icon: FileText,
                  },
                  {
                    key: "showInPaymentSummary",
                    label: "Include in Payment Summaries",
                    icon: Receipt,
                  },
                  {
                    key: "shareViaWhatsApp",
                    label: "Share with WhatsApp Invoices",
                    icon: MessageSquare,
                  },
                  {
                    key: "includeInLedgers",
                    label: "Auto-sync to Ledger Reports",
                    icon: HistoryIcon,
                  },
                ].map(({ key, label, icon: Icon }) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-3 border-b border-slate-50 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={16} className="text-indigo-500" />
                      <span className="text-xs font-bold text-slate-600">
                        {label}
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        handleUsageChange(key as keyof typeof usageControls)
                      }
                      className={toggleSwitchClasses(
                        (usageControls as any)[key]
                      )}
                    >
                      <span
                        className={toggleSpanClasses(
                          (usageControls as any)[key]
                        )}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* PAYMENT MODES */}
            <section className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                <CreditCard size={14} /> Acceptable Modes
              </h3>
              <div className="space-y-3">
                {[
                  { method: "cash", label: "Cash", icon: IndianRupee },
                  { method: "upi", label: "UPI (Digital)", icon: Smartphone },
                  { method: "card", label: "Card / POS", icon: CreditCard },
                  {
                    method: "bankTransfer",
                    label: "Bank Transfer",
                    icon: Banknote,
                  },
                  {
                    method: "credit",
                    label: "Credit (Udhar)",
                    icon: ArrowRight,
                  },
                ].map(({ method, label, icon: Icon }) => (
                  <div
                    key={method}
                    className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <Icon
                        size={18}
                        className={
                          (paymentToggles as any)[method]
                            ? "text-emerald-600"
                            : "text-slate-400"
                        }
                      />
                      <span
                        className={`text-sm font-bold ${
                          (paymentToggles as any)[method]
                            ? "text-slate-900"
                            : "text-slate-500"
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        handleToggleChange(
                          method as keyof typeof paymentToggles
                        )
                      }
                      className={toggleSwitchClasses(
                        (paymentToggles as any)[method]
                      )}
                    >
                      <span
                        className={toggleSpanClasses(
                          (paymentToggles as any)[method]
                        )}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* FINAL MASTER PREVIEW SECTION - Added at the bottom */}
        <div className="mt-8">
          <section className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xl">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-6">
              <Globe size={14} /> Global Master Preview & Usage
            </h3>

            <div className="bg-slate-900 p-6 rounded-2xl shadow-inner text-white mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">
                    ERP V2026
                  </p>
                  <p className="text-sm font-bold mt-1 text-indigo-400">
                    Mandal Cycle Store A/C
                  </p>
                </div>
                <Banknote size={36} className="text-slate-700 opacity-70" />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                  <p className="text-xs text-slate-400">Account No:</p>
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-mono font-bold">
                      {bankDetails.accountNumber}
                    </p>
                    <button
                      onClick={() => copyToClipboard(bankDetails.accountNumber)}
                      className="text-slate-400 hover:text-indigo-400 transition-colors"
                    >
                      {copiedAccount ? (
                        <Check size={14} className="text-emerald-400" />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between text-xs">
                  <p className="text-slate-400">IFSC Code:</p>
                  <p className="font-mono font-bold">{bankDetails.ifscCode}</p>
                </div>
                <div className="flex justify-between text-xs">
                  <p className="text-slate-400">Bank Name:</p>
                  <p className="font-bold">{bankDetails.bankName}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(usageControls).map(([key, isActive]) => (
                <div
                  key={key}
                  className={`p-3 rounded-xl text-center shadow-sm ${
                    isActive
                      ? "bg-indigo-100 text-indigo-800"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  <p className="text-[9px] font-bold uppercase tracking-wider">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-500 mt-4 text-center">
              This is how your current settings will globally propagate across
              all enabled modules.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
