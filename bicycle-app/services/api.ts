// services/api.ts
import axios from "axios";
import * as SecureStore from "expo-secure-store";

const API_BASE =
  process.env.EXPO_PUBLIC_API_URL ||
  "https://mandal-cycle-pos-api.onrender.com";

// simple helper to get token from SecureStore
export async function getToken() {
  try {
    return await SecureStore.getItemAsync("authToken");
  } catch {
    return null;
  }
}

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// attach token on each request
api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // you can handle refresh token here if you implement refresh flow
    return Promise.reject(err);
  }
);

export default api;
