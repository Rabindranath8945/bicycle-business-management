// app/settings/backup.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";

export default function BackupSettings() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Backup & Restore</Text>
      <View style={styles.card}>
        <Text style={{ color: "#666" }}>Last backup: Nov 20, 2025</Text>
      </View>
      <TouchableOpacity
        style={styles.primary}
        onPress={() => Alert.alert("Backup", "Backup started (stub)")}
      >
        <Text style={{ color: "#fff", fontWeight: "700" }}>Backup Now</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.primary,
          { marginTop: 10, backgroundColor: "#fff", borderWidth: 1 },
        ]}
        onPress={() => Alert.alert("Restore", "Restore started (stub)")}
      >
        <Text style={{ color: "#1A82FF", fontWeight: "700" }}>Restore</Text>
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
  primary: {
    backgroundColor: "#1A82FF",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
  },
});
