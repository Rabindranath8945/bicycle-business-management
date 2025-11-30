// components/BottomNav.tsx
import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link, usePathname } from "expo-router/build";
import { bankingTheme } from "../theme/banking";

export default function BottomNav() {
  const pathname = usePathname?.() ?? "/";

  const items = [
    { label: "Home", icon: "home-outline", href: "/" },
    { label: "Products", icon: "pricetags-outline", href: "/products" },
    { label: "Sales", icon: "cart-outline", href: "/sales/new" },
    { label: "Purchase", icon: "bag-handle-outline", href: "/purchase/new" },
  ];

  return (
    <View style={styles.nav}>
      {items.map((it) => {
        const active = pathname === it.href;
        return (
          <Link href={it.href} asChild key={it.href}>
            <TouchableOpacity style={styles.item}>
              <Ionicons
                name={it.icon}
                size={20}
                color={active ? bankingTheme.colors.primary : "#6B7280"}
              />
              <Text
                style={[
                  styles.label,
                  { color: active ? bankingTheme.colors.primary : "#6B7280" },
                ]}
              >
                {it.label}
              </Text>
            </TouchableOpacity>
          </Link>
        );
      })}

      <Link href="/account" asChild>
        <TouchableOpacity style={styles.item}>
          <View
            style={[
              styles.avatarCircle,
              { backgroundColor: bankingTheme.colors.primary },
            ]}
          >
            <Ionicons name="person" size={18} color="#fff" />
          </View>
          <Text style={styles.label}>Account</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    height: 68,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    zIndex: 999,
  },
  item: { alignItems: "center", justifyContent: "center" },
  label: { fontSize: 11, marginTop: 4 },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
});
