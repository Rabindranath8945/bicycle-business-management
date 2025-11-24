// app/index.tsx
import React from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Platform,
} from "react-native";
import BankingHeader from "../components/BankingHeader";
import NotificationsPanel from "../components/NotificationsPanel";
import QuickActions from "../components/QuickActions";
import DashboardExtra from "../components/DashboardExtra";
import BottomNav from "../components/BottomNav";
import { bankingTheme } from "../theme/banking";

export default function Dashboard() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <BankingHeader />

          {/* Notifications Panel - placed right below header */}
          <NotificationsPanel />

          {/* Quick Actions */}
          <QuickActions />

          {/* Insights / Extra Cards */}
          <DashboardExtra />

          {/* Some extra spacing so BottomNav doesn't overlap content */}
          <View style={{ height: 96 }} />
        </ScrollView>

        {/* Fixed Bottom Navigation */}
        <BottomNav />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: bankingTheme.colors.background,
    paddingTop: Platform.OS === "android" ? 24 : 0,
  },
  container: {
    flex: 1,
    backgroundColor: bankingTheme.colors.background,
  },
  scrollContent: {
    paddingBottom: 20,
    backgroundColor: bankingTheme.colors.background,
  },
});
