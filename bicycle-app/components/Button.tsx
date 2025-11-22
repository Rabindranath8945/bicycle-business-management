// components/Button.tsx
import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from "react-native";

export default function Button({
  title,
  onPress,
  style,
  disabled,
}: {
  title: string;
  onPress?: () => void;
  style?: ViewStyle;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.btn, style, disabled ? styles.disabled : null]}
      disabled={disabled}
    >
      <Text style={styles.txt}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: "#16a34a",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  txt: { color: "#fff", fontWeight: "700" },
  disabled: { opacity: 0.6 },
});
