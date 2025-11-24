// components/DashboardExtra.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { bankingTheme } from "../theme/banking";

export default function DashboardExtra() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Insights</Text>

      <View style={styles.card}>
        <Ionicons name="cash-outline" size={26} color="#3b82f6" />
        <View style={styles.info}>
          <Text style={styles.label}>Daily Revenue</Text>
          <Text style={styles.value}>₹ 6,800</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Ionicons name="trending-up-outline" size={26} color="#22c55e" />
        <View style={styles.info}>
          <Text style={styles.label}>Weekly Revenue</Text>
          <Text style={styles.value}>₹ 45,200</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Ionicons name="stats-chart-outline" size={26} color="#8b5cf6" />
        <View style={styles.info}>
          <Text style={styles.label}>Monthly Revenue</Text>
          <Text style={styles.value}>₹ 1,78,000</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Ionicons name="star-outline" size={26} color="#f59e0b" />
        <View style={styles.info}>
          <Text style={styles.label}>Top Product</Text>
          <Text style={styles.value}>Hero Sprint 26”</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 12,
    elevation: 3,
  },
  info: {
    marginLeft: 14,
  },
  label: {
    color: bankingTheme.colors.textSecondary,
    fontSize: 13,
  },
  value: {
    marginTop: 3,
    fontSize: 18,
    fontWeight: "700",
  },
});
