"use client";
import { useEffect, useState } from "react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Products</h1>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">SKU</th>
            <th className="p-2 border">Sale Rate</th>
            <th className="p-2 border">Stock</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p: any) => (
            <tr key={p._id}>
              <td className="p-2 border">{p.name}</td>
              <td className="p-2 border">{p.sku}</td>
              <td className="p-2 border">{p.saleRate}</td>
              <td className="p-2 border">{p.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
