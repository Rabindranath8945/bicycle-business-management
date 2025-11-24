// app/settings/print.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function PrintSettings() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Print Settings</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Printer</Text>
        <Text style={{ color: "#666" }}>No printer connected</Text>
        <Text style={styles.label}>Paper Size</Text>
        <Text style={{ color: "#666" }}>A4 / Thermal</Text>
      </View>
      <TouchableOpacity style={styles.primary}>
        <Text style={{ color: "#fff", fontWeight: "700" }}>Test Print</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { padding: 16, backgroundColor: "#F3F7FF", flex: 1 },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    elevation: 2,
  },
  label: { marginTop: 8, color: "#666" },
  primary: {
    backgroundColor: "#1A82FF",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
  },
});
