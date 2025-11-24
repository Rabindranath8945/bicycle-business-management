// app/purchase/list.tsx
import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import Link from "expo-router/link";

const purchases = [
  { id: "pu1", vendor: "Vendor A", date: "2025-11-10", total: 3560 },
  { id: "pu2", vendor: "Vendor B", date: "2025-11-21", total: 1280 },
];

export default function PurchaseList() {
  return (
    <View style={styles.screen}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Purchases</Text>
        <Link href="/purchase/new">
          <Text style={{ color: "#1A82FF" }}>+ New</Text>
        </Link>
      </View>

      <FlatList
        data={purchases}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={{ fontWeight: "700" }}>{item.vendor}</Text>
            <Text style={{ color: "#666" }}>{item.date}</Text>
            <Text style={{ marginTop: 6, fontWeight: "700" }}>
              ₹ {item.total}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16, backgroundColor: "#F3F7FF" },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: { fontSize: 20, fontWeight: "700" },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
  },
});
