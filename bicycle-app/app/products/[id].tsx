// app/products/[id].tsx
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Alert } from "react-native";
import { TextInput, Button, useTheme } from "react-native-paper";
import ImagePickerRow from "../../components/ImagePickerRow";
import { useProductsApi } from "../../hooks/useProductsApi";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function ProductEdit() {
  const params = useLocalSearchParams() as { id: string };
  const id = params?.id;
  const theme = useTheme();
  const { getProduct, updateProduct, deleteProduct } = useProductsApi();

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [hsn, setHsn] = useState("");
  const [salePrice, setSalePrice] = useState<string>("");
  const [purchasePrice, setPurchasePrice] = useState<string>("");
  const [stock, setStock] = useState<string>("");
  const [photo, setPhoto] = useState<string | undefined>();

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      try {
        const data = await getProduct(id);
        setName(data.name || "");
        setSku(data.sku || "");
        setHsn(data.hsn || "");
        setSalePrice(String(data.salePrice ?? ""));
        setPurchasePrice(String(data.purchasePrice ?? ""));
        setStock(String(data.stock ?? ""));
        setPhoto(data.photo);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const onSave = async () => {
    try {
      setLoading(true);
      const body: any = {
        name,
        sku,
        hsn,
        salePrice: Number(salePrice),
        purchasePrice: Number(purchasePrice),
        stock: Number(stock),
      };

      if (photo && photo.startsWith("file://")) {
        const form = new FormData();
        Object.keys(body).forEach((k) => form.append(k, body[k]));
        const uriParts = photo.split(".");
        const ext = uriParts[uriParts.length - 1];
        form.append("photo", {
          uri: photo,
          name: `photo.${ext}`,
          type: `image/${ext}`,
        } as any);
        await updateProduct(id!, form);
      } else {
        await updateProduct(id!, body);
      }

      Alert.alert("Saved", "Product updated");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = () => {
    Alert.alert("Delete product", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteProduct(id!);
            // router back to listing
            useRouter().replace("/products");
          } catch (err) {
            console.error(err);
            Alert.alert("Error", "Delete failed");
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={{ padding: 16 }}>
      <ImagePickerRow value={photo} onChange={setPhoto} />
      <TextInput
        label="Name"
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

      <Button
        mode="contained"
        onPress={onSave}
        loading={loading}
        style={{ marginTop: 12 }}
        buttonColor={theme.colors.primary}
      >
        Save
      </Button>
      <Button
        mode="outlined"
        onPress={onDelete}
        style={{ marginTop: 8 }}
        buttonColor={theme.colors.error}
      >
        Delete
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  input: { marginTop: 12, backgroundColor: "white" },
});
