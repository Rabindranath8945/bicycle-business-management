import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { useUser } from "../store/useUser";
import { useEffect, useState } from "react";
import { useDashboardApi } from "../hooks/useApi";
import { BlurView } from "expo-blur";
import { router } from "expo-router";

type RecentSale = {
  invoiceNo: string;
  total: number;
};

type DashboardStats = {
  productCount: number;
  salesToday: number;
  categoryCount: number;
  lowStockCount: number;
  recentSales: RecentSale[];
};

type GlassCardProps = {
  title: string;
  value: string | number;
  delay?: number;
};

type ActionButtonProps = {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
  onPress: () => void;
};

export default function Dashboard() {
  const user = useUser((s) => s.user);
  const { getDashboardStats } = useDashboardApi();

  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    productCount: 0,
    salesToday: 0,
    categoryCount: 0,
    lowStockCount: 0,
    recentSales: [],
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getDashboardStats();
      setStats(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={loadData} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Welcome, {user?.name || "User"} 👋</Text>
      </View>

      {/* Summary Cards */}
      <View style={styles.row}>
        <GlassCard title="Products" value={stats.productCount} delay={100} />
        <GlassCard
          title="Sales Today"
          value={`₹ ${stats.salesToday}`}
          delay={200}
        />
      </View>

      <View style={styles.row}>
        <GlassCard title="Categories" value={stats.categoryCount} delay={300} />
        <GlassCard title="Low Stock" value={stats.lowStockCount} delay={400} />
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>

      <View style={styles.actions}>
        <ActionButton
          icon="add-circle"
          text="Add Sale"
          onPress={() => router.push("/sales/new")}
        />
        <ActionButton
          icon="add"
          text="Add Product"
          onPress={() => router.push("/products/new")}
        />
        <ActionButton
          icon="grid-outline"
          text="Add Category"
          onPress={() => router.push("/products/new")}
        />
      </View>

      {/* Recent Sales */}
      <Text style={styles.sectionTitle}>Recent Sales</Text>

      {stats.recentSales.map((sale, i) => (
        <BlurView intensity={40} tint="light" style={styles.saleItem} key={i}>
          <Text style={styles.saleText}>Invoice #{sale.invoiceNo}</Text>
          <Text style={styles.saleAmount}>₹ {sale.total}</Text>
        </BlurView>
      ))}
    </ScrollView>
  );
}

// Glass UI card component
const GlassCard = ({ title, value, delay }: GlassCardProps) => (
  <Animatable.View animation="fadeInUp" delay={delay} style={styles.cardWrap}>
    <BlurView intensity={50} tint="light" style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardValue}>{value}</Text>
    </BlurView>
  </Animatable.View>
);

// Action button component
const ActionButton = ({ icon, text, onPress }: ActionButtonProps) => (
  <TouchableOpacity style={styles.actionBtn} onPress={onPress}>
    <Ionicons name={icon} size={30} color="#007aff" />
    <Text style={styles.actionText}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fb",
    padding: 16,
  },

  header: {
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#222",
  },

  subtitle: {
    fontSize: 16,
    color: "#777",
    marginTop: 4,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  cardWrap: {
    width: "48%",
  },

  card: {
    padding: 20,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderColor: "rgba(255, 255, 255, 0.4)",
    borderWidth: 1,
  },

  cardTitle: {
    color: "#555",
    fontSize: 14,
    marginBottom: 10,
  },

  cardValue: {
    color: "#222",
    fontSize: 24,
    fontWeight: "700",
  },

  sectionTitle: {
    color: "#222",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  actionBtn: {
    width: "31%",
    backgroundColor: "#fff",
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    elevation: 2,
  },

  actionText: {
    color: "#333",
    marginTop: 6,
    fontSize: 13,
    fontWeight: "500",
  },

  saleItem: {
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    backgroundColor: "rgba(255,255,255,0.5)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
  },

  saleText: {
    color: "#333",
    fontSize: 16,
  },

  saleAmount: {
    color: "#007aff",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 4,
  },
});
