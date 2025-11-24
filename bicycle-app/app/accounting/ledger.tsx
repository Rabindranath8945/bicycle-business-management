// app/accounting/ledger.tsx
import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

const entries = [
  { id: "1", date: "2025-11-21", type: "Credit", amount: 3000, balance: 15000 },
  { id: "2", date: "2025-11-22", type: "Debit", amount: 1200, balance: 13800 },
];

export default function Ledger() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Ledger</Text>

      <FlatList
        data={entries}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.date}>{item.date}</Text>
            <Text
              style={[
                styles.type,
                { color: item.type === "Credit" ? "#1A82FF" : "#E53935" },
              ]}
            >
              {item.type}
            </Text>
            <Text style={styles.amount}>₹ {item.amount}</Text>
            <Text style={styles.balance}>Balance: ₹ {item.balance}</Text>
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
  date: { color: "#666" },
  type: { marginTop: 4, fontWeight: "700" },
  amount: { marginTop: 6, fontSize: 16, fontWeight: "700" },
  balance: { marginTop: 6, color: "#444" },
});
