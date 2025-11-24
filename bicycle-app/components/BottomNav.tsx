import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { bankingTheme } from "../theme/banking";
import { IoniconName } from "../types/IoniconName";

// const AVATAR = require("../assets/avatar_profile.jpg");

interface TabItemProps {
  icon: IoniconName;
  label: string;
}

function Tab({ icon, label }: TabItemProps) {
  return (
    <TouchableOpacity style={styles.tab}>
      <Ionicons name={icon} size={22} color="#444" />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function BottomNav() {
  return (
    <View style={styles.nav}>
      <Tab icon="home-outline" label="Home" />
      <Tab icon="cube-outline" label="Products" />
      <Tab icon="cart-outline" label="Sales" />
      <Tab icon="bag-handle-outline" label="Purchase" />

      <TouchableOpacity style={styles.avatarTab}>
        <Ionicons name="person" size={20} color="#fff" />
        <Text style={styles.label}>Me</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    height: 70,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  tab: {
    alignItems: "center",
  },
  label: {
    fontSize: 11,
    marginTop: 4,
  },
  avatarTab: {
    alignItems: "center",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: bankingTheme.colors.primary,
  },
  avatarCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#4C5CEB",
    alignItems: "center",
    justifyContent: "center",
  },
});
