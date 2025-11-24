// app/products/index.tsx
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BankingHeader from "../../components/BankingHeader";
import { Ionicons } from "@expo/vector-icons";
import { bankingTheme } from "../../theme/banking";
import BottomNav from "../../components/BottomNav";

/* sample data - replace with your API */
type Product = {
  id: string;
  name: string;
  sku?: string;
  salePrice: number;
  purchasePrice: number;
  wholesalePrice: number;
  stock: number;
};
const CATEGORIES = [
  "Tyre",
  "Tube",
  "Rim",
  "Mudguard",
  "Frock",
  "Chaincover",
  "Chain",
  "Free",
  "Gear",
  "Frame",
  "Handle",
  "Padel",
  "Bell",
];

const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "1",
    name: 'Backestra 20" K.W.',
    sku: "BK-20KW",
    salePrice: 175,
    purchasePrice: 125,
    wholesalePrice: 100,
    stock: 0,
  },
  {
    id: "2",
    name: 'Backestra 20" Local',
    sku: "BK-20L",
    salePrice: 120,
    purchasePrice: 90,
    wholesalePrice: 80,
    stock: 2,
  },
  {
    id: "3",
    name: 'Backestra 20" Solid',
    sku: "BK-20S",
    salePrice: 210,
    purchasePrice: 175,
    wholesalePrice: 150,
    stock: 0,
  },
  {
    id: "4",
    name: 'Backestra 22" K.W.',
    sku: "BK-22KW",
    salePrice: 175,
    purchasePrice: 130,
    wholesalePrice: 110,
    stock: 5,
  },
];

export default function ProductsPage() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // statistics (this month) - sample calculation. Replace with real API.
  const stats = useMemo(() => {
    const sale =
      products.reduce(
        (s, p) => s + p.salePrice * Math.max(1, Math.round(Math.random() * 3)),
        0
      ) || 37845;
    const purchase =
      products.reduce(
        (s, p) =>
          s + p.purchasePrice * Math.max(1, Math.round(Math.random() * 3)),
        0
      ) || 37430;
    const prev = Math.round(purchase * 0.95);
    const profitPct = prev
      ? Math.round(((sale - purchase) / prev) * 100 * 100) / 100
      : -4.26;
    return { sale, purchase, profitPct, prev };
  }, [products]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = products;

    // search filter
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.sku || "").toLowerCase().includes(q)
      );
    }

    // category filter
    if (selectedCategories.length > 0) {
      list = list.filter((p) =>
        selectedCategories.some((cat) =>
          p.name.toLowerCase().includes(cat.toLowerCase())
        )
      );
    }

    return list;
  }, [products, query, selectedCategories]);

  function onEdit(p: Product) {
    Alert.alert("Edit", `Edit product ${p.name}`);
  }
  function onDelete(p: Product) {
    Alert.alert("Delete", `Delete ${p.name}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => setProducts((prev) => prev.filter((x) => x.id !== p.id)),
      },
    ]);
  }

  function openAddProduct() {
    Alert.alert("Add Product", "Open Add Product screen");
  }

  function addPurchase() {
    Alert.alert("Add Purchase", "Open Add Purchase screen");
  }
  function addSale() {
    Alert.alert("Add Sale", "Open Add Sale screen");
  }

  function renderItem({ item }: { item: Product }) {
    return (
      <View style={styles.listRow}>
        <View style={styles.rowLeft}>
          <Text style={styles.productTitle}>{item.name}</Text>

          {/* SKU under name */}
          <Text style={{ color: "#6b7280", fontSize: 12, marginTop: 2 }}>
            SKU: {item.sku}
          </Text>

          <View style={styles.rowSub}>
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>Sale Price</Text>
              <Text style={styles.metaValue}>
                ₹ {item.salePrice.toFixed(2)}
              </Text>
            </View>

            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>Purchase Price</Text>
              <Text style={styles.metaValue}>
                ₹ {item.purchasePrice.toFixed(2)}
              </Text>
            </View>

            {/* Wholesale Price added */}
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>Wholesale</Text>
              <Text style={styles.metaValue}>
                ₹ {item.wholesalePrice.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.rowRight}>
          <Text
            style={[
              styles.stockValue,
              item.stock <= 0 ? styles.stockZero : styles.stockPositive,
            ]}
          >
            {item.stock}
          </Text>
          <Text style={styles.stockLabel}>In Stock</Text>

          <View style={styles.actions}>
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

            <TouchableOpacity
              onPress={() => onDelete(item)}
              style={[styles.actionBtn, { marginLeft: 8 }]}
            >
              <Ionicons name="trash-outline" size={18} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.container}>
        <BankingHeader hideSales />

        {/* stat row */}
        <View style={styles.statRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Sale (This month)</Text>
            <Text style={styles.statNumber}>
              ₹ {stats.sale.toLocaleString()}
            </Text>
            <Text
              style={[
                styles.statSmall,
                stats.profitPct < 0
                  ? { color: "#ef4444" }
                  : { color: "#16a34a" },
              ]}
            >
              {stats.profitPct}% vs prev
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Purchase (This month)</Text>
            <Text style={styles.statNumber}>
              ₹ {stats.purchase.toLocaleString()}
            </Text>
            <Text style={styles.statSmall}>
              Prev: ₹ {stats.prev.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* search/filter/new item row */}
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
            onPress={() => Alert.alert("New Item", "Open new item form")}
          >
            <Text style={styles.newBtnText}>+ Add Item</Text>
          </TouchableOpacity>
        </View>

        {/* list */}
        <FlatList
          data={visible}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          contentContainerStyle={{ padding: 12, paddingBottom: 160 }}
        />

        {filterVisible && (
          <View style={styles.modalWrap}>
            <View style={styles.modalBox}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Filter Items</Text>
                <TouchableOpacity onPress={() => setFilterVisible(false)}>
                  <Ionicons name="close" size={26} color="#111" />
                </TouchableOpacity>
              </View>

              <Text style={styles.modalSubTitle}>Categories</Text>

              <FlatList
                data={CATEGORIES}
                keyExtractor={(item) => item}
                renderItem={({ item }) => {
                  const active = selectedCategories.includes(item);
                  return (
                    <TouchableOpacity
                      style={styles.catRow}
                      onPress={() => {
                        if (active) {
                          setSelectedCategories((p) =>
                            p.filter((x) => x !== item)
                          );
                        } else {
                          setSelectedCategories((p) => [...p, item]);
                        }
                      }}
                    >
                      <View
                        style={[
                          styles.checkbox,
                          active && styles.checkboxActive,
                        ]}
                      >
                        {active && (
                          <Ionicons name="checkmark" size={18} color="#fff" />
                        )}
                      </View>
                      <Text style={styles.catLabel}>{item}</Text>
                    </TouchableOpacity>
                  );
                }}
              />

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.clearBtn}
                  onPress={() => setSelectedCategories([])}
                >
                  <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.applyBtn}
                  onPress={() => setFilterVisible(false)}
                >
                  <Text style={styles.applyText}>Apply</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* bottom nav */}
        <BottomNav />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: bankingTheme.colors.background },
  container: {
    flex: 1,
    backgroundColor: bankingTheme.colors.background,
    overflow: "visible", // <-- ADD THIS
  },

  /* stats */
  statRow: {
    flexDirection: "row",
    paddingHorizontal: 12,
    gap: 10,
    marginTop: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    elevation: 3,
  },
  statLabel: { color: bankingTheme.colors.textSecondary, fontSize: 13 },
  statNumber: { fontSize: 18, fontWeight: "800", marginTop: 6 },
  statSmall: { fontSize: 12, marginTop: 6 },

  /* search */
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
    marginLeft: 8,
    padding: 10,
    borderRadius: 10,
    backgroundColor: bankingTheme.colors.primary,
  },
  newBtn: {
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: bankingTheme.colors.secondary,
  },
  newBtnText: { color: bankingTheme.colors.primary, fontWeight: "700" },

  /* list row */
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

  actions: { flexDirection: "row", marginTop: 10 },

  actionBtn: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 8,
    elevation: 1,
  },
  modalWrap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.25)",
    zIndex: 999,
    justifyContent: "flex-end",
  },

  modalBox: {
    maxHeight: "84%", // was 75% — now fits correctly
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    paddingBottom: 30, // extra space so buttons never hide
    marginBottom: 70, // pushes modal ABOVE bottom nav
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
  },

  modalSubTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
    marginBottom: 12,
    marginTop: 12,
  },

  catRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },

  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#9CA3AF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  checkboxActive: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },

  catLabel: {
    fontSize: 16,
    color: "#111",
  },

  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  clearBtn: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingVertical: 12,
    marginRight: 10,
    alignItems: "center",
  },

  clearText: {
    color: "#475569",
    fontWeight: "700",
  },

  applyBtn: {
    flex: 1,
    backgroundColor: "#EF4444",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },

  applyText: {
    color: "#fff",
    fontWeight: "700",
  },
});
