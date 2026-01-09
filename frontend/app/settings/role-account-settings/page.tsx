"use client";

import React, { useState } from "react";
import {
  Save,
  ShieldCheck,
  User,
  Users,
  Lock,
  Eye,
  Trash2,
  LogOut,
  Check,
  Key,
  Activity,
  UserPlus,
  ShieldAlert,
  Smartphone,
  Globe,
} from "lucide-react";

type RoleType = "Owner" | "Manager" | "Cashier";

export default function SecuritySettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [activeRole, setActiveRole] = useState<RoleType>("Cashier");

  const [permissions, setPermissions] = useState({
    Cashier: { sale: true, delete: false, reports: false, inventory: true },
    Manager: { sale: true, delete: true, reports: true, inventory: true },
    Owner: { sale: true, delete: true, reports: true, inventory: true },
  });

  const togglePermission = (role: RoleType, perm: string) => {
    setPermissions((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [perm]: !prev[role][perm as keyof (typeof prev)["Owner"]],
      },
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Access control lists updated for 2026.");
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
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-xl italic shadow-lg shadow-slate-200">
              U
            </div>
            <h2 className="text-xl font-black tracking-tighter text-slate-800 uppercase">
              Auth Lab
            </h2>
          </div>
          <p className="text-[11px] font-bold text-slate-400 mt-2 flex items-center gap-1 uppercase tracking-wider">
            <ShieldCheck size={12} /> IAM Protocol: 2026 High
          </p>
        </div>

        <div className="space-y-8 flex-1">
          {/* USER MANAGEMENT */}
          <section className="space-y-4">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Users size={12} /> System Users
            </h3>
            <div className="space-y-2">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs">
                    O
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      Admin (You)
                    </p>
                    <p className="text-[9px] font-bold text-blue-600 uppercase">
                      Owner
                    </p>
                  </div>
                </div>
                <Key size={14} className="text-slate-300" />
              </div>
              <button className="w-full py-3 border-2 border-dashed border-slate-100 rounded-xl text-slate-400 text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
                <UserPlus size={14} /> Add Staff Member
              </button>
            </div>
          </section>

          {/* SECURITY SHORTCUTS */}
          <section className="space-y-3 pt-4 border-t border-slate-50">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Lock size={12} /> Quick Security
            </h3>
            <button className="w-full p-3 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-bold rounded-xl flex items-center gap-3 transition-all">
              <Key size={14} /> Change Admin Password
            </button>
            <button className="w-full p-3 bg-red-50 hover:bg-red-100 text-red-600 text-[11px] font-bold rounded-xl flex items-center gap-3 transition-all">
              <LogOut size={14} /> Force Logout All Devices
            </button>
          </section>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="mt-6 flex items-center justify-center gap-2 w-full px-6 py-4 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-xl hover:bg-black transition-all active:scale-95 disabled:opacity-50"
        >
          <Save size={18} />
          {isSaving ? "Updating Access..." : "Save Role Permissions"}
        </button>
      </aside>

      {/* 2. ROLE PERMISSIONS MATRIX & ACTIVITY */}
      <main className="flex-1 overflow-y-auto p-12 bg-slate-50/30">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">
              Access Control Matrix
            </h2>
            <p className="text-slate-500 font-medium">
              Define what Manager and Cashier roles can perform in Mandal Cycle
              Store.
            </p>
          </div>

          {/* ROLE SELECTOR TABS */}
          <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm w-fit">
            {(["Owner", "Manager", "Cashier"] as RoleType[]).map((role) => (
              <button
                key={role}
                onClick={() => setActiveRole(role)}
                className={`px-8 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-widest ${
                  activeRole === role
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                    : "text-slate-400 hover:bg-slate-50"
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          {/* PERMISSIONS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 uppercase text-[10px] tracking-widest text-blue-600">
                <ShieldAlert size={14} /> Operational Access
              </h3>
              <div className="space-y-2">
                <ActionButton
                  label="Can Create Sales"
                  checked={permissions[activeRole].sale}
                  onClick={() => togglePermission(activeRole, "sale")}
                  icon={Check}
                />
                <ActionButton
                  label="Can View Inventory"
                  checked={permissions[activeRole].inventory}
                  onClick={() => togglePermission(activeRole, "inventory")}
                  icon={Eye}
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 uppercase text-[10px] tracking-widest text-red-600">
                <ShieldAlert size={14} /> Restricted Actions
              </h3>
              <div className="space-y-2">
                <ActionButton
                  label="Can View Reports"
                  checked={permissions[activeRole].reports}
                  onClick={() => togglePermission(activeRole, "reports")}
                  icon={Activity}
                />
                <ActionButton
                  label="Can Delete/Edit Sales"
                  checked={permissions[activeRole].delete}
                  onClick={() => togglePermission(activeRole, "delete")}
                  icon={Trash2}
                />
              </div>
            </div>
          </div>

          {/* LOGIN ACTIVITY */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Activity size={12} /> Recent Login Activity (2026)
            </h3>
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="p-4">User</th>
                    <th className="p-4">Device / IP</th>
                    <th className="p-4">Timestamp</th>
                    <th className="p-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="text-xs font-bold text-slate-700 divide-y divide-slate-50">
                  <tr>
                    <td className="p-4 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />{" "}
                      Admin
                    </td>
                    <td className="p-4 flex items-center gap-2 text-slate-400 font-medium">
                      <Globe size={12} /> 192.168.1.1 (Chrome)
                    </td>
                    <td className="p-4 text-slate-400 font-medium">
                      09 Jan 2026, 14:30
                    </td>
                    <td className="p-4 text-right text-emerald-600 uppercase text-[10px]">
                      Active Now
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-slate-300" />{" "}
                      Cashier_1
                    </td>
                    <td className="p-4 flex items-center gap-2 text-slate-400 font-medium">
                      <Smartphone size={12} /> POS-Handheld-04
                    </td>
                    <td className="p-4 text-slate-400 font-medium">
                      09 Jan 2026, 09:15
                    </td>
                    <td className="p-4 text-right text-slate-400 uppercase text-[10px]">
                      Logged Out
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
