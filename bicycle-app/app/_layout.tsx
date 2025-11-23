// app/_layout.tsx
import "react-native-gesture-handler"; // must be first
import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { materialLightViolet } from "../theme/material";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Slot } from "expo-router"; // if using expo-router
import { MD3LightTheme as DefaultTheme } from "react-native-paper";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#7c3aed", // violet accent
    secondary: "#a78bfa",
    background: "#f8fafc",
    surface: "#ffffff",
    onSurface: "#0f172a",
    error: "#ef4444",
  },
};

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <Slot />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
