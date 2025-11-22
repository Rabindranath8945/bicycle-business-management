import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import api from "../../services/api";

export default function ProductList() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.log("fetchProducts error:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.photo || "https://via.placeholder.com/80" }}
        style={styles.img}
      />

      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.category}>{item.categoryName}</Text>

        <View
          style={{ flexDirection: "row", marginTop: 6, alignItems: "center" }}
        >
          <Text style={styles.price}>₹{item.salePrice}</Text>

          <Text style={[styles.stock, item.stock <= 3 && styles.lowStock]}>
            Stock: {item.stock}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => router.push(`/sales/new?product=${item._id}` as const)}
        style={styles.addBtn}
      >
        <Text style={{ color: "#fff", fontWeight: "700" }}>Add</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text style={{ textAlign: "center" }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 3,
    alignItems: "center",
  },
  img: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 12,
  },
  name: {
    fontWeight: "700",
    fontSize: 16,
  },
  category: {
    color: "#6b7280",
    fontSize: 13,
  },
  price: {
    fontWeight: "700",
    color: "#059669",
    marginRight: 12,
  },
  stock: {
    color: "#6b7280",
    fontSize: 12,
  },
  lowStock: {
    color: "#dc2626",
    fontWeight: "700",
  },
  addBtn: {
    backgroundColor: "#059669",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
});
