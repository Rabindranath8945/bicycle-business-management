import axios from "axios";
import Constants from "expo-constants";
import { useUser } from "../store/useUser";

const API_BASE =
  Constants.expoConfig?.extra?.apiUrl ||
  "https://mandal-cycle-pos-api.onrender.com";

export const useApi = () => {
  const instance = axios.create({
    baseURL: API_BASE,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // 🔐 AUTO ADD TOKEN
  instance.interceptors.request.use((config) => {
    const token = useUser.getState().user?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
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
