// app/products/edit/[id].tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  FlatList,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { bankingTheme } from "../../theme/banking";
import BankingHeader from "../../components/BankingHeader";
import BottomNav from "../../components/BottomNav";
import { useLocalSearchParams } from "expo-router";

/**
 * Edit Product Screen
 * - Sectioned form (Basic / Pricing / Inventory / Other)
 * - Product Number / SKU / Barcode are read-only
 * - Category uses a dropdown modal (same category list you requested)
 * - Uses bankingTheme, BankingHeader and BottomNav
 */

// Use the same categories you confirmed
const CATEGORIES = [
  "Tyre",
  "Tube",
  "Rim",
  "Mudguard",
  "Frock",
  "Chaincover",
  "Chain",
  "Free",
  "Gear",
  "Frame",
  "Handle",
  "Padel",
  "Bell",
];

// helper: generate product number (for fallback)
const genProductNumber = () => `P-${Math.random().toString(36).slice(2, 9)}`;

export default function EditProductScreen() {
  // If you pass product data via navigation params, read them:
  // (expo-router/useLocalSearchParams was used in previous files — keep same approach)
  const params = useLocalSearchParams() as Record<string, any>;

  // Prefill from params if provided, else fallback to sample values.
  const [productNumber] = useState<string>(
    params.productNumber || genProductNumber()
  );
  const [sku] = useState<string>(
    params.sku || `SKU-${Date.now().toString().slice(-6)}`
  );
  const [barcode] = useState<string>(params.barcode || `${Date.now()}`);

  const [name, setName] = useState<string>(params.name || "");
  const [category, setCategory] = useState<string | null>(
    params.category || null
  );
  const [purchasePrice, setPurchasePrice] = useState<string>(
    params.purchasePrice ? String(params.purchasePrice) : ""
  );
  const [salePrice, setSalePrice] = useState<string>(
    params.salePrice ? String(params.salePrice) : ""
  );
  const [wholesalePrice, setWholesalePrice] = useState<string>(
    params.wholesalePrice ? String(params.wholesalePrice) : ""
  );
  const [stock, setStock] = useState<string>(
    params.stock ? String(params.stock) : ""
  );
  const [unit, setUnit] = useState<string>(params.unit || "");
  const [taxPct, setTaxPct] = useState<string>(
    params.taxPct ? String(params.taxPct) : "0"
  );
  const [description, setDescription] = useState<string>(
    params.description || ""
  );

  const [imageUri, setImageUri] = useState<string | null>(params.image || null);

  // category dropdown modal state
  const [catModalVisible, setCatModalVisible] = useState<boolean>(false);

  // Image picker
  async function pickImage() {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert(
          "Permission required",
          "Allow access to photos to pick an image."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
        allowsEditing: true,
        aspect: [4, 3],
      });

      // new API: canceled + assets[]
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Unable to pick image.");
    }
  }

  // Save handler (replace with real API call)
  function handleUpdate() {
    if (!name.trim()) {
      Alert.alert("Validation", "Product name is required.");
      return;
    }
    if (!category) {
      Alert.alert("Validation", "Please choose a category.");
      return;
    }

    const payload = {
      productNumber,
      sku,
      barcode,
      name,
      category,
      purchasePrice: parseFloat(purchasePrice || "0"),
      salePrice: parseFloat(salePrice || "0"),
      wholesalePrice: parseFloat(wholesalePrice || "0"),
      stock: parseFloat(stock || "0"),
      unit,
      taxPct: parseFloat(taxPct || "0"),
      description,
      image: imageUri,
    };

    // Replace this with axios/fetch to update on server
    console.log("Updating product:", payload);
    Alert.alert("Updated", "Product updated successfully.");
  }

  // Delete handler (replace with API call)
  function handleDelete() {
    Alert.alert("Delete product", "Are you sure?", [
      { text: "Cancel", style: "cancel" as const },
      {
        text: "Delete",
        style: "destructive" as const,
        onPress: () => {
          // TODO: call delete API
          Alert.alert("Deleted", "Product has been deleted.");
        },
      },
    ]);
  }

  // Category modal apply (we set immediately when tapping)
  function openCategoryModal() {
    setCatModalVisible(true);
  }
  function closeCategoryModal() {
    setCatModalVisible(false);
  }

  // Ensure modal does not hide behind bottom nav by using marginBottom in modal Box
  useEffect(() => {
    // no-op for now; left for future enhancements
  }, []);

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
            {/* ---------- IMAGE VIEWER AT TOP ---------- */}
            <View style={styles.imageViewerWrap}>
              <Image
                source={
                  imageUri
                    ? { uri: imageUri }
                    : require("../../assets/product-placeholder.png") // fallback image
                }
                style={styles.imageViewer}
              />

              <TouchableOpacity
                style={styles.imagePickerBtn}
                onPress={pickImage}
              >
                <Ionicons name="camera-outline" size={20} color="#fff" />
                <Text style={styles.imagePickerText}>Change Image</Text>
              </TouchableOpacity>
            </View>

            {/* ---------- BASIC DETAILS ---------- */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Basic Details</Text>
                <TouchableOpacity onPress={pickImage} style={styles.iconBtn}>
                  <Ionicons
                    name="image-outline"
                    size={18}
                    color={bankingTheme.colors.primary}
                  />
                </TouchableOpacity>
              </View>

              {/* read-only codes row */}
              <View style={styles.codesRow}>
                <View style={styles.codeBox}>
                  <Text style={styles.codeLabel}>Product No</Text>
                  <Text style={styles.codeValue}>{productNumber}</Text>
                </View>

                <View style={styles.codeBox}>
                  <Text style={styles.codeLabel}>SKU</Text>
                  <Text style={styles.codeValue}>{sku}</Text>
                </View>

                <View style={styles.codeBox}>
                  <Text style={styles.codeLabel}>Barcode</Text>
                  <Text style={styles.codeValue}>{barcode}</Text>
                </View>
              </View>

              {/* name */}
              <View style={{ marginTop: 12 }}>
                <Text style={styles.label}>Product Name</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter product name"
                  placeholderTextColor="#9ca3af"
                />
              </View>

              {/* category dropdown */}
              <View style={{ marginTop: 12 }}>
                <Text style={styles.label}>Category</Text>
                <TouchableOpacity
                  style={styles.picker}
                  onPress={openCategoryModal}
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

              {/* image preview small */}
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.previewImg} />
              ) : null}
            </View>

            {/* ---------- PRICING ---------- */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Pricing</Text>

              <View style={styles.row}>
                <View style={styles.col}>
                  <Text style={styles.label}>Purchase Price</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={purchasePrice}
                    onChangeText={setPurchasePrice}
                    placeholder="0.00"
                    placeholderTextColor="#9ca3af"
                  />
                </View>

                <View style={{ width: 10 }} />

                <View style={styles.col}>
                  <Text style={styles.label}>Sale Price</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={salePrice}
                    onChangeText={setSalePrice}
                    placeholder="0.00"
                    placeholderTextColor="#9ca3af"
                  />
                </View>

                <View style={{ width: 10 }} />
              </View>

              <View style={{ marginTop: 10 }}>
                <Text style={styles.label}>Wholesale Price</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={wholesalePrice}
                  onChangeText={setWholesalePrice}
                  placeholder="0.00"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>

            {/* ---------- INVENTORY ---------- */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Inventory</Text>

              <View style={styles.row}>
                <View style={styles.col}>
                  <Text style={styles.label}>Stock</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={stock}
                    onChangeText={setStock}
                    placeholder="0"
                    placeholderTextColor="#9ca3af"
                  />
                </View>

                <View style={{ width: 10 }} />

                <View style={styles.col}>
                  <Text style={styles.label}>Unit</Text>
                  <TextInput
                    style={styles.input}
                    value={unit}
                    onChangeText={setUnit}
                    placeholder="pcs / kg"
                    placeholderTextColor="#9ca3af"
                  />
                </View>

                <View style={{ width: 10 }} />

                <View style={styles.col}>
                  <Text style={styles.label}>GST %</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={taxPct}
                    onChangeText={setTaxPct}
                    placeholder="0"
                    placeholderTextColor="#9ca3af"
                  />
                </View>
              </View>
            </View>

            {/* ---------- OTHER ---------- */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Other</Text>

              <Text style={styles.label}>Description (optional)</Text>
              <TextInput
                style={[
                  styles.input,
                  { height: 100, textAlignVertical: "top" },
                ]}
                value={description}
                onChangeText={setDescription}
                placeholder="Add description..."
                placeholderTextColor="#9ca3af"
                multiline
              />
            </View>

            {/* bottom spacing so content not hidden behind bottom nav */}
            <View style={{ height: 120 }} />
          </ScrollView>

          {/* SAVE / DELETE buttons fixed above BottomNav */}
          <View style={styles.footerBtns}>
            <TouchableOpacity style={styles.updateBtn} onPress={handleUpdate}>
              <Ionicons
                name="save-outline"
                size={18}
                color="#fff"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.updateText}>Update Product</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
              <Ionicons
                name="trash-outline"
                size={18}
                color="#fff"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>

          <BottomNav />

          {/* ---------- Category Dropdown Modal ---------- */}
          {catModalVisible && (
            <View style={styles.modalWrap}>
              <View style={styles.modalBox}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select Category</Text>
                  <TouchableOpacity onPress={closeCategoryModal}>
                    <Ionicons name="close" size={24} color="#111" />
                  </TouchableOpacity>
                </View>

                <FlatList
                  data={CATEGORIES}
                  keyExtractor={(i) => i}
                  renderItem={({ item }) => {
                    const active = category === item;
                    return (
                      <TouchableOpacity
                        style={styles.catRow}
                        onPress={() => {
                          setCategory(item);
                          setCatModalVisible(false);
                        }}
                      >
                        <View
                          style={[
                            styles.checkbox,
                            active && styles.checkboxActive,
                          ]}
                        >
                          {active && (
                            <Ionicons name="checkmark" size={18} color="#fff" />
                          )}
                        </View>
                        <Text style={styles.catLabel}>{item}</Text>
                      </TouchableOpacity>
                    );
                  }}
                />

                <View style={styles.modalFooter}>
                  <TouchableOpacity
                    style={styles.clearBtn}
                    onPress={() => {
                      setCategory(null);
                    }}
                  >
                    <Text style={styles.clearText}>Clear</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.applyBtn}
                    onPress={() => setCatModalVisible(false)}
                  >
                    <Text style={styles.applyText}>Done</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ---------------------- styles ---------------------- */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: bankingTheme.colors.background },
  container: {
    flex: 1,
    backgroundColor: bankingTheme.colors.background,
    overflow: "visible",
  },

  scroll: {
    padding: 12,
    paddingBottom: 20,
  },

  sectionCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(12,20,35,0.04)",
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: bankingTheme.colors.textPrimary,
  },

  iconBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#fff",
    elevation: 2,
  },

  codesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },

  codeBox: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(12,20,35,0.04)",
    marginRight: 8,
  },

  codeLabel: { fontSize: 12, color: "#6b7280", fontWeight: "600" },
  codeValue: { fontWeight: "500", marginTop: 6, fontSize: 11 },

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

  previewImg: {
    marginTop: 12,
    width: "100%",
    height: 160,
    borderRadius: 10,
    resizeMode: "cover",
  },

  /* rows */
  row: { flexDirection: "row" },
  col: { flex: 1 },

  /* footer buttons */
  footerBtns: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 66, // sits above BottomNav
    flexDirection: "row",
    gap: 10,
    zIndex: 40,
  },
  updateBtn: {
    flex: 1,
    backgroundColor: bankingTheme.colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  updateText: { color: "#fff", fontWeight: "800" },

  deleteBtn: {
    marginLeft: 10,
    backgroundColor: "#ef4444",
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  deleteText: { color: "#fff", fontWeight: "800" },
  imageViewerWrap: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    elevation: 3,
    marginBottom: 14,
  },

  imageViewer: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    resizeMode: "cover",
    backgroundColor: "#f1f5f9",
  },

  imagePickerBtn: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: bankingTheme.colors.primary,
    paddingVertical: 10,
    borderRadius: 10,
  },

  imagePickerText: {
    color: "#fff",
    fontWeight: "700",
    marginLeft: 8,
  },

  /* modal styles (category dropdown) */
  modalWrap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.25)",
    zIndex: 999,
    justifyContent: "flex-end",
  },

  modalBox: {
    maxHeight: "84%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    paddingBottom: 30,
    marginBottom: 70, // push above bottom nav
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  modalTitle: { fontSize: 18, fontWeight: "800", color: "#111" },

  catRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },

  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#9CA3AF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  checkboxActive: {
    backgroundColor: bankingTheme.colors.primary,
    borderColor: bankingTheme.colors.primary,
  },

  catLabel: { fontSize: 16, color: "#111" },

  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },

  clearBtn: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingVertical: 12,
    marginRight: 10,
    alignItems: "center",
  },

  clearText: { color: "#475569", fontWeight: "700" },

  applyBtn: {
    flex: 1,
    backgroundColor: bankingTheme.colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },

  applyText: { color: "#fff", fontWeight: "700" },
});
