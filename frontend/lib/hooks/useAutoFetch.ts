"use client";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { usePathname } from "next/navigation";

const routeToEndpointMap: Record<string, string> = {
  "/products": "/api/products",
  "/categories": "/api/categories",
  "/sales": "/api/sales",
  "/sales/invoices": "/api/sales",
  "/purchases": "/api/purchases",
  "/purchases/orders": "/api/purchases",
  "/customers": "/api/customers",
  "/suppliers": "/api/suppliers",
  "/accounting/expenses": "/api/expenses",
  "/accounting/ledger": "/api/accounting/ledger",
  "/accounting/cashbank": "/api/accounting/cashbank",
  "/accounting/sales-purchase": "/api/accounting/sales-purchase",
  "/accounting/reports/pl": "/api/reports/pl",
  "/accounting/reports/balance": "/api/reports/balance",
  "/accounting/reports/cashflow": "/api/reports/cashflow",
  "/accounting/reports/gst": "/api/reports/gst",
  "/accounting/reports/dues": "/api/reports/dues",
  "/accounting/payroll": "/api/accounting/payroll",
  "/accounting/loans": "/api/accounting/loans",
  "/accounting/audit": "/api/accounting/audit",
};

export const useAutoFetch = () => {
  const pathname = usePathname();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const endpoint = routeToEndpointMap[pathname];
    if (!endpoint) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    axios
      .get(endpoint)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [pathname]);

  return { data, loading, error };
};
