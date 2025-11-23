import axios from "axios";
import Constants from "expo-constants";
import { useUser } from "../store/useUser";

const API_BASE =
  Constants.expoConfig?.extra?.apiUrl ||
  "https://mandal-cycle-pos-api.onrender.com";

export const useApi = () => {
  const token = useUser((s) => s.user?.token);

  const instance = axios.create({
    baseURL: API_BASE,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
  });

  return instance;
};

// Dashboard API
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

    return {
      productCount: products.data.count,
      salesToday: salesToday.data.total,
      categoryCount: categories.data.count,
      lowStockCount: lowStock.data.count,
      recentSales: recent.data,
    };
  };

  return { getDashboardStats };
};
