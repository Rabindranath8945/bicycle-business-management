"use client";

import { useState } from "react";
import {
  Save,
  Receipt,
  FileText,
  RefreshCcw,
  QrCode,
  Percent,
  Layout,
  Palette,
  Check,
  PenTool,
  Columns,
  Crown,
  ShieldCheck,
} from "lucide-react";

type CategoryType = "thermal" | "wholesale" | "cycle" | "gst";

export default function AdvancedInvoiceLab() {
  const [activeCat, setActiveCat] = useState<CategoryType>("thermal");
  const [selectedSubVariant, setSelectedSubVariant] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const CURRENT_YEAR = new Date().getFullYear();
  const DEFAULT_FOOTER = `Thank you for shopping! ${CURRENT_YEAR} Standard: Goods once sold are subject to local warranty terms.`;
  const FIN_YEAR = `${CURRENT_YEAR}-${String(CURRENT_YEAR + 1).slice(-2)}`;
  const formatMoney = (v: number) =>
    v.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const [form, setForm] = useState({
    business: {
      legalName: "Mandal Cycle Store",
      tradeName: "Mandal Cycle Store",
      addressLine1: "Tentulberia",
      addressLine2: "Haldia, West Bengal - 721657",
      phone: "+91 70476 63313",
      email: "mandalcycle@gmail.com",
      gstin: "07AAAAA0000A1Z5",
      pan: "AAAAA0000A",
      state: "West Bengal",
      stateCode: "19",
    },

    bank: {
      accountName: "Mandal Cycle Store",
      bankName: "State Bank of India",
      accountNo: "XXXX XXXX 1234",
      ifsc: "SBIN0000123",
      upi: "mandalcycle@upi",
    },

    customer: {
      name: "Sankar Das",
      phone: "+91 954747 2839",
      gstin: "07AAAAA0000A1Z5",
      address: "Haldia, West Bengal",
    },

    footer: DEFAULT_FOOTER,

    brandColor: "#2563eb",
    fontSize: "12px",

    showHSN: true,
    showGST: true,
    showQR: true,
    compactMode: false,
    isPremium: true,

    // ✅ NEW (safe)
    logoUrl: "",
    logoAlign: "center" as "left" | "center" | "right",

    fontFamily: "inter" as "inter" | "roboto" | "mono",
    design: {
      density: "comfortable" as "compact" | "comfortable",
      separator: "dashed" as "solid" | "dashed",
      corner: "soft" as "sharp" | "soft",
    },

    footerByCategory: {
      thermal: DEFAULT_FOOTER,
      wholesale: "Payment due within 15 days.",
      cycle: "Warranty as per manufacturer policy.",
      gst: "GST compliant tax invoice.",
    },
  });

  const templateVariants = {
    thermal: ["Standard POS", "Eco-Compact", "Premium Restaurant"],
    wholesale: ["Modern Corporate", "Industrial Grid", "Premium B2B Luxe"],
    cycle: ["Subscription SaaS", "Utility Usage", "Premium Member Gold"],
    gst: ["Official Tax Inv", "E-Invoice (IRN)", "Premium Export IGST"],
  };

  const categories = [
    { id: "thermal", label: "Thermal POS", icon: <Receipt size={18} /> },
    { id: "wholesale", label: "Wholesale A4", icon: <FileText size={18} /> },
    { id: "cycle", label: "Cycle Billing", icon: <RefreshCcw size={18} /> },
    { id: "gst", label: "GST Official", icon: <Layout size={18} /> },
  ];

  const variantStyleMap: Record<1 | 2 | 3, "classic" | "accent" | "bold"> = {
    1: "classic",
    2: "accent",
    3: "bold",
  };

  const activeVariantStyle = variantStyleMap[selectedSubVariant as 1 | 2 | 3];

  const activeVariantName = templateVariants[activeCat][selectedSubVariant - 1];
  const isA4 = activeCat !== "thermal";

  const isPremiumVariant = activeVariantName?.toLowerCase().includes("premium");

  const isThermal = activeCat === "thermal";

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-900">
      {/* 1. CONFIGURATION SIDEBAR */}
      <aside className="w-85 bg-white border-r border-slate-200 p-6 flex flex-col sticky top-0 h-screen overflow-y-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl italic shadow-lg shadow-blue-200">
              I
            </div>
            <h2 className="text-xl font-black tracking-tighter text-slate-800 uppercase">
              Invoice Lab
            </h2>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md uppercase">
              V2.5 Stable
            </span>
            {form.isPremium && (
              <span className="flex items-center gap-1 text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md uppercase">
                <Crown size={10} /> Premium
              </span>
            )}
          </div>
        </div>

        <div className="space-y-6 flex-1">
          <section className="space-y-3">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <PenTool size={12} /> Layout Variant
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {templateVariants[activeCat].map((name, index) => (
                <button
                  key={name}
                  onClick={() => setSelectedSubVariant(index + 1)}
                  className={`text-left px-4 py-3 rounded-xl border text-xs font-bold transition-all flex justify-between items-center ${
                    selectedSubVariant === index + 1
                      ? "border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600"
                      : "border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {name}
                    {name.toLowerCase().includes("premium") && (
                      <Crown size={12} className="text-amber-500" />
                    )}
                  </span>
                  {selectedSubVariant === index + 1 && <Check size={14} />}
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-50">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <ShieldCheck size={12} /> Legal Identity
            </h3>
            <div className="space-y-3">
              {/* GSTIN */}
              <div className="relative">
                <input
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-600 transition outline-none pl-10"
                  value={form.business.gstin}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      business: {
                        ...form.business,
                        gstin: e.target.value.toUpperCase(),
                      },
                    })
                  }
                  placeholder="GSTIN Number"
                />
                <span className="absolute left-3 top-3 text-[10px] font-bold text-slate-400">
                  GST
                </span>
              </div>

              {/* Legal Name */}
              <input
                className="w-full text-xs p-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-600 transition outline-none"
                value={form.business.legalName}
                onChange={(e) =>
                  setForm({
                    ...form,
                    business: {
                      ...form.business,
                      legalName: e.target.value,
                    },
                  })
                }
                placeholder="Legal Business Name"
              />

              {/* Trade Name */}
              <input
                className="w-full text-xs p-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-600 transition outline-none"
                value={form.business.tradeName}
                onChange={(e) =>
                  setForm({
                    ...form,
                    business: {
                      ...form.business,
                      tradeName: e.target.value,
                    },
                  })
                }
                placeholder="Trade Name (Optional)"
              />

              {/* PAN */}
              <input
                className="w-full text-xs p-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-600 transition outline-none"
                value={form.business.pan}
                onChange={(e) =>
                  setForm({
                    ...form,
                    business: {
                      ...form.business,
                      pan: e.target.value.toUpperCase(),
                    },
                  })
                }
                placeholder="PAN Number"
              />

              {/* State & Code */}
              <div className="grid grid-cols-2 gap-2">
                <input
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-600 transition outline-none"
                  value={form.business.state}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      business: {
                        ...form.business,
                        state: e.target.value,
                      },
                    })
                  }
                  placeholder="State"
                />
                <input
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-600 transition outline-none"
                  value={form.business.stateCode}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      business: {
                        ...form.business,
                        stateCode: e.target.value,
                      },
                    })
                  }
                  placeholder="State Code"
                />
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-2 gap-2">
                <input
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-600 transition outline-none"
                  value={form.business.phone}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      business: {
                        ...form.business,
                        phone: e.target.value,
                      },
                    })
                  }
                  placeholder="Phone Number"
                />
                <input
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-600 transition outline-none"
                  value={form.business.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      business: {
                        ...form.business,
                        email: e.target.value,
                      },
                    })
                  }
                  placeholder="Email Address"
                />
              </div>
            </div>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-50">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <ShieldCheck size={12} /> Bank Details
            </h3>

            <div className="space-y-3">
              {/* Account Name */}
              <input
                className="w-full text-xs p-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-600 transition outline-none"
                value={form.bank.accountName}
                onChange={(e) =>
                  setForm({
                    ...form,
                    bank: {
                      ...form.bank,
                      accountName: e.target.value,
                    },
                  })
                }
                placeholder="Account Holder Name"
              />

              {/* Bank Name */}
              <input
                className="w-full text-xs p-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-600 transition outline-none"
                value={form.bank.bankName}
                onChange={(e) =>
                  setForm({
                    ...form,
                    bank: {
                      ...form.bank,
                      bankName: e.target.value,
                    },
                  })
                }
                placeholder="Bank Name"
              />

              {/* Account No & IFSC */}
              <div className="grid grid-cols-2 gap-2">
                <input
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-600 transition outline-none"
                  value={form.bank.accountNo}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      bank: {
                        ...form.bank,
                        accountNo: e.target.value,
                      },
                    })
                  }
                  placeholder="Account Number"
                />
                <input
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-600 transition outline-none"
                  value={form.bank.ifsc}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      bank: {
                        ...form.bank,
                        ifsc: e.target.value.toUpperCase(),
                      },
                    })
                  }
                  placeholder="IFSC Code"
                />
              </div>

              {/* UPI */}
              <input
                className="w-full text-xs p-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-600 transition outline-none"
                value={form.bank.upi}
                onChange={(e) =>
                  setForm({
                    ...form,
                    bank: {
                      ...form.bank,
                      upi: e.target.value,
                    },
                  })
                }
                placeholder="UPI ID (optional)"
              />
            </div>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-50">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Palette size={12} /> Design Aesthetic
            </h3>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <span className="text-xs font-semibold text-slate-600">
                Theme Color
              </span>
              <input
                type="color"
                value={form.brandColor}
                onChange={(e) =>
                  setForm({ ...form, brandColor: e.target.value })
                }
                className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent shadow-sm"
              />
            </div>
          </section>
        </div>

        <button
          onClick={() => {
            setIsSaving(true);
            setTimeout(() => setIsSaving(false), 1500);
          }}
          className="mt-6 w-full bg-slate-900 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-95 shadow-xl shadow-slate-200"
        >
          {isSaving ? (
            <RefreshCcw className="animate-spin" size={18} />
          ) : (
            <Save size={18} />
          )}
          {isSaving ? "Synchronizing..." : "Apply Lab Settings"}
        </button>
      </aside>

      {/* 2. DESIGN CANVAS */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex gap-1 mb-10">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCat(cat.id as CategoryType);
                  setSelectedSubVariant(1);
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-tighter transition-all ${
                  activeCat === cat.id
                    ? "bg-slate-900 text-white shadow-lg"
                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                }`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
            <div className="xl:col-span-4 space-y-4">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest mb-6 border-b pb-3 flex justify-between">
                  Configurations <span className="text-blue-600">2025-26</span>
                </h4>
                <div className="space-y-5">
                  {[
                    {
                      key: "showHSN",
                      label: "HSN/SAC Columns",
                      icon: <Columns size={14} />,
                    },
                    {
                      key: "showGST",
                      label: "GST Tax Breakup",
                      icon: <Percent size={14} />,
                    },
                    {
                      key: "showQR",
                      label: "Payment QR Code",
                      icon: <QrCode size={14} />,
                    },
                  ].map((item) => (
                    <label
                      key={item.key}
                      className="flex items-center justify-between cursor-pointer group"
                    >
                      <span className="flex items-center gap-3 text-xs font-bold text-slate-600 group-hover:text-blue-600">
                        <span className="p-1.5 bg-slate-50 rounded-lg">
                          {item.icon}
                        </span>
                        {item.label}
                      </span>
                      <input
                        type="checkbox"
                        checked={(form as any)[item.key]}
                        onChange={() =>
                          setForm({
                            ...form,
                            [item.key]: !(form as any)[item.key],
                          })
                        }
                        className="w-5 h-5 rounded border-slate-200 text-blue-600 focus:ring-blue-500"
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* PREVIEW CANVAS WITH LAYOUT LOGIC */}
            <div className="xl:col-span-8">
              <div
                className={`mx-auto bg-white shadow-2xl border border-slate-100 transition-all duration-700 ${
                  activeCat === "thermal"
                    ? "w-[320px]"
                    : "w-full aspect-[1/1.41]"
                }`}
              >
                <div
                  className={`text-slate-800 flex flex-col h-full ${
                    form.design.density === "compact" ? "p-5" : "p-8"
                  }`}
                  style={{
                    fontSize:
                      activeCat === "thermal"
                        ? form.fontSize
                        : `calc(${form.fontSize} * 1.45)`,
                    fontFamily:
                      form.fontFamily === "mono"
                        ? "monospace"
                        : form.fontFamily === "roboto"
                        ? "Roboto, sans-serif"
                        : "Inter, sans-serif",
                  }}
                >
                  {/* Layout Variant Header Logic */}
                  <div
                    className={`flex flex-col ${
                      selectedSubVariant === 1
                        ? "items-center text-center"
                        : selectedSubVariant === 2
                        ? "items-start text-left border-l-4 pl-3"
                        : "items-end text-right border-b-2 pb-2"
                    }`}
                    style={{
                      borderColor:
                        activeVariantStyle === "accent" ||
                        activeVariantStyle === "bold"
                          ? form.brandColor
                          : undefined,
                    }}
                  >
                    <h2
                      className={`font-black tracking-tighter uppercase ${
                        isA4 ? "text-2xl" : "text-lg"
                      }`}
                      style={{ color: form.brandColor }}
                    >
                      {form.business.legalName}
                    </h2>

                    <p
                      className={`opacity-70 max-w-[250px] mt-1 ${
                        isA4 ? "text-xs" : "text-[9px]"
                      }`}
                    >
                      {form.business.addressLine1}
                      {!isThermal ? `, ${form.business.addressLine2}` : ""}
                    </p>

                    <div
                      className={`mt-1 opacity-60 space-y-0.5 ${
                        isA4 ? "text-xs" : "text-[9px]"
                      }`}
                    >
                      {form.business.phone && (
                        <div>Ph: {form.business.phone}</div>
                      )}
                      {form.business.email && (
                        <div>Email: {form.business.email}</div>
                      )}
                    </div>

                    <div className="mt-2">
                      <span className="text-[10px] font-bold bg-slate-900 text-white px-2 py-0.5 rounded italic">
                        GSTIN: {form.business.gstin || "PENDING"}
                      </span>
                    </div>
                    <div className="mt-1 text-[9px] opacity-60 space-y-0.5">
                      {/* ❌ Trade Name & PAN — ONLY FOR WHOLESALE & GST */}
                      {(activeCat === "wholesale" || activeCat === "gst") && (
                        <>
                          {form.business.tradeName && (
                            <div>Trade Name: {form.business.tradeName}</div>
                          )}
                          {form.business.pan && (
                            <div>PAN: {form.business.pan}</div>
                          )}
                        </>
                      )}

                      {/* ✅ State info — REQUIRED FOR GST / WHOLESALE */}
                      {(activeCat === "gst" || activeCat === "wholesale") && (
                        <div>
                          State: {form.business.state} (
                          {form.business.stateCode})
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    className={`w-full border-y border-slate-200 ${
                      form.design.separator === "dashed"
                        ? "border-dashed"
                        : "border-solid"
                    }
 py-3 my-4 flex justify-between font-bold text-[9px] uppercase ${
   selectedSubVariant === 2 ? "bg-slate-100/50 px-2" : ""
 }`}
                  >
                    <div>No: #2025/INV/772</div>
                    <div>Date: 19-Dec-2025</div>
                  </div>
                  <div className="mt-3 text-[9px] uppercase font-bold opacity-70">
                    Bill To
                  </div>

                  {/* 🔹 THERMAL POS – SIMPLE */}
                  {activeCat === "thermal" && (
                    <div className="mt-1 space-y-0.5">
                      <div className="text-[10px] font-bold">
                        {form.customer.name || "Walk-in Customer"}
                      </div>
                      {form.customer.phone && (
                        <div className="text-[9px] opacity-60">
                          Ph: {form.customer.phone}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 🔹 A4 TEMPLATES – PREMIUM CUSTOMER BLOCK */}
                  {activeCat !== "thermal" && (
                    <div className="mt-1 space-y-0.5">
                      <div className="text-[11px] font-bold">
                        {form.customer.name || "Customer"}
                      </div>

                      {form.customer.phone && (
                        <div className="text-[9px] opacity-60">
                          Phone: {form.customer.phone}
                        </div>
                      )}

                      {form.customer.address && (
                        <div className="text-[9px] opacity-60">
                          Address: {form.customer.address}
                        </div>
                      )}

                      {form.customer.gstin && (
                        <div className="text-[9px] opacity-60">
                          GSTIN: {form.customer.gstin}
                        </div>
                      )}
                    </div>
                  )}

                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr
                        className="border-b-2 border-slate-900 text-[9px] uppercase font-black"
                        style={
                          selectedSubVariant === 3
                            ? { borderBottomColor: form.brandColor }
                            : {}
                        }
                      >
                        <th className="pb-2">Items</th>
                        {form.showHSN && <th className="text-right">HSN</th>}
                        <th className="text-right">Qty</th>
                        <th className="text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-[11px]">
                      <tr className="font-medium">
                        <td className="py-4">Premium Selection Item</td>
                        {form.showHSN && (
                          <td className="text-right opacity-50 italic font-mono">
                            6109
                          </td>
                        )}
                        <td className="text-right">1.0</td>
                        <td className="text-right font-black">₹1,000.00</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Financials with CGST/SGST Breakup */}
                  <div className="mt-auto space-y-2 pt-6 border-t border-slate-50">
                    <div className="flex justify-end gap-10 text-[10px] font-bold">
                      <span className="opacity-50">SUBTOTAL</span>
                      <span className="w-24 text-right">₹1,000.00</span>
                    </div>
                    {form.showGST && (
                      <div className="space-y-1">
                        <div className="flex justify-end gap-10 text-[9px] font-bold text-slate-500">
                          <span className="italic uppercase">CGST (9%)</span>
                          <span className="w-24 text-right">₹90.00</span>
                        </div>
                        <div className="flex justify-end gap-10 text-[9px] font-bold text-slate-500">
                          <span className="italic uppercase">SGST (9%)</span>
                          <span className="w-24 text-right">₹90.00</span>
                        </div>
                      </div>
                    )}
                    <div
                      className={`flex justify-between items-center font-black border-t pt-4 ${
                        activeCat === "thermal" ? "text-sm" : "text-xl"
                      }`}
                      style={{ color: form.brandColor }}
                    >
                      <span className="uppercase tracking-tighter">
                        Net Payable
                      </span>
                      <span className="text-right">₹{formatMoney(1180)}</span>
                    </div>

                    {(activeCat === "wholesale" || activeCat === "gst") && (
                      <div className="mt-6 text-[9px] border-t pt-4 opacity-70">
                        <div>Bank: {form.bank.bankName}</div>
                        <div>A/C: {form.bank.accountNo}</div>
                        <div>IFSC: {form.bank.ifsc}</div>
                        <div>UPI: {form.bank.upi}</div>
                        Payment Terms: Net 15 Days
                      </div>
                    )}
                  </div>

                  {form.showQR && (
                    <div
                      className={`mt-8 flex flex-col gap-2 border-t pt-6 ${
                        selectedSubVariant === 3 ? "items-end" : "items-center"
                      }`}
                    >
                      <div className="p-2 border rounded-xl bg-white shadow-sm">
                        <QrCode size={40} className="opacity-70" />
                      </div>
                      <span className="text-[8px] font-black uppercase opacity-40">
                        Scan to pay via UPI
                      </span>
                    </div>
                  )}

                  <div
                    className={`mt-8 ${
                      selectedSubVariant === 1
                        ? "text-center"
                        : selectedSubVariant === 2
                        ? "text-left"
                        : "text-right"
                    }`}
                  >
                    <p className="text-[9px] italic opacity-50">
                      {form.footerByCategory[activeCat]}
                    </p>
                    <div className="mt-4 text-[8px] font-black opacity-30 tracking-[0.4em] uppercase underline decoration-slate-200">
                      FY {FIN_YEAR} Digital Signature Verified
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
