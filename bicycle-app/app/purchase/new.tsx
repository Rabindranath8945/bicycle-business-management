// app/purchase/new.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
} from "react-native";

const sampleItems = [
  { id: "p1", name: "Chain 1", price: 350, qty: 1 },
  { id: "p2", name: "Brake Pad", price: 120, qty: 2 },
];

export default function NewPurchase() {
  const subtotal = sampleItems.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>New Purchase</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Vendor</Text>
        <TextInput placeholder="Select or add vendor" style={styles.input} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Items</Text>
        <FlatList
          data={sampleItems}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <View style={styles.itemRow}>
              <View>
                <Text style={{ fontWeight: "600" }}>{item.name}</Text>
                <Text style={{ color: "#666" }}>
                  Qty: {item.qty} • ₹ {item.price}
                </Text>
              </View>
              <Text style={{ fontWeight: "700" }}>
                ₹ {item.price * item.qty}
              </Text>
            </View>
          )}
        />
        <View style={{ marginTop: 12 }}>
          <Text style={styles.sub}>Subtotal: ₹ {subtotal}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.primary}
        onPress={() => Alert.alert("Saved", "Purchase saved (stub)")}
      >
        <Text style={{ color: "#fff", fontWeight: "700" }}>Save Purchase</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16, backgroundColor: "#F3F7FF" },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  cardTitle: { fontSize: 14, fontWeight: "700", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#EEF3FF",
    padding: 10,
    borderRadius: 8,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  sub: { fontWeight: "700", fontSize: 16 },
  primary: {
    backgroundColor: "#1A82FF",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
});
