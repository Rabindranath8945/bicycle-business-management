// components/ProductCard.tsx
import React from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { Surface, useTheme, IconButton } from "react-native-paper";
import { BlurView } from "expo-blur";

type Props = {
  id?: string;
  name: string;
  sku?: string;
  salePrice?: number;
  stock?: number;
  photo?: string;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function ProductCard({
  name,
  sku,
  salePrice,
  stock,
  photo,
  onPress,
  onEdit,
  onDelete,
}: Props) {
  const theme = useTheme();

  return (
    <Pressable onPress={onPress} style={styles.wrap}>
      <Surface style={[styles.surface, { backgroundColor: "transparent" }]}>
        <BlurView intensity={50} tint="light" style={styles.blur}>
          <View style={styles.row}>
            <Image
              source={
                photo
                  ? { uri: photo }
                  : require("../assets/product-placeholder.png")
              }
              style={styles.thumb}
            />
            <View style={styles.info}>
              <Text
                numberOfLines={1}
                style={[styles.name, { color: theme.colors.onSurface }]}
              >
                {name}
              </Text>
              <Text style={styles.meta}>{sku ? `SKU: ${sku}` : ""}</Text>
              <Text style={styles.meta}>
                {stock !== undefined ? `Stock: ${stock}` : ""}
              </Text>
            </View>

            <View style={styles.right}>
              <Text style={[styles.price, { color: theme.colors.primary }]}>
                ₹ {salePrice ?? 0}
              </Text>
              <IconButton icon="pencil" size={18} onPress={onEdit} />
              <IconButton icon="delete" size={18} onPress={onDelete} />
            </View>
          </View>
        </BlurView>
      </Surface>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginVertical: 6,
    borderRadius: 14,
    overflow: "hidden",
  },
  surface: {
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 20,
    elevation: 3,
  },
  blur: {
    padding: 12,
    backgroundColor: "rgba(255,255,255,0.65)",
  },
  row: { flexDirection: "row", alignItems: "center" },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: "#f3f4f6",
  },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: "700" },
  meta: { color: "#6b7280", fontSize: 12, marginTop: 4 },
  right: { alignItems: "flex-end", marginLeft: 8 },
  price: { fontSize: 16, fontWeight: "700" },
});
