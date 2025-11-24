// app/products/add.tsx
import React, { useState } from "react";
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

/* --- helper generators --- */
const genSKU = (name = "") =>
  `SKU-${(name || "ITEM").slice(0, 3).toUpperCase()}-${Math.floor(
    Math.random() * 9000 + 1000
  )}`;

const genBarcode = () => `${Date.now().toString().slice(-12)}`;

const genProductNumber = () => `P-${Math.random().toString(36).slice(2, 9)}`;

/* --- small category list for demo, replace with API categories --- */
const CATEGORIES = [
  "Tyre",
  "Tube",
  "Rim",
  "Mudguard",
  "Chain",
  "Gear",
  "Frame",
  "Handle",
];

export default function AddProductScreen() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [sku, setSku] = useState(genSKU());
  const [barcode, setBarcode] = useState(genBarcode());
  const [productNumber, setProductNumber] = useState(genProductNumber());

  const [sellingPrice, setSellingPrice] = useState<string>("");
  const [costPrice, setCostPrice] = useState<string>("");
  const [wholesalePrice, setWholesalePrice] = useState<string>("");
  const [stock, setStock] = useState<string>("");
  const [unit, setUnit] = useState<string>("");
  const [hsn, setHsn] = useState<string>("");

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /* Image picker */
  async function pickImage() {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          "Permission required",
          "Permission to access photos is required to upload product image."
        );
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
      console.error(err);
      Alert.alert("Error", "Could not open image picker.");
    }
  }

  /* Re-generate codes */
  function regenerateCodes() {
    setSku(genSKU(name || undefined));
    setBarcode(genBarcode());
    setProductNumber(genProductNumber());
  }

  /* Basic validation and mocked submit */
  async function handleAddProduct() {
    if (!name.trim()) {
      Alert.alert("Validation", "Please enter product name.");
      return;
    }
    setLoading(true);

    // Build payload (replace with API call)
    const payload = {
      name: name.trim(),
      category,
      sku,
      barcode,
      productNumber,
      sellingPrice: parseFloat(sellingPrice || "0"),
      costPrice: parseFloat(costPrice || "0"),
      wholesalePrice: parseFloat(wholesalePrice || "0"),
      stock: parseFloat(stock || "0"),
      unit,
      hsn,
      image: imageUri ?? null,
    };

    // Mock delay + response
    setTimeout(() => {
      setLoading(false);
      Alert.alert("Product Added", `${payload.name} added successfully.`);
      // Reset or navigate back
      setName("");
      setCategory(null);
      setSku(genSKU());
      setBarcode(genBarcode());
      setProductNumber(genProductNumber());
      setSellingPrice("");
      setCostPrice("");
      setWholesalePrice("");
      setStock("");
      setUnit("");
      setHsn("");
      setImageUri(null);
    }, 700);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <BankingHeader hideSales />

          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleWrap}>
                  <Ionicons
                    name="duplicate-outline"
                    size={18}
                    color={bankingTheme.colors.primary}
                    style={{ marginRight: 8 }}
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

              {/* Product name */}
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

              {/* Category / small select */}
              <View style={[styles.row, { marginTop: 6 }]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Category</Text>
                  <TouchableOpacity
                    style={styles.picker}
                    onPress={() => {
                      const buttons = [
                        ...CATEGORIES.map((c) => ({
                          text: c,
                          onPress: () => setCategory(c),
                        })),
                        { text: "Cancel", style: "cancel" },
                      ];

                      Alert.alert("Select Category", "", [
                        ...CATEGORIES.map((c) => ({
                          text: c,
                          onPress: () => setCategory(c),
                        })),
                        { text: "Cancel", style: "cancel" as const },
                      ]);
                    }}
                  >
                    <Text
                      style={[
                        styles.pickerText,
                        !category && { color: "#9ca3af" },
                      ]}
                    >
                      {category || "Select category"}
                    </Text>
                    <Ionicons name="chevron-down" size={18} color="#94a3b8" />
                  </TouchableOpacity>
                </View>

                {/* three small auto boxes: SKU / Barcode / P# */}
                <View style={{ width: 12 }} />
              </View>

              <View style={styles.autoRow}>
                <View style={styles.autoBox}>
                  <Text style={styles.autoLabel}>SKU</Text>
                  <Text style={styles.autoVal}>{sku}</Text>
                </View>

                <View style={styles.autoBox}>
                  <Text style={styles.autoLabel}>Barcode</Text>
                  <Text style={styles.autoVal}>{barcode}</Text>
                </View>

                <View style={styles.autoBox}>
                  <Text style={styles.autoLabel}>Product No</Text>
                  <Text style={styles.autoVal}>{productNumber}</Text>
                </View>
              </View>

              {/* Prices row */}
              <View style={styles.row}>
                <View style={styles.col}>
                  <Text style={styles.label}>Selling Price</Text>
                  <TextInput
                    placeholder="₹ 0.00"
                    placeholderTextColor="#9ca3af"
                    keyboardType="numeric"
                    value={sellingPrice}
                    onChangeText={setSellingPrice}
                    style={styles.input}
                  />
                </View>

                <View style={{ width: 10 }} />

                <View style={styles.col}>
                  <Text style={styles.label}>Cost Price</Text>
                  <TextInput
                    placeholder="₹ 0.00"
                    placeholderTextColor="#9ca3af"
                    keyboardType="numeric"
                    value={costPrice}
                    onChangeText={setCostPrice}
                    style={styles.input}
                  />
                </View>

                <View style={{ width: 10 }} />

                <View style={styles.col}>
                  <Text style={styles.label}>Wholesale Price</Text>
                  <TextInput
                    placeholder="₹ 0.00"
                    placeholderTextColor="#9ca3af"
                    keyboardType="numeric"
                    value={wholesalePrice}
                    onChangeText={setWholesalePrice}
                    style={styles.input}
                  />
                </View>
              </View>

              {/* Stock / Unit / HSN */}
              <View style={[styles.row, { marginTop: 10 }]}>
                <View style={styles.col}>
                  <Text style={styles.label}>Stock</Text>
                  <TextInput
                    placeholder="0"
                    placeholderTextColor="#9ca3af"
                    keyboardType="numeric"
                    value={stock}
                    onChangeText={setStock}
                    style={styles.input}
                  />
                </View>

                <View style={{ width: 10 }} />

                <View style={styles.col}>
                  <Text style={styles.label}>Unit</Text>
                  <TextInput
                    placeholder="pcs / kg"
                    placeholderTextColor="#9ca3af"
                    value={unit}
                    onChangeText={setUnit}
                    style={styles.input}
                  />
                </View>

                <View style={{ width: 10 }} />

                <View style={styles.col}>
                  <Text style={styles.label}>HSN Code</Text>
                  <TextInput
                    placeholder="HSN"
                    placeholderTextColor="#9ca3af"
                    value={hsn}
                    onChangeText={setHsn}
                    style={styles.input}
                  />
                </View>
              </View>

              {/* Image picker */}
              <View style={{ marginTop: 14 }}>
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

                  <View style={{ flex: 1, justifyContent: "center" }}>
                    <Text style={styles.hint}>
                      Optional. Use clear, well-lit product images for better
                      invoices & reports.
                    </Text>
                    <TouchableOpacity
                      onPress={pickImage}
                      style={styles.uploadBtn}
                    >
                      <Text style={styles.uploadText}>Upload Image</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* action */}
              <View style={{ marginTop: 18 }}>
                <TouchableOpacity
                  style={[styles.actionBtn, loading && { opacity: 0.7 }]}
                  onPress={handleAddProduct}
                  disabled={loading}
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

            {/* bottom spacing so content above BottomNav */}
            <View style={{ height: 120 }} />
          </ScrollView>

          <BottomNav />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ----------------- styles ----------------- */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: bankingTheme.colors.background },
  container: { flex: 1, backgroundColor: bankingTheme.colors.background },

  scroll: {
    padding: 12,
    paddingBottom: 20,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    elevation: 4,
    // premium border
    borderWidth: 1,
    borderColor: "rgba(12,20,35,0.04)",
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitleWrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: bankingTheme.colors.textPrimary,
  },
  smallAction: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#fff",
    elevation: 2,
  },

  field: { marginTop: 6 },
  label: { color: "#374151", fontWeight: "700", marginBottom: 6 },
  input: {
    backgroundColor: "#f8fafc",
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 12 : 8,
    borderRadius: 10,
    color: "#0f172a",
    borderWidth: 1,
    borderColor: "rgba(12,20,35,0.04)",
  },

  /* pickers + auto boxes */
  picker: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(12,20,35,0.04)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pickerText: { fontSize: 14, color: "#0f172a" },

  autoRow: {
    flexDirection: "row",
    marginTop: 12,
    gap: 10,
    justifyContent: "space-between",
  },
  autoBox: {
    flex: 1,
    backgroundColor: "#0f172a05",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(12,20,35,0.04)",
  },
  autoLabel: { color: "#6b7280", fontSize: 12, fontWeight: "700" },
  autoVal: {
    marginTop: 6,
    fontWeight: "500",
    fontSize: 11,
    color: bankingTheme.colors.textPrimary,
  },

  /* rows / cols */
  row: { flexDirection: "row", marginTop: 12 },
  col: { flex: 1 },

  /* images */
  imageRow: { flexDirection: "row", marginTop: 8, alignItems: "center" },
  imagePicker: {
    width: 110,
    height: 90,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(12,20,35,0.04)",
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
  },
  preview: { width: "100%", height: "100%", resizeMode: "cover" },
  placeholder: { alignItems: "center" },
  placeholderText: { color: "#94a3b8", marginTop: 6 },

  hint: { color: "#6b7280", fontSize: 13, marginBottom: 8 },

  uploadBtn: {
    backgroundColor: "rgba(11,105,245,0.08)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  uploadText: { color: bankingTheme.colors.primary, fontWeight: "700" },

  /* action */
  actionBtn: {
    marginTop: 8,
    backgroundColor: bankingTheme.colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  actionText: { color: "#fff", fontWeight: "800" },
});
