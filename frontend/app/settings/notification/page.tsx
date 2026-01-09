"use client";

import React, { useState } from "react";
import {
  Save,
  MessageCircle,
  Bell,
  Check,
  ShieldCheck,
  Settings2,
  Smartphone,
  Send,
  Clock,
  Wallet,
  FileText,
  Variable,
} from "lucide-react";

export default function WhatsappSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"invoice" | "payment" | "due">(
    "invoice"
  );

  const [form, setForm] = useState({
    defaultWhatsappNumber: "+91 70476 63313",
    enableAutoSend: true,
    enableInvoiceMsg: true,
    enablePaymentMsg: true,
    enableDueReminderMsg: false,
    templates: {
      invoice:
        "Thank you for purchasing from Mandal Cycle Store. Your Invoice {invoice_no} for amount {amount} is attached below. Have a great day!",
      payment:
        "Payment Received! We have successfully received {amount} for Invoice {invoice_no}. Thank you for choosing Mandal Cycle Store.",
      due: "Reminder: An amount of {amount} is pending for Invoice {invoice_no}. Kindly settle the dues at your earliest convenience. - Mandal Cycle Store",
    },
  });

  const updateTemplate = (val: string) => {
    setForm({
      ...form,
      templates: { ...form.templates, [activeTab]: val },
    });
  };

  const toggleOption = (key: string) => {
    setForm((prev: any) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("WhatsApp Automation protocols updated for 2026.");
    }, 1200);
  };

  const ActionButton = ({ label, checked, onClick, icon: Icon }: any) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-xs font-bold transition-all w-full text-left ${
        checked
          ? "border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600"
          : "border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100"
      }`}
    >
      {Icon && <Icon size={16} />}
      <span className="flex-1 text-left">{label}</span>
      {checked ? (
        <Check size={14} className="text-blue-600" />
      ) : (
        <div className="w-3.5 h-3.5 rounded-full border border-slate-300"></div>
      )}
    </button>
  );

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-900">
      {/* 1. CONFIGURATION SIDEBAR */}
      <aside className="w-96 bg-white border-r border-slate-200 p-6 flex flex-col sticky top-0 h-screen overflow-y-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-xl italic shadow-lg shadow-emerald-200">
              W
            </div>
            <h2 className="text-xl font-black tracking-tighter text-slate-800 uppercase">
              Comm Lab
            </h2>
          </div>
          <p className="text-[11px] font-bold text-slate-400 mt-2 flex items-center gap-1 uppercase tracking-wider">
            <ShieldCheck size={12} /> WhatsApp Business API Ready
          </p>
        </div>

        <div className="space-y-8 flex-1">
          {/* CORE SETTINGS */}
          <section className="space-y-4">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Settings2 size={12} /> WhatsApp Integration
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block">
                  Default Sending Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={form.defaultWhatsappNumber}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        defaultWhatsappNumber: e.target.value,
                      })
                    }
                    className="w-full text-sm font-bold p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 pl-10"
                  />
                  <Smartphone
                    size={16}
                    className="absolute left-3 top-3.5 text-slate-400"
                  />
                </div>
              </div>

              <ActionButton
                label="Enable Auto-Send (on Save)"
                checked={form.enableAutoSend}
                onClick={() => toggleOption("enableAutoSend")}
                icon={Send}
              />
            </div>
          </section>

          {/* MESSAGE TYPES */}
          <section className="space-y-3 pt-4 border-t border-slate-50">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Bell size={12} /> Notification Types
            </h3>
            <ActionButton
              label="Sale Invoice Alert"
              checked={form.enableInvoiceMsg}
              onClick={() => toggleOption("enableInvoiceMsg")}
              icon={FileText}
            />
            <ActionButton
              label="Payment Receipt Alert"
              checked={form.enablePaymentMsg}
              onClick={() => toggleOption("enablePaymentMsg")}
              icon={Wallet}
            />
            <ActionButton
              label="Due Payment Reminders"
              checked={form.enableDueReminderMsg}
              onClick={() => toggleOption("enableDueReminderMsg")}
              icon={Clock}
            />
          </section>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="mt-6 flex items-center justify-center gap-2 w-full px-6 py-4 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-xl hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-50"
        >
          <Save size={18} />
          {isSaving ? "Syncing API..." : "Save Communication Policy"}
        </button>
      </aside>

      {/* 2. TEMPLATE EDITOR & PREVIEW */}
      <main className="flex-1 overflow-y-auto p-12 bg-slate-50/30">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">
              Message Template Editor
            </h2>
            <p className="text-slate-500 font-medium">
              Craft how Mandal Cycle Store speaks to its customers.
            </p>
          </div>

          {/* TABS */}
          <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm w-fit">
            {(["invoice", "payment", "due"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-widest ${
                  activeTab === tab
                    ? "bg-slate-900 text-white shadow-lg"
                    : "text-slate-400 hover:bg-slate-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* EDITOR */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 uppercase text-xs tracking-widest">
                <Variable size={14} className="text-blue-600" /> Dynamic
                Variables Available
              </h3>
              <div className="flex gap-2">
                {["{invoice_no}", "{amount}", "{customer_name}"].map((v) => (
                  <span
                    key={v}
                    className="text-[9px] bg-slate-100 text-slate-600 px-2 py-1 rounded font-mono"
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>

            <textarea
              value={form.templates[activeTab]}
              onChange={(e) => updateTemplate(e.target.value)}
              className="w-full h-40 p-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-medium text-slate-700 leading-relaxed"
              placeholder="Type your WhatsApp message template here..."
            />
          </div>

          {/* WHATSAPP UI PREVIEW */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Live Handset Preview
            </h3>
            <div className="w-80 bg-[#e5ddd5] rounded-[2rem] border-[6px] border-slate-800 h-[400px] relative overflow-hidden shadow-2xl">
              <div className="bg-[#075e54] p-4 pt-8 text-white flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-300" />
                <div className="flex-1">
                  <p className="text-[10px] font-bold">Mandal Cycle Store</p>
                  <p className="text-[8px] opacity-70">Online</p>
                </div>
              </div>
              <div className="p-4">
                <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-[85%] relative">
                  <p className="text-[11px] text-slate-800 leading-normal">
                    {form.templates[activeTab]
                      .replace("{invoice_no}", "SALE/2026/1024")
                      .replace("{amount}", "₹8,499.00")
                      .replace("{customer_name}", "Sankar Das")}
                  </p>
                  <p className="text-[8px] text-slate-400 text-right mt-1">
                    14:34 ✓✓
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
