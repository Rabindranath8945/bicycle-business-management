// app/account.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Link from "expo-router/link";

export default function Account() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Account</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Business</Text>
        <Text style={{ color: "#666" }}>Mandal Cycles</Text>
        <Text style={{ color: "#666" }}>hello@mandalcycles.com</Text>
      </View>

      <View style={styles.row}>
        <Link href="/settings/profile">
          <Text style={styles.link}>Business Profile</Text>
        </Link>
        <Link href="/settings/tax">
          <Text style={styles.link}>Tax Settings</Text>
        </Link>
        <Link href="/settings/print">
          <Text style={styles.link}>Print Settings</Text>
        </Link>
        <Link href="/settings/backup">
          <Text style={styles.link}>Backup & Restore</Text>
        </Link>
      </View>

      <TouchableOpacity style={styles.primary}>
        <Text style={{ color: "#fff", fontWeight: "700" }}>Logout</Text>
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
  cardTitle: { fontWeight: "700", marginBottom: 6 },
  row: { marginTop: 8 },
  link: { color: "#1A82FF", marginVertical: 8, fontSize: 16 },
  primary: {
    backgroundColor: "#1A82FF",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 16,
  },
});
