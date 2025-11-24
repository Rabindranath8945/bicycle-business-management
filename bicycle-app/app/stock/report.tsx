// app/stock/report.tsx
import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

const items = [
  { id: "s1", name: "City Cycle A", stock: 5 },
  { id: "s2", name: 'Tube 26"', stock: 48 },
  { id: "s3", name: "Brake Pad", stock: 2 },
];

export default function StockReport() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Stock Report</Text>
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={{ fontWeight: "700" }}>{item.name}</Text>
            <Text style={{ color: "#666", marginTop: 6 }}>
              Stock: {item.stock}
            </Text>
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
