// app/purchase/vendors.tsx
import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const vendors = [
  { id: "v1", name: "Vendor A", phone: "9876543210" },
  { id: "v2", name: "Vendor B", phone: "9123456780" },
];

export default function Vendors() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Vendors</Text>
      <FlatList
        data={vendors}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <Text style={{ fontWeight: "700" }}>{item.name}</Text>
            <Text style={{ color: "#666" }}>{item.phone}</Text>
          </TouchableOpacity>
        )}
      />
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
    marginBottom: 10,
    elevation: 2,
  },
});
