// components/NotificationsPanel.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function NotificationsPanel() {
  return (
    <View style={styles.box}>
      <Ionicons name="notifications" size={28} color="#3b82f6" />

      <Text style={styles.title}>Notifications</Text>

      <View style={styles.item}>
        <Ionicons name="checkmark-circle" size={22} color="#16a34a" />
        <Text style={styles.msg}>New sale recorded successfully.</Text>
      </View>

      <View style={styles.item}>
        <Ionicons name="alert-circle" size={22} color="#f59e0b" />
        <Text style={styles.msg}>Low stock warning for Hero Cycle 26”.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    elevation: 4,
  },
  title: {
    fontWeight: "700",
    fontSize: 16,
    marginTop: 6,
    marginBottom: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  msg: {
    marginLeft: 10,
    fontSize: 13,
  },
});
