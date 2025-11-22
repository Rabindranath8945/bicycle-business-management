import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TextInput,
} from "react-native";
import api from "../../services/api";
import { useLocalSearchParams } from "expo-router";

export default function NewSale() {
  const params = useLocalSearchParams();
  const [cart, setCart] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  const [discount, setDiscount] = useState("0");

  useEffect(() => {
    fetchProducts();

    // If user clicked "Add" from Product page
    if (params.product) {
      addToCart(String(params.product));
    }
  }, [params]);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.log("product load error", err);
    }
  };

  const addToCart = (id: string) => {
    const existing = cart.find((c) => c._id === id);
    if (existing) {
      existing.qty++;
      setCart([...cart]);
      return;
    }

    const p = products.find((x) => x._id === id);
    if (p) {
      setCart([...cart, { ...p, qty: 1 }]);
    }
  };

  const updateQty = (id: string, qty: number) => {
    setCart(cart.map((c) => (c._id === id ? { ...c, qty } : c)));
  };

  const subtotal = cart.reduce((sum, i) => sum + i.qty * i.salePrice, 0);
  const grandTotal = subtotal - Number(discount || 0);

  return (
    <View style={{ flex: 1, padding: 14 }}>
      <Text style={styles.title}>New Sale</Text>

      <FlatList
        data={cart}
        keyExtractor={(i) => i._id}
        renderItem={({ item }) => (
          <View style={styles.cartRow}>
            <Text style={styles.name}>{item.name}</Text>

            <TextInput
              value={String(item.qty)}
              keyboardType="numeric"
              style={styles.qtyInput}
              onChangeText={(v) => updateQty(item._id, Number(v || 1))}
            />

            <Text style={styles.price}>₹{item.salePrice * item.qty}</Text>
          </View>
        )}
      />

      {/* Add Product Quick List */}
      <Text style={styles.label}>Add Products</Text>

      <FlatList
        data={products}
        keyExtractor={(i) => i._id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.addBox}
            onPress={() => addToCart(item._id)}
          >
            <Text numberOfLines={1} style={styles.addName}>
              {item.name}
            </Text>
            <Text style={styles.addPrice}>₹{item.salePrice}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Totals */}
      <View style={styles.totalBox}>
        <Text style={styles.totalText}>Subtotal: ₹{subtotal.toFixed(2)}</Text>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.label}>Discount:</Text>
          <TextInput
            value={discount}
            onChangeText={setDiscount}
            keyboardType="numeric"
            style={[styles.qtyInput, { width: 80 }]}
          />
        </View>

        <Text style={styles.grand}>Grand Total: ₹{grandTotal.toFixed(2)}</Text>
      </View>

      <TouchableOpacity style={styles.payBtn}>
        <Text style={styles.payText}>Proceed to Pay</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10,
  },
  cartRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
  },
  name: { flex: 1, fontWeight: "600" },
  price: { width: 80, textAlign: "right", fontWeight: "700" },
  qtyInput: {
    width: 50,
    paddingHorizontal: 10,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    marginHorizontal: 10,
    textAlign: "center",
  },
  label: { marginTop: 20, marginBottom: 6, fontWeight: "700" },
  addBox: {
    width: 120,
    padding: 10,
    backgroundColor: "#f9fafb",
    borderRadius: 10,
    marginRight: 10,
    elevation: 2,
  },
  addName: { fontSize: 14, fontWeight: "600" },
  addPrice: { marginTop: 6, color: "#059669", fontWeight: "700" },
  totalBox: { marginTop: 20 },
  totalText: { fontSize: 16, fontWeight: "600" },
  grand: { fontSize: 20, marginTop: 10, fontWeight: "700", color: "#059669" },
  payBtn: {
    backgroundColor: "#059669",
    padding: 14,
    borderRadius: 12,
    marginTop: 20,
  },
  payText: {
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
    fontSize: 16,
  },
});
