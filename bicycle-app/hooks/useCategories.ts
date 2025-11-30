import { useEffect, useState } from "react";

const BASE_URL = "https://mandal-cycle-pos-api.onrender.com";
const CATEGORY_API = `${BASE_URL}/api/categories`;

export default function useCategories() {
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  async function loadCategories() {
    try {
      console.log("Calling API:", CATEGORY_API);

      const res = await fetch(CATEGORY_API, {
        headers: {
          "Cache-Control": "no-cache",
          Accept: "application/json",
        },
      });

      console.log("Status:", res.status);

      // If backend returns 304 → React Native gets EMPTY BODY
      if (res.status === 304) {
        console.log("304 received — server says data not modified");

        // ❗ KEEP PREVIOUS CATEGORIES (if already loaded)
        setLoading(false);
        return;
      }

      const text = await res.text();
      console.log("Raw:", text);

      if (text.startsWith("<")) {
        console.log("Cold start — retry");
        setTimeout(loadCategories, 1200);
        return;
      }

      const data = JSON.parse(text);

      if (Array.isArray(data)) {
        console.log("Setting categories:", data.length);
        setCategories(data);
      }
    } catch (err) {
      console.error("CATEGORY FETCH ERROR:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  return { categories, loading };
}
