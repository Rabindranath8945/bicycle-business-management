import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { IoniconName } from "../types/IoniconName";
import { SIDEBAR_WIDTH } from "../constants/layout";

interface SubMenu {
  title: string;
  icon: IoniconName;
}

interface MenuItem {
  title: string;
  icon: IoniconName;
  children?: SubMenu[];
}

interface SidebarProps {
  closeSidebar: () => void;
}

// const logoUri = require("../assets/logoNew.jpg");

const menu: MenuItem[] = [
  { title: "Home", icon: "home-outline" },
  {
    title: "Products",
    icon: "pricetags-outline",
    children: [
      { title: "Add Product", icon: "add-circle-outline" },
      { title: "Product List", icon: "list-outline" },
      { title: "Categories", icon: "grid-outline" },
    ],
  },
  {
    title: "Sales",
    icon: "cart-outline",
    children: [
      { title: "New Sale", icon: "add-circle-outline" },
      { title: "Sales History", icon: "receipt-outline" },
      { title: "Sale Returns", icon: "refresh-circle-outline" },
    ],
  },
  {
    title: "Purchase",
    icon: "bag-handle-outline",
    children: [
      { title: "New Purchase", icon: "add-circle-outline" },
      { title: "Purchase List", icon: "list-outline" },
      { title: "Vendors", icon: "people-circle-outline" },
    ],
  },
  {
    title: "Stock",
    icon: "cube-outline",
    children: [
      { title: "Stock Report", icon: "document-text-outline" },
      { title: "Low Stock", icon: "alert-circle-outline" },
    ],
  },
  {
    title: "Accounting",
    icon: "newspaper-outline",
    children: [
      { title: "Ledger", icon: "book-outline" },
      { title: "Cashbook", icon: "cash-outline" },
      { title: "Daybook", icon: "calendar-outline" },
      { title: "Expenses", icon: "wallet-outline" },
    ],
  },
  {
    title: "Reports",
    icon: "bar-chart-outline",
    children: [
      { title: "Sales Report", icon: "trending-up-outline" },
      { title: "Purchase Report", icon: "trending-down-outline" },
      { title: "Profit & Loss", icon: "pie-chart-outline" },
    ],
  },
  {
    title: "Settings",
    icon: "settings-outline",
    children: [
      { title: "Business Profile", icon: "person-circle-outline" },
      { title: "Tax Settings", icon: "calculator-outline" },
      { title: "Print Settings", icon: "print-outline" },
      { title: "Backup & Restore", icon: "cloud-upload-outline" },
    ],
  },
];

export default function Sidebar({ closeSidebar }: SidebarProps) {
  return (
    <View style={styles.sidebar}>
      {/* Close */}
      <TouchableOpacity style={styles.closeBtn} onPress={closeSidebar}>
        <Ionicons name="close" size={28} color="#111" />
      </TouchableOpacity>
      {/* Header */}

      <View style={styles.header}>
        <View style={styles.logoBox}>
          <Text style={styles.logoText}>MC</Text>
        </View>

        <View>
          <Text style={styles.brandName}>Mandal Cycles</Text>
          <Text style={styles.brandEmail}>hello@mandalcycles.com</Text>
        </View>
      </View>
      {/* Menu */}
      <ScrollView
        style={styles.menuWrap}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        {menu.map((item, i) => (
          <View key={i} style={{ marginBottom: 14 }}>
            <TouchableOpacity style={styles.menuHeader}>
              <Ionicons name={item.icon} size={20} color="#111" />
              <Text style={styles.menuTitle}>{item.title}</Text>
            </TouchableOpacity>

            {item.children?.map((sub, j) => (
              <TouchableOpacity key={j} style={styles.subItem}>
                <Ionicons name={sub.icon} size={18} color="#666" />
                <Text style={styles.subTitle}>{sub.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: SIDEBAR_WIDTH,
    height: "100%",
    backgroundColor: "#fff",
    paddingTop: 44,
  },
  closeBtn: {
    position: "absolute",
    top: 18,
    right: 18,
    zIndex: 40,
    padding: 6,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingTop: 24,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: "rgba(0,0,0,0.03)",
  },
  brandName: { fontSize: 18, fontWeight: "700", color: "#111" },
  brandEmail: { fontSize: 12, color: "#777" },
  menuWrap: { paddingHorizontal: 12, paddingTop: 6 },
  menuHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  menuTitle: { marginLeft: 10, fontSize: 16, fontWeight: "600", color: "#111" },
  subItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 34,
    paddingVertical: 6,
  },
  subTitle: { marginLeft: 10, fontSize: 14, color: "#555" },
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
