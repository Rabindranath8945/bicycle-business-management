// app/index.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
  Dimensions,
  Alert,
} from "react-native";
import { useTheme, Surface, FAB } from "react-native-paper";
import * as Animatable from "react-native-animatable";
import { LineChart } from "react-native-chart-kit";
import { Swipeable } from "react-native-gesture-handler";
import { BlurView } from "expo-blur";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import BottomQuickActions from "../components/BottomQuickActions";

// ----- Replace with your uploaded local path (dev environment) -----
const APP_LOGO = require("../assets/logo.png");

// ----- constants -----
const { width } = Dimensions.get("window");
const CHART_WIDTH = Math.min(width - 48, 800);

type RecentSale = {
  _id?: string;
  invoiceNo: string;
  total: number;
  createdAt?: string;
};
type ProductItem = { _id?: string; name: string; qtySold?: number; img?: any };

export default function Dashboard() {
  const theme = useTheme();
  const [loading, setLoading] = useState<boolean>(true);
  const [sheetOpen, setSheetOpen] = useState(false);

  // demo data - replace with your API calls (useDashboardApi)
  const [stats, setStats] = useState({
    productCount: 0,
    salesToday: 0,
    categoryCount: 0,
    lowStockCount: 0,
    recentSales: [] as RecentSale[],
    topProducts: [] as ProductItem[],
  });

  // simulate loading / fetch
  useEffect(() => {
    let t = setTimeout(() => {
      // set demo real data
      setStats({
        productCount: 354,
        salesToday: 14250,
        categoryCount: 18,
        lowStockCount: 6,
        recentSales: [
          {
            _id: "1",
            invoiceNo: "INV-1002",
            total: 250,
            createdAt: new Date().toISOString(),
          },
          {
            _id: "2",
            invoiceNo: "INV-1001",
            total: 799,
            createdAt: new Date().toISOString(),
          },
          {
            _id: "3",
            invoiceNo: "INV-1000",
            total: 120,
            createdAt: new Date().toISOString(),
          },
        ],
        topProducts: [
          { _id: "p1", name: "Road Tube 26", qtySold: 45, img: APP_LOGO },
          { _id: "p2", name: "Chain Lubricant", qtySold: 32, img: APP_LOGO },
          { _id: "p3", name: "Brake Pads", qtySold: 28, img: APP_LOGO },
        ],
      });
      setLoading(false);
    }, 950);
    return () => clearTimeout(t);
  }, []);

  // chart derived from recent sales (7 days)
  const chart = useMemo(() => {
    // produce sample 7-day sales or derive from API
    const labels = ["M", "T", "W", "T", "F", "S", "S"];
    const data = [300, 1200, 900, 1700, 800, 1400, 1200];
    return { labels, data };
  }, [stats.recentSales]);

  // Swipe actions
  const handleDelete = (sale: RecentSale) => {
    Alert.alert("Delete", `Delete invoice ${sale.invoiceNo}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setStats((s) => ({
            ...s,
            recentSales: s.recentSales.filter(
              (r) => r.invoiceNo !== sale.invoiceNo
            ),
          }));
        },
      },
    ]);
  };

  const handleRefund = (sale: RecentSale) => {
    Alert.alert("Refund", `Refund invoice ${sale.invoiceNo}?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Refund", onPress: () => console.log("refund", sale) },
    ]);
  };

  const renderRightActions = (sale: RecentSale) => (
    <View style={styles.rightActionWrap}>
      <TouchableOpacity
        style={[styles.rightActionBtn, { backgroundColor: theme.colors.error }]}
        onPress={() => handleDelete(sale)}
      >
        <Text style={styles.rightActionText}>Delete</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.rightActionBtn,
          { backgroundColor: theme.colors.primary },
        ]}
        onPress={() => handleRefund(sale)}
      >
        <Text style={styles.rightActionText}>Refund</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <BlurView intensity={60} tint="light" style={styles.logoWrap}>
              <Image source={APP_LOGO} style={styles.logo} />
            </BlurView>
            <View>
              <Text
                style={[styles.headerTitle, { color: theme.colors.onSurface }]}
              >
                Dashboard
              </Text>
              <Text
                style={[styles.headerSub, { color: theme.colors.onSurface }]}
              >
                Welcome back — here's your business at a glance
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/account")}
            style={styles.profileBtn}
          >
            <Ionicons
              name="notifications-outline"
              size={22}
              color={theme.colors.onSurface}
            />
          </TouchableOpacity>
        </View>

        {/* Top metrics (animated & glass) */}
        <View style={styles.metricsRow}>
          <GlassMetricCard
            title="Products"
            value={stats.productCount}
            loading={loading}
            hint="Total SKUs"
          />
          <GlassMetricCard
            title="Sales Today"
            value={`₹ ${stats.salesToday}`}
            loading={loading}
            hint="Today"
            accent
          />
          <GlassMetricCard
            title="Categories"
            value={stats.categoryCount}
            loading={loading}
            hint="Active"
          />
          <GlassMetricCard
            title="Low Stock"
            value={stats.lowStockCount}
            loading={loading}
            hint="Reorder"
            danger
          />
        </View>

        {/* Quick actions */}
        <View style={styles.sectionHeader}>
          <Text
            style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
          >
            Quick Actions
          </Text>
        </View>
        <View style={styles.quickActionsRow}>
          <TouchableOpacity
            style={[styles.quickBtn, { backgroundColor: theme.colors.primary }]}
            onPress={() => router.push("/sales/new")}
          >
            <Ionicons name="add" size={18} color="#fff" />
            <Text style={styles.quickText}>Add Sale</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.quickBtn,
              { backgroundColor: theme.colors.secondary },
            ]}
            onPress={() => router.push("/products/new")}
          >
            <Ionicons name="pricetag" size={18} color="#fff" />
            <Text style={styles.quickText}>Add Product</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickBtn, { backgroundColor: "#64748b" }]}
            onPress={() => router.push("/purchases/new")}
          >
            <Ionicons name="cart" size={18} color="#fff" />
            <Text style={styles.quickText}>Add Purchase</Text>
          </TouchableOpacity>
        </View>

        {/* Monthly Overview (gradient chart in glass card) */}
        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
          >
            Monthly overview
          </Text>
          <BlurView
            intensity={50}
            tint="light"
            style={[
              styles.chartCard,
              Platform.OS === "web"
                ? { boxShadow: "0 10px 30px rgba(12,20,35,0.06)" }
                : { elevation: 3 },
            ]}
          >
            {loading ? (
              <SkeletonChart />
            ) : (
              <LineChart
                data={{
                  labels: chart.labels,
                  datasets: [{ data: chart.data }],
                }}
                width={CHART_WIDTH}
                height={200}
                yAxisLabel="₹"
                withInnerLines={false}
                withOuterLines={false}
                chartConfig={{
                  backgroundGradientFrom: "#faf5ff",
                  backgroundGradientTo: "#ffffff",
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(124,58,237, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(31,17,68, ${opacity})`,
                  propsForDots: { r: "4", strokeWidth: "0", stroke: "#7c3aed" },
                }}
                bezier
                style={{ borderRadius: 12 }}
              />
            )}
          </BlurView>
        </View>

        {/* Top Selling Carousel */}
        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
          >
            Top selling products
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.carousel}
          >
            {loading
              ? [1, 2, 3].map((i) => <SkeletonProduct key={i} />)
              : stats.topProducts.map((p) => (
                  <Animatable.View
                    key={p._id}
                    animation="fadeInRight"
                    style={styles.productCardWrap}
                  >
                    <BlurView
                      intensity={60}
                      tint="light"
                      style={styles.productCard}
                    >
                      <Image source={p.img} style={styles.productImg} />
                      <Text numberOfLines={1} style={styles.productName}>
                        {p.name}
                      </Text>
                      <View style={styles.productBadge}>
                        <Text style={styles.productBadgeText}>
                          {p.qtySold} sold
                        </Text>
                      </View>
                    </BlurView>
                  </Animatable.View>
                ))}
          </ScrollView>
        </View>

        {/* Recent Sales (swipeable) */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text
              style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
            >
              Recent Sales
            </Text>
            <TouchableOpacity onPress={() => router.push("/sales")}>
              <Text style={[styles.viewAll, { color: theme.colors.primary }]}>
                View all
              </Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            [1, 2, 3].map((i) => <SkeletonSale key={i} />)
          ) : stats.recentSales.length === 0 ? (
            <Surface
              style={[
                styles.emptySurface,
                { backgroundColor: theme.colors.surface },
              ]}
            >
              <Text style={{ color: theme.colors.onSurface }}>
                No recent sales
              </Text>
            </Surface>
          ) : (
            stats.recentSales.map((s) => (
              <Swipeable
                key={s._id || s.invoiceNo}
                renderRightActions={() => renderRightActions(s)}
              >
                <Animatable.View
                  animation="fadeInUp"
                  style={[
                    styles.saleRow,
                    { backgroundColor: theme.colors.surface },
                  ]}
                >
                  <View>
                    <Text
                      style={[
                        styles.invoiceText,
                        { color: theme.colors.onSurface },
                      ]}
                    >
                      #{s.invoiceNo}
                    </Text>
                    <Text style={[styles.dateText, { color: "#6b7280" }]}>
                      {s.createdAt
                        ? new Date(s.createdAt).toLocaleString()
                        : ""}
                    </Text>
                  </View>
                  <Text
                    style={[styles.saleAmount, { color: theme.colors.primary }]}
                  >
                    ₹ {s.total}
                  </Text>
                </Animatable.View>
              </Swipeable>
            ))
          )}
        </View>

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* Floating FAB */}
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => setSheetOpen(true)}
      />
      <BottomQuickActions
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />
    </SafeAreaView>
  );
}

/* -------------------------
   Helper components
   ------------------------- */

function GlassMetricCard({
  title,
  value,
  hint,
  loading = false,
  accent = false,
  danger = false,
}: {
  title: string;
  value?: string | number;
  hint?: string;
  loading?: boolean;
  accent?: boolean;
  danger?: boolean;
}) {
  const theme = useTheme();
  const bg = theme.colors.surface;
  const accentBg = accent
    ? theme.colors.primary
    : danger
    ? theme.colors.error
    : bg;

  return (
    <Animatable.View animation="fadeInUp" style={styles.metricWrap}>
      <BlurView
        intensity={50}
        tint="light"
        style={[
          styles.metricCard,
          Platform.OS === "web"
            ? { boxShadow: "0 8px 30px rgba(12,20,35,0.06)" }
            : { elevation: 4 },
        ]}
      >
        {loading ? (
          <Animatable.View
            animation="pulse"
            iterationCount="infinite"
            style={styles.metricSkeleton}
          />
        ) : (
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={[styles.metricTitle, { color: theme.colors.onSurface }]}
              >
                {title}
              </Text>
              {hint ? <Text style={styles.metricHint}>{hint}</Text> : null}
            </View>
            <Text
              style={[
                styles.metricValue,
                {
                  color:
                    accentBg === theme.colors.surface
                      ? theme.colors.onSurface
                      : "#fff",
                  backgroundColor:
                    accentBg === theme.colors.surface
                      ? "transparent"
                      : accentBg,
                  paddingHorizontal: accent || danger ? 10 : 0,
                  borderRadius: accent || danger ? 8 : 0,
                },
              ]}
            >
              {value ?? "-"}
            </Text>
          </View>
        )}
      </BlurView>
    </Animatable.View>
  );
}

function SkeletonChart() {
  return (
    <Animatable.View
      animation="pulse"
      iterationCount="infinite"
      style={{
        height: 200,
        borderRadius: 12,
        backgroundColor: "rgba(0,0,0,0.04)",
      }}
    />
  );
}

function SkeletonProduct() {
  return (
    <View style={styles.productCardWrap}>
      <Animatable.View
        animation="pulse"
        iterationCount="infinite"
        style={[
          styles.productCard,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Animatable.View
          style={{
            width: 56,
            height: 56,
            borderRadius: 8,
            backgroundColor: "rgba(0,0,0,0.06)",
          }}
        />
      </Animatable.View>
    </View>
  );
}

function SkeletonSale() {
  return (
    <Animatable.View
      animation="pulse"
      iterationCount="infinite"
      style={[styles.saleRow, { backgroundColor: "rgba(0,0,0,0.04)" }]}
    >
      <View
        style={{
          width: 180,
          height: 18,
          borderRadius: 6,
          backgroundColor: "rgba(0,0,0,0.06)",
        }}
      />
      <View
        style={{
          width: 72,
          height: 18,
          borderRadius: 6,
          backgroundColor: "rgba(0,0,0,0.06)",
        }}
      />
    </Animatable.View>
  );
}

/* -------------------------
   Styles
   ------------------------- */

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: 16, paddingBottom: 24 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  logoWrap: {
    width: 56,
    height: 56,
    borderRadius: 12,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: { width: 52, height: 52, borderRadius: 10 },
  headerTitle: { fontSize: 22, fontWeight: "800" },
  headerSub: { fontSize: 13 },
  profileBtn: { padding: 8, borderRadius: 10 },

  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
    flexWrap: "wrap",
  },
  metricWrap: { width: "48%", marginBottom: 12 },
  metricCard: {
    padding: 14,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.7)",
  },
  metricTitle: { fontSize: 12, fontWeight: "700" },
  metricHint: { fontSize: 11, color: "#94a3b8" },
  metricValue: { marginTop: 8, fontSize: 20, fontWeight: "900" },
  metricSkeleton: {
    height: 52,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.06)",
  },

  section: { marginTop: 8, marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: "800" },
  sectionHeader: { marginTop: 6 },
  quickActionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  quickBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    flexDirection: "row",
    gap: 8,
  },
  quickText: { color: "#fff", fontWeight: "700" },

  chartCard: {
    marginTop: 10,
    padding: 12,
    borderRadius: 12,
    overflow: "hidden",
  },

  carousel: { marginTop: 10, flexDirection: "row", gap: 12 },
  productCardWrap: { width: 140, marginRight: 12 },
  productCard: {
    padding: 12,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  productImg: { width: 64, height: 64, borderRadius: 10, marginBottom: 8 },
  productName: { fontSize: 13, fontWeight: "700", textAlign: "center" },
  productBadge: {
    marginTop: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.06)",
  },
  productBadgeText: { fontSize: 12 },

  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  viewAll: { fontWeight: "700" },

  saleRow: {
    marginTop: 10,
    padding: 14,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.04)",
  },
  invoiceText: { fontWeight: "800", fontSize: 14 },
  dateText: { fontSize: 12, color: "#6b7280" },
  saleAmount: { fontWeight: "900", fontSize: 14 },

  emptySurface: { padding: 14, borderRadius: 12, alignItems: "center" },

  rightActionWrap: {
    flexDirection: "row",
    width: 150,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  rightActionBtn: {
    width: 75,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  rightActionText: { color: "#fff", fontWeight: "800" },

  fab: { position: "absolute", right: 18, bottom: 20, zIndex: 20 },
});
