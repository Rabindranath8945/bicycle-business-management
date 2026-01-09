"use client";

import React, { useState, useRef } from "react";
import {
  Building2,
  Upload,
  MapPin,
  Fingerprint,
  ShieldCheck,
  Image as ImageIcon,
  Save,
  Info,
  Globe,
  Briefcase,
} from "lucide-react";
import { motion } from "framer-motion";

export default function BusinessProfileSettings() {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const signInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    businessName: "Mandal Cycle Store",
    ownerName: "Sumit Mandal",
    businessType: "Proprietorship",
    gstin: "19XXXXXXXXXX1Z2",
    pan: "ABCDE1234F",
    address: "Haldia, Purba Medinipur, West Bengal - 721607",
    state: "West Bengal",
    stateCode: "19",
    currency: "INR (₹)",
    logo: null as string | null,
    signature: null as string | null,
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "logo" | "signature"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) =>
        setForm({ ...form, [field]: ev.target?.result as string });
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert("Business Identity Synchronized for 2026.");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <Building2 className="text-indigo-600" size={32} />
              Business Identity
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-1">
              Configure your legal entity and branding for invoices & GST
              reports.
            </p>
          </div>
          <button
            onClick={saveProfile}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50"
          >
            {loading ? (
              "Syncing..."
            ) : (
              <>
                <Save size={18} /> Update Profile
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: FORM FIELDS */}
          <div className="lg:col-span-2 space-y-6">
            {/* GENERAL INFO */}
            <section className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Briefcase size={14} /> Core Enterprise Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 ml-1">
                    Business Name
                  </label>
                  <input
                    name="businessName"
                    value={form.businessName}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 ml-1">
                    Owner / MD Name
                  </label>
                  <input
                    name="ownerName"
                    value={form.ownerName}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 ml-1">
                    Entity Type
                  </label>
                  <select
                    name="businessType"
                    value={form.businessType}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                  >
                    <option>Proprietorship</option>
                    <option>Partnership Firm</option>
                    <option>Private Limited</option>
                    <option>LLP</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 ml-1">
                    Default Currency
                  </label>
                  <input
                    name="currency"
                    value={form.currency}
                    disabled
                    className="w-full bg-slate-100 border-slate-200 rounded-xl px-4 py-2.5 text-sm cursor-not-allowed text-slate-500"
                  />
                </div>
              </div>
            </section>

            {/* LEGAL & TAX */}
            <section className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck size={14} /> Legal & Compliance
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 relative">
                  <label className="text-xs font-bold text-slate-700 ml-1">
                    GSTIN
                  </label>
                  <div className="relative">
                    <Fingerprint
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      size={16}
                    />
                    <input
                      name="gstin"
                      value={form.gstin}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
                      placeholder="19XXXXX..."
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 ml-1">
                    PAN Number
                  </label>
                  <input
                    name="pan"
                    value={form.pan}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 transition-all font-mono uppercase"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 ml-1 flex items-center gap-1.5">
                  <MapPin size={14} className="text-indigo-600" /> Registered
                  Office Address
                </label>
                <textarea
                  name="address"
                  rows={3}
                  value={form.address}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 ml-1">
                    State
                  </label>
                  <input
                    name="state"
                    value={form.state}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 ml-1">
                    State Code
                  </label>
                  <input
                    name="stateCode"
                    value={form.stateCode}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT: MEDIA & PREVIEW */}
          <div className="space-y-6">
            {/* ASSETS */}
            <section className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Brand Assets
              </h3>

              {/* LOGO UPLOAD */}
              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-500 uppercase ml-1">
                  Corporate Logo
                </p>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative h-32 w-full border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all overflow-hidden"
                >
                  {form.logo ? (
                    <img
                      src={form.logo}
                      className="h-full w-full object-contain p-2"
                      alt="Logo"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-slate-400">
                      <ImageIcon size={24} />
                      <span className="text-[10px] font-bold uppercase">
                        Upload Logo
                      </span>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "logo")}
                  />
                </div>
              </div>

              {/* SIGNATURE UPLOAD */}
              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-500 uppercase ml-1">
                  Authorized Signature
                </p>
                <div
                  onClick={() => signInputRef.current?.click()}
                  className="group relative h-24 w-full border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all overflow-hidden"
                >
                  {form.signature ? (
                    <img
                      src={form.signature}
                      className="h-full w-full object-contain p-4 mix-blend-multiply"
                      alt="Signature"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-slate-400">
                      <Upload size={20} />
                      <span className="text-[10px] font-bold uppercase">
                        Upload Sign
                      </span>
                    </div>
                  )}
                  <input
                    ref={signInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "signature")}
                  />
                </div>
              </div>
            </section>

            {/* LIVE PREVIEW BADGE */}
            <section className="bg-slate-900 rounded-3xl p-6 shadow-xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Globe size={60} />
              </div>
              <h3 className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                Invoice Header Preview
              </h3>

              <div className="space-y-2 relative z-10">
                <h4 className="text-lg font-black leading-tight">
                  {form.businessName || "Your Store Name"}
                </h4>
                <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                  {form.address}
                </p>
                <div className="pt-2 flex flex-col gap-1">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-slate-500 uppercase">GSTIN</span>
                    <span className="text-indigo-300 font-mono uppercase">
                      {form.gstin}
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-slate-500 uppercase">PAN</span>
                    <span className="text-indigo-300 font-mono uppercase">
                      {form.pan}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2">
                <Info size={14} className="text-indigo-400" />
                <p className="text-[9px] text-slate-500 font-bold leading-tight">
                  This identity will be locked for the next GST filing period
                  once saved.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
