// app/accounting/expenses.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";

const expenses = [
  { id: "1", label: "Electricity Bill", amount: 850, date: "2025-11-20" },
  { id: "2", label: "Shop Cleaning", amount: 300, date: "2025-11-21" },
];

export default function Expenses() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Expenses</Text>

      <FlatList
        data={expenses}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.amount}>₹ {item.amount}</Text>
            <Text style={styles.date}>{item.date}</Text>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.primary}
        onPress={() => Alert.alert("Add Expense", "Add expense form (stub)")}
      >
        <Text style={{ color: "#fff", fontWeight: "700" }}>Add Expense</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16, backgroundColor: "#F3F7FF" },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 14 },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
  },
  label: { fontWeight: "700" },
  amount: { marginTop: 6 },
  date: { marginTop: 4, color: "#666" },

  primary: {
    backgroundColor: "#1A82FF",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 16,
  },
});
