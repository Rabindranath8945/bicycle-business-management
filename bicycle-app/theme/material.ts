// theme/material.ts
import { MD3LightTheme } from "react-native-paper";

export const materialLightViolet = {
  ...MD3LightTheme,
  roundness: 12,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#7c3aed", // violet
    onPrimary: "#ffffff",
    secondary: "#c4b5fd",
    surface: "#ffffff",
    background: "#faf8ff",
    onSurface: "#1f1144",
    error: "#ef4444",
    outline: "rgba(15, 23, 42, 0.08)",
  },
  fonts: {
    ...MD3LightTheme.fonts,
  },
  // Add any design tokens you want globally:
  elevation: {
    level0: "transparent",
    level1: "rgba(12,20,35,0.04)",
    level2: "rgba(12,20,35,0.08)",
  },
};
