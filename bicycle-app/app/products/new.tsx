// app/products/new.tsx
import React, { useState } from "react";
import { View, ScrollView, StyleSheet, Alert } from "react-native";
import { TextInput, Button, useTheme, Text } from "react-native-paper";
import ImagePickerRow from "../../components/ImagePickerRow";
import { useProductsApi } from "../../hooks/useProductsApi";
import { router } from "expo-router";

export default function ProductNew() {
  const theme = useTheme();
  const { createProduct } = useProductsApi();

  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [hsn, setHsn] = useState("");
  const [salePrice, setSalePrice] = useState<string>("");
  const [purchasePrice, setPurchasePrice] = useState<string>("");
  const [stock, setStock] = useState<string>("");
  const [photo, setPhoto] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);

  const onSubmit = async () => {
    if (!name.trim()) {
      Alert.alert("Validation", "Name is required");
      return;
    }

    try {
      setSaving(true);

      // Build form data if photo present
      const body: any = {
        name,
        sku,
        hsn,
        salePrice: Number(salePrice || 0),
        purchasePrice: Number(purchasePrice || 0),
        stock: Number(stock || 0),
      };

      if (photo) {
        const form = new FormData();
        Object.keys(body).forEach((k) => form.append(k, body[k]));
        // append photo - RN / Expo file object
        const uriParts = photo.split(".");
        const ext = uriParts[uriParts.length - 1];
        form.append("photo", {
          uri: photo,
          name: `photo.${ext}`,
          type: `image/${ext}`,
        } as any);
        await createProduct(form);
      } else {
        await createProduct(body);
      }

      router.replace("/products");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to create product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={{ padding: 16 }}>
      <ImagePickerRow value={photo} onChange={setPhoto} />

      <TextInput
        label="Product name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        label="SKU"
        value={sku}
        onChangeText={setSku}
        style={styles.input}
      />
      <TextInput
        label="HSN"
        value={hsn}
        onChangeText={setHsn}
        style={styles.input}
      />
      <TextInput
        label="Sale Price"
        value={salePrice}
        onChangeText={setSalePrice}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        label="Purchase Price"
        value={purchasePrice}
        onChangeText={setPurchasePrice}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        label="Stock"
        value={stock}
        onChangeText={setStock}
        keyboardType="numeric"
        style={styles.input}
      />

      <View style={{ marginTop: 12 }}>
        <Button
          mode="contained"
          onPress={onSubmit}
          loading={saving}
          disabled={saving}
          buttonColor={theme.colors.primary}
        >
          Save product
        </Button>
      </View>

      <Text style={{ marginTop: 24, color: "#6b7280", fontSize: 12 }}>
        Auto SKU/Product number will be generated if left blank.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  input: { marginTop: 12, backgroundColor: "white" },
});
