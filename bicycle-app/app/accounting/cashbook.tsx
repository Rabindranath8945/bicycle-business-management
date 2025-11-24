// app/accounting/cashbook.tsx
import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

const cashbook = [
  { id: "1", desc: "Sale Income", in: 2400, out: 0 },
  { id: "2", desc: "Vendor Payment", in: 0, out: 800 },
];

export default function Cashbook() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Cashbook</Text>

      <FlatList
        data={cashbook}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.desc}>{item.desc}</Text>
            <Text style={[styles.in, { color: "#1A82FF" }]}>
              In: ₹ {item.in}
            </Text>
            <Text style={[styles.out, { color: "#E53935" }]}>
              Out: ₹ {item.out}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16, backgroundColor: "#F3F7FF" },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 14 },
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  desc: { fontWeight: "700", marginBottom: 4 },
  in: { marginTop: 4 },
  out: { marginTop: 2 },
});
