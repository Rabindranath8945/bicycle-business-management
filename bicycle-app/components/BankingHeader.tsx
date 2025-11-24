// components/BankingHeader.tsx
import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { SidebarContext } from "../context/SidebarContext";
import { bankingTheme } from "../theme/banking";

/*
  Using uploaded local files (paths from your session).
  If you prefer require() (recommended for production bundling) replace:
  const LOGO_URI = { uri: "file:///mnt/data/logoNew.jpg" }
  with: const LOGO = require("../assets/logoNew.jpg");
*/
const LOGO_URI = { uri: "file:///mnt/data/logoNew.jpg" };
const AVATAR_URI = { uri: "file:///mnt/data/avatar_profile.jpg" };

export default function BankingHeader({ hideSales = false }) {
  const { toggleSidebar } = useContext(SidebarContext);

  return (
    <LinearGradient
      colors={[
        bankingTheme.colors.gradientFrom,
        bankingTheme.colors.gradientTo,
      ]}
      style={styles.header}
    >
      <View style={styles.topRow}>
        {/* left: menu toggle */}
        <TouchableOpacity style={styles.menuBtn} onPress={toggleSidebar}>
          <Ionicons name="menu" size={24} color="#fff" />
        </TouchableOpacity>

        {/* center: logo + title */}
        <View style={styles.brandWrap}>
          <Image source={LOGO_URI} style={styles.logo} resizeMode="cover" />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.title}>Mandal Cycle Store</Text>
            <Text style={styles.subtitle}>Sales Overview</Text>
          </View>
        </View>

        {/* right: notifications + avatar */}
        <View style={styles.rightWrap}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="notifications-outline" size={20} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.avatarBtn}>
            <Image source={AVATAR_URI} style={styles.avatar} />
          </TouchableOpacity>
        </View>
      </View>

      {/* sales card */}
      {!hideSales && (
        <View style={styles.salesBlock}>
          <Text style={styles.small}>Total Sales</Text>
          <Text style={styles.large}>₹ 40,900</Text>
          <Text style={styles.muted}>Today: ₹ 2,450 • +12%</Text>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: Platform.OS === "android" ? 28 : 48,
    paddingHorizontal: 18,
    paddingBottom: 18,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  menuBtn: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  brandWrap: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginLeft: 8,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },
  subtitle: {
    color: "rgba(234,241,255,0.9)",
    fontSize: 12,
    marginTop: 2,
  },
  rightWrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBtn: {
    marginRight: 8,
    padding: 8,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  avatarBtn: {},
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.22)",
  },

  salesBlock: {
    marginTop: 16,
    paddingBottom: 8,
    // bottom padding to create space before next section
  },
  small: {
    color: "rgba(234,241,255,0.95)",
    fontSize: 13,
  },
  large: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "900",
    marginTop: 6,
  },
  muted: {
    color: "rgba(221,231,255,0.95)",
    marginTop: 6,
  },
});
