// app/products/index.tsx
import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { bankingTheme } from "../../theme/banking";
import { Link } from "expo-router";

const mock = [
  { id: "p1", name: "City Cycle A", price: 12500, stock: 5 },
  { id: "p2", name: "Mountain Bike X", price: 25600, stock: 2 },
  { id: "p3", name: 'Tube 26"', price: 250, stock: 48 },
];

export default function Products() {
  return (
    <View
      style={{
        flex: 1,
        padding: 12,
        backgroundColor: bankingTheme.colors.background,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "700" }}>Products</Text>
        <Link href="/products/new">
          <Text style={{ color: bankingTheme.colors.info }}>+ Add</Text>
        </Link>
      </View>

      <FlatList
        data={mock}
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
            <Text style={{ fontSize: 16 }}>{item.name}</Text>
            <Text style={{ color: "#666" }}>
              ₹ {item.price} • stock: {item.stock}
            </Text>
          </View>
        )}
      />
    </View>
  );
}
