// app/_layout.tsx
import React from "react";
import { Slot } from "expo-router";
import AppShell from "../components/AppShell";
export default function RootLayout() {
  return (
    <AppShell>
      <Slot />
    </AppShell>
  );
}
