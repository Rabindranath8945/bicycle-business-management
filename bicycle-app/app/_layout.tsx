// app/_layout.tsx
import { Stack } from "expo-router/build";
import AppShell from "../components/AppShell";

export default function RootLayout() {
  return (
    <AppShell>
      <Stack screenOptions={{ headerShown: false }} />
    </AppShell>
  );
}
