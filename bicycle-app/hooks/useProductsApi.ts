// hooks/useProductsApi.ts
import { useCallback } from "react";
import { useApi } from "../hooks/useApi"; // adjust path if needed

export type Product = {
  _id?: string;
  name: string;
  sku?: string;
  hsn?: string;
  categoryId?: string;
  purchasePrice?: number;
  salePrice?: number;
  stock?: number;
  photo?: string;
  productNumber?: string;
};

export const useProductsApi = () => {
  const api = useApi();

  const listProducts = useCallback(
    async (page = 1, q = "", categoryId?: string) => {
      const res = await api.get("/products", {
        params: { page, q, categoryId },
      });
      return res.data;
    },
    [api]
  );

  const getProduct = useCallback(
    async (id: string) => {
      const res = await api.get(`/products/${id}`);
      return res.data;
    },
    [api]
  );

  const createProduct = useCallback(
    async (payload: FormData | object) => {
      // If FormData (with photo), set correct headers in useApi or here
      const res = await api.post("/products", payload);
      return res.data;
    },
    [api]
  );

  const updateProduct = useCallback(
    async (id: string, payload: FormData | object) => {
      const res = await api.patch(`/products/${id}`, payload);
      return res.data;
    },
    [api]
  );

  const deleteProduct = useCallback(
    async (id: string) => {
      const res = await api.delete(`/products/${id}`);
      return res.data;
    },
    [api]
  );

  return {
    listProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};
