import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "../../lib/axios";

// ----------------------
// TYPE FOR SALES ROW
// ----------------------
type SaleRow = {
  _id: string;
  invoiceNo: string;
  customerName?: string;
  phone?: string;
  grandTotal: number;
  createdAt: string;
};

export default function SalesListScreen() {
  const router = useRouter();

  // Add proper typing ⬇⬇⬇
  const [sales, setSales] = useState<SaleRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/sales");

      // Ensure it's an array
      if (Array.isArray(res.data)) {
        setSales(res.data);
      } else if (Array.isArray(res.data?.sales)) {
        setSales(res.data.sales);
      } else {
        setSales([]);
      }
    } catch (err) {
      console.log("Sales fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Safe filter with typing
  const filtered = sales.filter((s) => {
    const q = search.toLowerCase();
    return (
      (s.customerName || "").toLowerCase().includes(q) ||
      (s.phone || "").toLowerCase().includes(q) ||
      (s.invoiceNo || "").toLowerCase().includes(q)
    );
  });

  const renderItem = ({ item }: { item: SaleRow }) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/sales/[id]",
          params: { id: item._id },
        })
      }
      style={{
        backgroundColor: "#fff",
        marginBottom: 10,
        padding: 16,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 3,
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: "700" }}>{item.invoiceNo}</Text>

      <Text style={{ color: "#475569" }}>
        {item.customerName || "Walk-in Customer"}
      </Text>

      <Text style={{ fontWeight: "600", marginTop: 4 }}>
        ₹ {Number(item.grandTotal).toFixed(2)}
      </Text>

      <Text style={{ color: "#94a3b8", marginTop: 6 }}>
        {new Date(item.createdAt).toLocaleString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#f1f5f9" }}>
      <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 10 }}>
        Sales History
      </Text>

      <TextInput
        placeholder="Search invoice, customer, phone..."
        value={search}
        onChangeText={setSearch}
        style={{
          backgroundColor: "#fff",
          padding: 12,
          borderRadius: 12,
          marginBottom: 12,
        }}
      />

      {loading ? (
        <Text style={{ textAlign: "center", marginTop: 20 }}>Loading...</Text>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}
