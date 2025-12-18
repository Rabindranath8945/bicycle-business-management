import ProductCard from "./ProductCard";

export default function ProductGrid({
  products,
  cart,
  onAdd,
  onInc,
  onDec,
}: any) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((p: any) => {
        const item = cart.find((i: any) => i._id === p._id);
        return (
          <ProductCard
            key={p._id}
            product={p}
            qty={item?.qty || 0}
            onAdd={() => onAdd(p)}
            onInc={() => onInc(p._id)}
            onDec={() => onDec(p._id)}
          />
        );
      })}
    </div>
  );
}
