// app/accounting/daybook.tsx
import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

const daybook = [
  { id: "1", type: "Sale", amount: 2400, time: "10:45 AM" },
  { id: "2", type: "Expense", amount: 180, time: "12:10 PM" },
  { id: "3", type: "Purchase", amount: 1150, time: "3:25 PM" },
];

export default function Daybook() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Daybook</Text>

      <FlatList
        data={daybook}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.type}>{item.type}</Text>
            <Text style={styles.amount}>₹ {item.amount}</Text>
            <Text style={styles.time}>{item.time}</Text>
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
  type: { fontWeight: "700" },
  amount: { marginTop: 6, fontSize: 16 },
  time: { marginTop: 4, color: "#666" },
});
