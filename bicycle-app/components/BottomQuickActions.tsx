// components/BottomQuickActions.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme, Surface } from "react-native-paper";
import { router } from "expo-router";

type BottomQuickActionsProps = {
  visible: boolean;
  onClose: () => void;
};

export default function BottomQuickActions({
  visible,
  onClose,
}: BottomQuickActionsProps) {
  const theme = useTheme();

  if (!visible) return null;

  return (
    <View style={styles.overlay} onTouchEnd={onClose}>
      <Surface
        style={[styles.sheet, { backgroundColor: theme.colors.surface }]}
      >
        <Text style={[styles.title, { color: theme.colors.onSurface }]}>
          Quick Actions
        </Text>

        <View style={styles.row}>
          <ActionBtn
            icon="add"
            text="Add Sale"
            color={theme.colors.primary}
            onPress={() => {
              onClose();
              router.push("/sales/new");
            }}
          />

          <ActionBtn
            icon="bicycle"
            text="Add Product"
            color={theme.colors.secondary}
            onPress={() => {
              onClose();
              router.push("/products/new");
            }}
          />

          <ActionBtn
            icon="grid"
            text="Categories"
            color="#64748b"
            onPress={() => {
              onClose();
              router.push("/categories");
            }}
          />
        </View>
      </Surface>
    </View>
  );
}

const ActionBtn = ({
  icon,
  text,
  color,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
  color: string;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.actionBtn} onPress={onPress}>
    <View style={[styles.iconWrap, { backgroundColor: color }]}>
      <Ionicons name={icon} size={20} color="#fff" />
    </View>
    <Text style={styles.actionText}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  sheet: {
    padding: 20,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    ...Platform.select({
      android: { elevation: 8 },
      ios: { shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 14 },
    }),
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionBtn: {
    flex: 1,
    alignItems: "center",
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  actionText: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "600",
  },
});
