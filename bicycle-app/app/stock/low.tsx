// app/stock/low.tsx
import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

const low = [
  { id: "l1", name: "Mountain Bike X", stock: 2 },
  { id: "l2", name: "Brake Pad", stock: 1 },
];

export default function LowStock() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Low Stock</Text>
      <FlatList
        data={low}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={{ fontWeight: "700" }}>{item.name}</Text>
            <Text style={{ color: "#E53935", marginTop: 6 }}>
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
