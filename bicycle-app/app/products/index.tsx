// app/products/index.tsx
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Alert,
} from "react-native";
import { Text, FAB, useTheme, Searchbar, IconButton } from "react-native-paper";
import ProductCard from "../../components/ProductCard";
import { useProductsApi, Product } from "../../hooks/useProductsApi";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
import { router } from "expo-router";

export default function ProductsListScreen() {
  const theme = useTheme();
  const { listProducts, deleteProduct } = useProductsApi();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(
    async (reset = false) => {
      try {
        if (reset) setPage(1);
        setLoading(true);
        const data = await listProducts(reset ? 1 : page, q);
        setProducts((prev) => (reset ? data.items : [...prev, ...data.items]));
      } catch (err) {
        console.error("list products err", err);
      } finally {
        setLoading(false);
      }
    },
    [listProducts, page, q]
  );

  useEffect(() => {
    load(true);
  }, [q]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load(true);
    setRefreshing(false);
  };

  const onDelete = (id?: string) => {
    if (!id) return;
    Alert.alert("Delete product", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteProduct(id);
            setProducts((p) => p.filter((x) => x._id !== id));
          } catch (err) {
            console.error(err);
          }
        },
      },
    ]);
  };

  const renderRight = (item: Product) => (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <IconButton
        icon="pencil"
        onPress={() => router.push(`/products/${item._id}`)}
      />
      <IconButton icon="delete" onPress={() => onDelete(item._id)} />
    </View>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Searchbar
          placeholder="Search products"
          value={q}
          onChangeText={setQ}
          style={styles.search}
        />

        <FlatList
          data={products}
          keyExtractor={(i) => i._id || Math.random().toString()}
          renderItem={({ item }) => (
            <Swipeable renderRightActions={() => renderRight(item)}>
              <ProductCard
                name={item.name}
                sku={item.sku}
                salePrice={item.salePrice}
                stock={item.stock}
                photo={item.photo}
                onPress={() => router.push(`/products/${item._id}`)}
                onEdit={() => router.push(`/products/${item._id}`)}
                onDelete={() => onDelete(item._id)}
              />
            </Swipeable>
          )}
          contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onEndReached={() => {
            setPage((p) => p + 1);
            load();
          }}
          onEndReachedThreshold={0.5}
        />

        <FAB
          icon="plus"
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          onPress={() => router.push("/products/new")}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  search: { margin: 12, marginBottom: 0 },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 28,
    borderRadius: 28,
    elevation: 6,
  },
});
