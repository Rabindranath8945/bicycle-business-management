// components/BankingHeader.tsx
import React, { useContext } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { SidebarContext } from "../context/SidebarContext";
import { bankingTheme } from "../theme/banking";

// Your logo + avatar
// const LOGO = require("../assets/logoNew.jpg");
// const AVATAR = require("../assets/avatar_profile.jpg");

export default function BankingHeader() {
  const { toggleSidebar } = useContext(SidebarContext);

  return (
    <LinearGradient
      colors={[
        bankingTheme.colors.gradientFrom,
        bankingTheme.colors.gradientTo,
      ]}
      style={styles.header}
    >
      {/* TOP ROW */}
      <View style={styles.topRow}>
        {/* Logo */}
        <View style={styles.logoBox}>
          <Text style={styles.logoText}>MC</Text>
        </View>

        {/* Title */}
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Mandal Cycle Store</Text>
          <Text style={styles.subtitle}>Sales Overview</Text>
        </View>

        {/* Notification */}
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="notifications-outline" size={22} color="#fff" />
        </TouchableOpacity>

        {/* Menu Toggle */}
        <TouchableOpacity style={styles.menuBtn} onPress={toggleSidebar}>
          <Ionicons name="menu" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* SALES CARD */}
      <View style={styles.salesBlock}>
        <Text style={styles.small}>Total Sales</Text>
        <Text style={styles.large}>₹ 40,900</Text>
        <Text style={styles.muted}>Today: ₹ 2,450 • +12%</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 250,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 50,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  logo: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },

  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  subtitle: {
    color: "#EAF1FF",
    fontSize: 12,
  },

  iconBtn: {
    backgroundColor: "rgba(255,255,255,0.22)",
    padding: 8,
    borderRadius: 10,
    marginRight: 10,
  },

  menuBtn: {
    backgroundColor: "rgba(255,255,255,0.25)",
    padding: 10,
    borderRadius: 12,
  },

  salesBlock: {
    marginTop: 25,
    paddingBottom: 25, // EXTRA padding as required
  },

  small: { color: "#EAF1FF", fontSize: 14 },
  large: { color: "#fff", fontSize: 36, fontWeight: "700" },
  muted: { color: "#DDE7FF", marginTop: 6 },
  logoBox: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: "#eef2ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  logoText: {
    color: "#4C5CEB",
    fontSize: 18,
    fontWeight: "800",
  },
});
