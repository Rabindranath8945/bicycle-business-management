// app/sales/new.tsx
import React from "react";
import { View, Text, TouchableOpacity, FlatList, Alert } from "react-native";

const sampleCart = [
  { id: "p1", name: "City Cycle A", price: 12500, qty: 1 },
  { id: "p3", name: 'Tube 26"', price: 250, qty: 2 },
];

export default function NewSale() {
  const subtotal = sampleCart.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <View style={{ flex: 1, padding: 12, backgroundColor: "#F3F7FF" }}>
      <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 12 }}>
        New Sale
      </Text>

      <FlatList
        data={sampleCart}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: "#fff",
              padding: 12,
              borderRadius: 10,
              marginBottom: 10,
            }}
          >
            <Text style={{ fontSize: 16 }}>
              {item.name} x{item.qty}
            </Text>
            <Text style={{ color: "#444" }}>₹ {item.price * item.qty}</Text>
          </View>
        )}
      />

      <View style={{ marginTop: 12 }}>
        <Text style={{ fontSize: 16 }}>Subtotal: ₹ {subtotal}</Text>
        <TouchableOpacity
          style={{
            marginTop: 14,
            backgroundColor: "#1A82FF",
            padding: 12,
            borderRadius: 8,
          }}
          onPress={() => Alert.alert("Save", "Sale saved (stub).")}
        >
          <Text
            style={{ color: "#fff", textAlign: "center", fontWeight: "700" }}
          >
            Save & Print
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
