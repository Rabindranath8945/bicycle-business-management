// app/products/add.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import BankingHeader from "../../components/BankingHeader";
import BottomNav from "../../components/BottomNav";
import { Ionicons } from "@expo/vector-icons";
import { bankingTheme } from "../../theme/banking";

/* HOOK FOR SAFE CATEGORY FETCH */
import useCategories from "../../hooks/useCategories";

/* BACKEND BASE URL */
const BASE_URL = "https://mandal-cycle-pos-api.onrender.com";

/* ----- FRONTEND COPIES YOUR BACKEND LOGIC EXACTLY ----- */

const generateBarcode = () => {
  const part1 = Date.now().toString().slice(-6);
  const part2 = Math.floor(100000 + Math.random() * 900000);
  return `${part1}${part2}`;
};

const generateSKU = (name: string) => {
  const prefix = name.trim().substring(0, 3).toUpperCase() || "SKU";
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${random}`;
};

const generateProductNumber = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const random = Math.floor(100 + Math.random() * 900);
  return `PRD${y}${m}${d}-${random}`;
};

export default function AddProductScreen() {
  /* Category data from backend using stable hook */
  const { categories, loading: catLoading } = useCategories();

  /* Form Fields */
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);

  const [sellingPrice, setSellingPrice] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [wholesalePrice, setWholesalePrice] = useState("");
  const [stock, setStock] = useState("");
  const [unit, setUnit] = useState("");
  const [hsn, setHsn] = useState("");

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /* Auto Codes */
  const [sku, setSku] = useState(generateSKU(""));
  const [barcode, setBarcode] = useState(generateBarcode());
  const [productNumber, setProductNumber] = useState(generateProductNumber());

  /* Auto-regenerate SKU when name changes */
  useEffect(() => {
    setSku(generateSKU(name));
  }, [name]);

  /* Pick Image */
  async function pickImage() {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission needed", "Enable photo permission.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (err) {
      Alert.alert("Error", "Could not pick image");
    }
  }

  /* Regenerate Codes Manually */
  function regenerateCodes() {
    setSku(generateSKU(name));
    setBarcode(generateBarcode());
    setProductNumber(generateProductNumber());
  }

  /* Submit Product */
  async function handleAddProduct() {
    if (!name.trim()) return Alert.alert("Missing", "Enter product name");
    if (!categoryId) return Alert.alert("Missing", "Select category");
    if (!sellingPrice.trim())
      return Alert.alert("Missing", "Enter selling price");

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", categoryId);
      formData.append("sellingPrice", sellingPrice);
      formData.append("costPrice", costPrice);
      formData.append("wholesalePrice", wholesalePrice);
      formData.append("stock", stock);
      formData.append("unit", unit);
      formData.append("hsn", hsn);

      formData.append("sku", sku);

      if (imageUri) {
        formData.append("image", {
          uri: imageUri,
          name: "product.jpg",
          type: "image/jpeg",
        } as any);
      }

      const res = await fetch(`${BASE_URL}/api/products`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("Error", data.message || "Failed to add product");
        return;
      }

      Alert.alert("Success", "Product added successfully");

      /* Reset Form */
      setName("");
      setCategoryId(null);
      setSellingPrice("");
      setCostPrice("");
      setWholesalePrice("");
      setStock("");
      setUnit("");
      setHsn("");
      setImageUri(null);

      regenerateCodes();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <BankingHeader hideSales />

          <ScrollView contentContainerStyle={styles.scroll}>
            <View style={styles.card}>
              {/* Header */}
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleWrap}>
                  <Ionicons
                    name="duplicate-outline"
                    size={18}
                    color={bankingTheme.colors.primary}
                    style={{ marginRight: 6 }}
                  />
                  <Text style={styles.cardTitle}>Add New Product</Text>
                </View>

                <TouchableOpacity
                  onPress={regenerateCodes}
                  style={styles.smallAction}
                >
                  <Ionicons name="refresh" size={18} color="#111" />
                </TouchableOpacity>
              </View>

              {/* Product Name */}
              <View style={styles.field}>
                <Text style={styles.label}>Product Name</Text>
                <TextInput
                  placeholder="Enter product name"
                  placeholderTextColor="#9ca3af"
                  value={name}
                  onChangeText={setName}
                  style={styles.input}
                />
              </View>

              {/* Category */}
              <View style={styles.field}>
                <Text style={styles.label}>Category</Text>

                <TouchableOpacity
                  style={styles.picker}
                  onPress={() => {
                    if (categories.length === 0) {
                      Alert.alert(
                        "No categories",
                        "Add categories first in admin panel"
                      );
                      return;
                    }

                    Alert.alert(
                      "Select Category",
                      "",
                      [
                        ...categories.map((c) => ({
                          text: c.name,
                          onPress: () => setCategoryId(c._id),
                        })),
                        { text: "Cancel", style: "cancel" },
                      ],
                      { cancelable: true }
                    );
                  }}
                >
                  <Text
                    style={[
                      styles.pickerText,
                      !categoryId && { color: "#9ca3af" },
                    ]}
                  >
                    {categoryId
                      ? categories.find((c) => c._id === categoryId)?.name
                      : "Select category"}
                  </Text>
                  <Ionicons name="chevron-down" size={18} color="#94a3b8" />
                </TouchableOpacity>
              </View>

              {/* SKU */}
              <View style={styles.field}>
                <Text style={styles.label}>SKU</Text>
                <TextInput
                  value={sku}
                  editable={false}
                  style={[styles.input, styles.disabledInput]}
                />
              </View>

              {/* Barcode */}
              <View style={styles.field}>
                <Text style={styles.label}>Barcode</Text>
                <TextInput
                  value={barcode}
                  editable={false}
                  style={[styles.input, styles.disabledInput]}
                />
              </View>

              {/* Product Number */}
              <View style={styles.field}>
                <Text style={styles.label}>Product Number</Text>
                <TextInput
                  value={productNumber}
                  editable={false}
                  style={[styles.input, styles.disabledInput]}
                />
              </View>

              {/* Prices */}
              <View style={styles.field}>
                <Text style={styles.label}>Selling Price</Text>
                <TextInput
                  placeholder="₹ 0.00"
                  keyboardType="numeric"
                  value={sellingPrice}
                  onChangeText={setSellingPrice}
                  style={styles.input}
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Cost Price</Text>
                <TextInput
                  placeholder="₹ 0.00"
                  keyboardType="numeric"
                  value={costPrice}
                  onChangeText={setCostPrice}
                  style={styles.input}
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Wholesale Price</Text>
                <TextInput
                  placeholder="₹ 0.00"
                  keyboardType="numeric"
                  value={wholesalePrice}
                  onChangeText={setWholesalePrice}
                  style={styles.input}
                />
              </View>

              {/* Stock */}
              <View style={styles.field}>
                <Text style={styles.label}>Stock</Text>
                <TextInput
                  placeholder="0"
                  keyboardType="numeric"
                  value={stock}
                  onChangeText={setStock}
                  style={styles.input}
                />
              </View>

              {/* Unit */}
              <View style={styles.field}>
                <Text style={styles.label}>Unit</Text>
                <TextInput
                  placeholder="pcs / kg"
                  value={unit}
                  onChangeText={setUnit}
                  style={styles.input}
                />
              </View>

              {/* HSN */}
              <View style={styles.field}>
                <Text style={styles.label}>HSN Code</Text>
                <TextInput
                  placeholder="HSN"
                  value={hsn}
                  onChangeText={setHsn}
                  style={styles.input}
                />
              </View>

              {/* Image Picker */}
              <View style={{ marginTop: 10 }}>
                <Text style={styles.label}>Product Image</Text>
                <View style={styles.imageRow}>
                  <TouchableOpacity
                    style={styles.imagePicker}
                    onPress={pickImage}
                  >
                    {imageUri ? (
                      <Image
                        source={{ uri: imageUri }}
                        style={styles.preview}
                      />
                    ) : (
                      <View style={styles.placeholder}>
                        <Ionicons
                          name="image-outline"
                          size={28}
                          color="#94a3b8"
                        />
                        <Text style={styles.placeholderText}>Choose image</Text>
                      </View>
                    )}
                  </TouchableOpacity>

                  <View style={{ width: 12 }} />

                  <View style={{ flex: 1 }}>
                    <TouchableOpacity
                      onPress={pickImage}
                      style={styles.uploadBtn}
                    >
                      <Text style={styles.uploadText}>Upload Image</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Submit Button */}
              <View style={{ marginTop: 18 }}>
                <TouchableOpacity
                  style={[styles.actionBtn, loading && { opacity: 0.6 }]}
                  disabled={loading}
                  onPress={handleAddProduct}
                >
                  <Ionicons
                    name="cube-outline"
                    size={18}
                    color="#fff"
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.actionText}>
                    {loading ? "Adding..." : "Add Product"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ height: 120 }} />
          </ScrollView>

          <BottomNav />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ---- STYLES (unchanged) ---- */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f8fafc" },
  container: { flex: 1 },
  scroll: { padding: 14 },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  cardTitleWrap: { flexDirection: "row", alignItems: "center" },
  cardTitle: { fontSize: 18, fontWeight: "600" },
  smallAction: {
    backgroundColor: "#e5e7eb",
    padding: 6,
    borderRadius: 8,
  },
  field: { marginBottom: 10 },
  label: { fontSize: 14, fontWeight: "500", marginBottom: 4 },
  input: {
    backgroundColor: "#f1f5f9",
    padding: 12,
    borderRadius: 8,
    fontSize: 15,
  },
  disabledInput: {
    backgroundColor: "#e2e8f0",
    color: "#374151",
  },
  picker: {
    backgroundColor: "#f1f5f9",
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  pickerText: { fontSize: 15 },
  imageRow: { flexDirection: "row", marginTop: 6 },
  imagePicker: {
    width: 110,
    height: 110,
    backgroundColor: "#f1f5f9",
    borderRadius: 10,
    overflow: "hidden",
  },
  preview: { width: "100%", height: "100%" },
  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: { fontSize: 13, marginTop: 4 },
  uploadBtn: {
    backgroundColor: "#e2e8f0",
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 20,
  },
  uploadText: { textAlign: "center", fontWeight: "500" },
  actionBtn: {
    backgroundColor: bankingTheme.colors.primary,
    padding: 14,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  actionText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
