import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { bankingTheme } from "../theme/banking";
import { IoniconName } from "../types/IoniconName";

interface ActionItem {
  label: string;
  icon: IoniconName;
}

const actions: ActionItem[] = [
  { label: "Products", icon: "cube-outline" },
  { label: "Sales", icon: "receipt-outline" },
  { label: "Purchase", icon: "bag-handle-outline" },
  { label: "Customers", icon: "people-outline" },
];

export default function QuickActions() {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>Quick Actions</Text>

      <View style={styles.row}>
        {actions.map((a, i) => (
          <TouchableOpacity key={i} style={styles.box}>
            <View style={styles.iconWrap}>
              <Ionicons
                name={a.icon}
                size={22}
                color={bankingTheme.colors.primary}
              />
            </View>
            <Text style={styles.label}>{a.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: bankingTheme.colors.textPrimary,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  box: {
    width: "23%",
    backgroundColor: "#fff",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    elevation: 3,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#E9F2FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  label: {
    fontSize: 12,
    color: bankingTheme.colors.textPrimary,
  },
});
