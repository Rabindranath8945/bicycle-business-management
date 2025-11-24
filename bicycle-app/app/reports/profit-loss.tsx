// app/reports/profit-loss.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ProfitLossReport() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Profit & Loss</Text>
      <View style={styles.card}>
        <Text style={{ color: "#666" }}>
          Profit and Loss summary will appear here.
        </Text>
      </View>
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
    elevation: 2,
  },
});
