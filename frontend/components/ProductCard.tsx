type Props = {
  product: any;
  qty: number;
  onAdd: () => void;
  onInc: () => void;
  onDec: () => void;
};

export default function ProductCard({
  product,
  qty,
  onAdd,
  onInc,
  onDec,
}: Props) {
  return (
    <div className="bg-white border rounded-xl p-3 flex flex-col justify-between hover:shadow-sm">
      <div>
        <div className="font-medium truncate">{product.name}</div>
        <div className="text-xs text-gray-500">
          ₹{product.salePrice} • GST {product.taxPercent ?? 5}%
        </div>

        {product.stock !== undefined && (
          <div
            className={`text-xs mt-1 ${
              product.stock <= 3 ? "text-red-500" : "text-gray-400"
            }`}
          >
            Stock: {product.stock}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-3">
        {qty > 0 ? (
          <div className="flex items-center gap-2">
            <button onClick={onDec} className="w-8 h-8 border rounded-full">
              −
            </button>
            <span className="font-semibold">{qty}</span>
            <button onClick={onInc} className="w-8 h-8 border rounded-full">
              +
            </button>
          </div>
        ) : (
          <button
            onClick={onAdd}
            className="w-full py-2 bg-emerald-600 text-white rounded-lg text-sm"
          >
            Add
          </button>
        )}
      </div>
    </div>
  );
}
