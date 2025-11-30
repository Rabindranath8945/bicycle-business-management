// app/products/index.tsx
import React, { useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BankingHeader from "../../components/BankingHeader";
import { Ionicons } from "@expo/vector-icons";
import { bankingTheme } from "../../theme/banking";
import BottomNav from "../../components/BottomNav";
import { router, useFocusEffect } from "expo-router/build";

/* ---------- Product Type Matching Backend ---------- */
type Product = {
  _id: string;
  name: string;
  categoryId: string;
  salePrice: number;
  costPrice: number;
  wholesalePrice: number;
  stock: number;
  sku?: string;
  barcode?: string;
  productNumber?: string;
  hsn?: string;
  photo?: string | null;
  active?: boolean;
  categoryName?: string; // only if API populates category
};

/* ---------- Backend URL ---------- */
const BASE_URL = "https://mandal-cycle-pos-api.onrender.com";

export default function ProductsPage() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  /* -------------------------------------------------------------
        FETCH PRODUCTS
     ------------------------------------------------------------- */
  async function fetchProducts() {
    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/api/products`);
      const data = await res.json();

      const mapped: Product[] = data.map((p: any) => ({
        _id: p._id,
        name: p.name,
        categoryId: p.categoryId,
        categoryName: p.categoryName, // only if backend populates
        salePrice: Number(p.salePrice || 0),
        costPrice: Number(p.costPrice || 0),
        wholesalePrice: Number(p.wholesalePrice || 0),
        stock: Number(p.stock || 0),
        sku: p.sku,
        barcode: p.barcode,
        productNumber: p.productNumber,
        hsn: p.hsn,
        photo: p.photo || null,
        active: p.active,
      }));

      setProducts(mapped);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Unable to fetch products.");
    } finally {
      setLoading(false);
    }
  }

  /* -------------------------------------------------------------
        FETCH CATEGORIES
     ------------------------------------------------------------- */
  async function fetchCategories() {
    try {
      const res = await fetch(`${BASE_URL}/api/categories`);
      const data = await res.json();
      setCategories(data.map((c: any) => c.name));
    } catch (err) {
      console.log("Category fetch failed", err);
    }
  }

  /* Load on mount */
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  /* Auto refresh on screen focus */
  useFocusEffect(
    React.useCallback(() => {
      fetchProducts();
    }, [])
  );

  /* -------------------------------------------------------------
        SEARCH + FILTER
     ------------------------------------------------------------- */
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products;

    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.sku || "").toLowerCase().includes(q)
      );
    }

    if (selectedCategories.length > 0) {
      list = list.filter((p) =>
        selectedCategories.includes(p.categoryName || "")
      );
    }

    return list;
  }, [products, query, selectedCategories]);

  /* -------------------------------------------------------------
        EDIT NAVIGATION
     ------------------------------------------------------------- */
  function onEdit(item: Product) {
    Alert.alert("✏️ Edit Product", `You are editing: ${item.name}`, [
      {
        text: "Edit Now",
        onPress: () => router.push(`/products/${item._id}`),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  }

  /* -------------------------------------------------------------
        LOADING UI
     ------------------------------------------------------------- */
  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={{ marginTop: 40 }}>
          <ActivityIndicator size="large" />
          <Text style={{ textAlign: "center", marginTop: 10 }}>
            Loading products...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  /* -------------------------------------------------------------
        RENDER SINGLE PRODUCT ROW
     ------------------------------------------------------------- */
  function renderItem({ item }: { item: Product }) {
    return (
      <View style={styles.listRow}>
        <View style={styles.rowLeft}>
          <Text style={styles.productTitle}>{item.name}</Text>

          <Text style={{ color: "#6b7280", fontSize: 12, marginTop: 2 }}>
            SKU: {item.sku || "N/A"}
          </Text>

          <View style={styles.rowSub}>
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>Selling Price</Text>
              <Text style={styles.metaValue}>
                ₹ {Number(item.salePrice || 0).toFixed(2)}
              </Text>
            </View>

            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>Cost Price</Text>
              <Text style={styles.metaValue}>
                ₹ {Number(item.costPrice || 0).toFixed(2)}
              </Text>
            </View>

            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>Wholesale</Text>
              <Text style={styles.metaValue}>
                ₹ {Number(item.wholesalePrice || 0).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.rowRight} pointerEvents="auto">
          <Text
            style={[
              styles.stockValue,
              item.stock <= 0 ? styles.stockZero : styles.stockPositive,
            ]}
          >
            {item.stock}
          </Text>
          <Text style={styles.stockLabel}>In Stock</Text>

          <TouchableOpacity
            onPress={() => onEdit(item)}
            style={styles.actionBtn}
          >
            <Ionicons
              name="create-outline"
              size={18}
              color={bankingTheme.colors.primary}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  /* -------------------------------------------------------------
        MAIN UI
     ------------------------------------------------------------- */
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.container}>
        <BankingHeader hideSales />

        {/* search/filter/new row */}
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={18} color="#9AA4B2" />
            <TextInput
              placeholder="Search items, SKU or product no."
              placeholderTextColor="#9AA4B2"
              style={styles.searchInput}
              value={query}
              onChangeText={setQuery}
            />
          </View>

          <TouchableOpacity
            style={styles.filterBtn}
            onPress={() => setFilterVisible(true)}
          >
            <Ionicons name="funnel-outline" size={18} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.newBtn}
            onPress={() => router.push("/products/new")}
          >
            <Text style={styles.newBtnText}>+ Add Item</Text>
          </TouchableOpacity>
        </View>

        {/* product list */}
        <FlatList
          data={visible}
          keyExtractor={(i) => i._id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          contentContainerStyle={{ padding: 12, paddingBottom: 120 }}
        />

        {/* bottom nav */}
        <BottomNav />
      </View>
    </SafeAreaView>
  );
}

/* -------------------------------------------------------------
        STYLES (unchanged from your UI)
   ------------------------------------------------------------- */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: bankingTheme.colors.background },
  container: { flex: 1, backgroundColor: bankingTheme.colors.background },

  searchRow: {
    flexDirection: "row",
    paddingHorizontal: 12,
    alignItems: "center",
    marginTop: 12,
    gap: 8,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: "center",
    elevation: 2,
  },
  searchInput: { marginLeft: 8, flex: 1, height: 40, color: "#111" },

  filterBtn: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: bankingTheme.colors.primary,
  },
  newBtn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: bankingTheme.colors.secondary,
  },
  newBtnText: { color: bankingTheme.colors.primary, fontWeight: "700" },

  listRow: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
  },

  rowLeft: { flex: 1 },
  productTitle: { fontWeight: "700", fontSize: 16, color: "#0f172a" },

  rowSub: { flexDirection: "row", marginTop: 8, gap: 10 },

  metaCol: {},
  metaLabel: { color: bankingTheme.colors.textSecondary, fontSize: 12 },
  metaValue: { fontWeight: "700", fontSize: 14 },

  rowRight: { alignItems: "flex-end", width: 96 },
  stockValue: { fontWeight: "600", fontSize: 16 },
  stockLabel: { fontSize: 11, color: bankingTheme.colors.textSecondary },
  stockZero: { color: "#ef4444" },
  stockPositive: { color: "#059669" },

  actionBtn: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 8,
    elevation: 1,
    marginTop: 10,
  },
});
