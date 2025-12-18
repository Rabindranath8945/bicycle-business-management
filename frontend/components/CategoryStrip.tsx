"use client";

type Category = {
  _id: string;
  name: string;
  count?: number;
};

type Props = {
  categories: Category[];
  activeId: string | null;
  onSelect: (id: string | null) => void;
};

export default function CategoryStrip({
  categories,
  activeId,
  onSelect,
}: Props) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 mb-4">
      {/* ALL */}
      <button
        onClick={() => onSelect(null)}
        className={`min-w-[120px] px-4 py-3 rounded-xl border text-left
          ${
            activeId === null
              ? "bg-emerald-600 text-white border-emerald-600"
              : "bg-white border-gray-200 hover:bg-gray-50"
          }`}
      >
        <div className="font-medium">All</div>
        <div className="text-xs opacity-80">All items</div>
      </button>

      {categories.map((c) => (
        <button
          key={c._id}
          onClick={() => onSelect(c._id)}
          className={`min-w-[160px] px-4 py-3 rounded-xl border text-left
            ${
              activeId === c._id
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-white border-gray-200 hover:bg-gray-50"
            }`}
        >
          <div className="font-medium truncate">{c.name}</div>
          <div className="text-xs opacity-80">{c.count ?? 0} items</div>
        </button>
      ))}
    </div>
  );
}
