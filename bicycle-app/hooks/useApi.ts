// hooks/useApi.ts
import axios from "axios";
import Constants from "expo-constants";
import { useUser } from "../store/useUser";

const API_BASE =
  Constants.expoConfig?.extra?.apiUrl ||
  "https://mandal-cycle-pos-api.onrender.com";

export const useApi = () => {
  const token = useUser((s) => s.user?.token);

  const instance = axios.create({
    baseURL: API_BASE + "/api",
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  return instance;
};

export const useDashboardApi = () => {
  const api = useApi();

  const getDashboardStats = async () => {
    const [products, salesToday, categories, lowStock, recent] =
      await Promise.all([
        api.get("/products/count"),
        api.get("/sales/today"),
        api.get("/categories/count"),
        api.get("/products/low-stock/count"),
        api.get("/sales/recent?limit=5"),
      ]);

    // OPTIONAL: fetch top-selling products (create API below)
    let topProducts: any[] = [];
    try {
      const top = await api.get("/sales/top-products");
      topProducts = top.data;
    } catch (e) {
      topProducts = [];
    }

    return {
      productCount: products.data.count || 0,
      salesToday: salesToday.data.total || 0,
      categoryCount: categories.data.count || 0,
      lowStockCount: lowStock.data.count || 0,
      recentSales: recent.data || [],
      topProducts,
    };
  };

  return { getDashboardStats };
};
