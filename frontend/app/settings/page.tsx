import ProtectedRoute from "@/components/ProtectedRoute";

export default function SettingsPage() {
  return (
    <ProtectedRoute allow={["admin"]}>
      <div>Settings (Admin only)</div>
    </ProtectedRoute>
  );
}
