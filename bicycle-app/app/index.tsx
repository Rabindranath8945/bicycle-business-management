import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { AuthContext } from "../context/AuthContext";

// Icons (Expo Vector Icons)
import { Ionicons } from "@expo/vector-icons";

export default function Dashboard() {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Hello,</Text>
          <Text style={styles.username}>{user?.name || "User"} 👋</Text>
        </View>

        <View style={styles.avatar}>
          <Ionicons name="person" size={24} color="#fff" />
        </View>
      </View>

      {/* STATS */}
      <View style={styles.row}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Today Sales</Text>
          <Text style={styles.statValue}>₹12,540</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Items Sold</Text>
          <Text style={styles.statValue}>48</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Avg Bill</Text>
          <Text style={styles.statValue}>₹261</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Profit</Text>
          <Text style={styles.statValue}>₹3,850</Text>
        </View>
      </View>

      {/* QUICK ACTIONS */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>

      <View style={styles.actionGrid}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push("/sales/new")}
        >
          <Ionicons name="cart" size={28} color="#16a34a" />
          <Text style={styles.actionLabel}>New Sale</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push("/products")}
        >
          <Ionicons name="cube" size={28} color="#16a34a" />
          <Text style={styles.actionLabel}>Products</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push("/sales/index")}
        >
          <Ionicons name="receipt" size={28} color="#16a34a" />
          <Text style={styles.actionLabel}>History</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push("/customers/index")}
        >
          <Ionicons name="people" size={28} color="#16a34a" />
          <Text style={styles.actionLabel}>Customers</Text>
        </TouchableOpacity>
      </View>

      {/* RECENT SALES */}
      <Text style={styles.sectionTitle}>Recent Sales</Text>

      {[1, 2, 3, 4].map((i) => (
        <TouchableOpacity key={i} style={styles.saleRow}>
          <Ionicons name="document-text" size={22} color="#475569" />
          <View style={{ flex: 1 }}>
            <Text style={styles.saleItem}>Invoice #{1000 + i}</Text>
            <Text style={styles.saleSub}>Today • ₹450</Text>
          </View>
        </TouchableOpacity>
      ))}

      {/* FLOATING BUTTON */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/sales/new")}
      >
        <Ionicons name="add" size={34} color="#fff" />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8fafc" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },

  welcome: { fontSize: 16, color: "#64748b" },
  username: { fontSize: 22, fontWeight: "700" },

  avatar: {
    backgroundColor: "#16a34a",
    width: 42,
    height: 42,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  statCard: {
    width: "48%",
    padding: 18,
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },

  statLabel: { color: "#64748b", fontSize: 12 },
  statValue: { fontSize: 20, fontWeight: "700", marginTop: 4 },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 22,
    marginBottom: 12,
  },

  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
  },

  actionBtn: {
    width: "45%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },

  actionLabel: { marginTop: 8, fontWeight: "600", color: "#1e293b" },

  saleRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    alignItems: "center",
    gap: 12,
  },

  saleItem: { fontWeight: "600", fontSize: 14 },
  saleSub: { color: "#64748b", fontSize: 12 },

  fab: {
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor: "#16a34a",
    position: "absolute",
    bottom: 40,
    right: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
});
