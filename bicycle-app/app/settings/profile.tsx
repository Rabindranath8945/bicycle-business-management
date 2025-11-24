// app/settings/profile.tsx
import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function ProfileSettings() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Business Profile</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Business Name</Text>
        <TextInput style={styles.input} placeholder="Mandal Cycles" />
        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} placeholder="hello@mandalcycles.com" />
        <Text style={styles.label}>Phone</Text>
        <TextInput style={styles.input} placeholder="9876543210" />
      </View>
      <TouchableOpacity style={styles.primary}>
        <Text style={{ color: "#fff", fontWeight: "700" }}>Save</Text>
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
  input: {
    borderWidth: 1,
    borderColor: "#EEF3FF",
    padding: 10,
    borderRadius: 8,
    marginTop: 6,
  },
  primary: {
    backgroundColor: "#1A82FF",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
  },
});
