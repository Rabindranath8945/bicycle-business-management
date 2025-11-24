// app/reports/sales.tsx
import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

const data = [
  { id: "r1", label: "Today", value: "₹ 2,450" },
  { id: "r2", label: "This Week", value: "₹ 18,340" },
  { id: "r3", label: "This Month", value: "₹ 120,900" },
];

export default function SalesReport() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Sales Report</Text>
      <FlatList
        data={data}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={{ fontWeight: "700" }}>{item.label}</Text>
            <Text style={{ color: "#666", marginTop: 6 }}>{item.value}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F3F7FF", padding: 16 },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
  },
});
