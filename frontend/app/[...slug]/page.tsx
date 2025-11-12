"use client";
import { useAutoFetch } from "@/lib/hooks/useAutoFetch";

export default function DynamicPage() {
  const { data, loading, error } = useAutoFetch();

  if (loading) return <div className="p-8 text-gray-400">Loading data...</div>;
  if (error) return <div className="p-8 text-red-400">Error: {error}</div>;
  if (!data || data.length === 0)
    return <div className="p-8 text-gray-400">No data available.</div>;

  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold text-emerald-400 mb-4">
        Data Loaded from Backend
      </h1>
      <pre className="bg-slate-800 p-4 rounded-lg text-sm overflow-x-auto text-gray-300">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
