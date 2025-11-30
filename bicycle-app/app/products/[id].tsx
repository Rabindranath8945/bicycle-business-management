// app/products/[id].tsx
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
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { bankingTheme } from "../../theme/banking";
import BankingHeader from "../../components/BankingHeader";
import BottomNav from "../../components/BottomNav";
import { useLocalSearchParams } from "expo-router/build";

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

export default function EditProductScreen() {
  const { id } = useLocalSearchParams();

  const [loading, setLoading] = useState(true);

  // backend fields
  const [productNumber, setProductNumber] = useState("");
  const [sku, setSku] = useState("");
  const [barcode, setBarcode] = useState("");
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState<string | null>(null);

  const [costPrice, setCostPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [wholesalePrice, setWholesalePrice] = useState("");
  const [stock, setStock] = useState("");
  const [unit, setUnit] = useState("");
  const [hsn, setHsn] = useState("");
  const [description, setDescription] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);

  const [catModalVisible, setCatModalVisible] = useState(false);

  // ⭐ FETCH PRODUCT DETAILS FROM BACKEND
  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(
          `https://mandal-cycle-pos-api.onrender.com/api/products/${id}`
        );

        const json = await res.json();

        if (!json.success) throw new Error("Invalid response");

        const p = json.product;

        // fill states
        setName(p.name);
        setSalePrice(String(p.salePrice));
        setCostPrice(String(p.costPrice || ""));
        setWholesalePrice(String(p.wholesalePrice || ""));
        setStock(String(p.stock || ""));
        setUnit(p.unit || "");
        setHsn(p.hsn || "");
        setDescription(p.description || "");

        setProductNumber(p.productNumber || "");
        setSku(p.sku || "");
        setBarcode(p.barcode || "");
        setCategoryId(p.categoryId || null);
        setCategoryName(p.categoryName || null);

        // image
        if (p.photo) {
          setImageUri(
            `https://mandal-cycle-pos-api.onrender.com/uploads/${p.photo}`
          );
        }
      } catch (err) {
        console.log(err);
        Alert.alert("Error", "Failed to load product");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  async function pickImage() {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert("Permission required", "Allow photo access.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });

      if (!result.canceled && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
      }
    } catch (e) {
      Alert.alert("Error", "Unable to pick image.");
    }
  }

  // ⭐ UPDATE PRODUCT (POST to backend)
  async function handleUpdate() {
    try {
      const payload = {
        name,
        sellingPrice: salePrice,
        costPrice,
        wholesalePrice,
        stock,
        unit,
        hsn,
        categoryId,
      };

      const res = await fetch(
        `https://mandal-cycle-pos-api.onrender.com/api/products/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const json = await res.json();

      if (!json.success) throw new Error("Update failed");

      Alert.alert("Success", "Product updated");
    } catch (error) {
      Alert.alert("Error", "Failed to update");
    }
  }

  // ⭐ DELETE PRODUCT
  function handleDelete() {
    Alert.alert("Delete Product", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await fetch(
              `https://mandal-cycle-pos-api.onrender.com/api/products/${id}`,
              { method: "DELETE" }
            );

            Alert.alert("Deleted", "Product removed");
          } catch (e) {
            Alert.alert("Error", "Delete failed");
          }
        },
      },
    ]);
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator
          size="large"
          color={bankingTheme.colors.primary}
          style={{ marginTop: 60 }}
        />
      </SafeAreaView>
    );
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
            {/* image viewer */}
            <View style={styles.imageViewerWrap}>
              <Image
                source={
                  imageUri
                    ? { uri: imageUri }
                    : require("../../assets/product-placeholder.png")
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

            {/* BASIC DETAILS */}
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

              <View style={{ marginTop: 12 }}>
                <Text style={styles.label}>Product Name</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View style={{ marginTop: 12 }}>
                <Text style={styles.label}>Category</Text>
                <TouchableOpacity
                  style={styles.picker}
                  onPress={() => setCatModalVisible(true)}
                >
                  <Text style={styles.pickerText}>
                    {categoryName || "Select category"}
                  </Text>
                  <Ionicons name="chevron-down" size={18} color="#94a3b8" />
                </TouchableOpacity>
              </View>

              {imageUri && (
                <Image source={{ uri: imageUri }} style={styles.previewImg} />
              )}
            </View>

            {/* PRICING */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Pricing</Text>

              <View style={styles.row}>
                <View style={styles.col}>
                  <Text style={styles.label}>Cost Price</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={costPrice}
                    onChangeText={setCostPrice}
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
                  />
                </View>
              </View>

              <View style={{ marginTop: 10 }}>
                <Text style={styles.label}>Wholesale Price</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={wholesalePrice}
                  onChangeText={setWholesalePrice}
                />
              </View>
            </View>

            {/* INVENTORY */}
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
                  />
                </View>

                <View style={{ width: 10 }} />

                <View style={styles.col}>
                  <Text style={styles.label}>Unit</Text>
                  <TextInput
                    style={styles.input}
                    value={unit}
                    onChangeText={setUnit}
                  />
                </View>

                <View style={{ width: 10 }} />

                <View style={styles.col}>
                  <Text style={styles.label}>HSN</Text>
                  <TextInput
                    style={styles.input}
                    value={hsn}
                    onChangeText={setHsn}
                  />
                </View>
              </View>
            </View>

            {/* OTHER */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Other</Text>

              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[
                  styles.input,
                  { height: 100, textAlignVertical: "top" },
                ]}
                value={description}
                multiline
                onChangeText={setDescription}
              />
            </View>

            <View style={{ height: 120 }} />
          </ScrollView>

          {/* BUTTONS */}
          <View style={styles.footerBtns}>
            <TouchableOpacity style={styles.updateBtn} onPress={handleUpdate}>
              <Ionicons name="save-outline" size={18} color="#fff" />
              <Text style={styles.updateText}>Update Product</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
              <Ionicons name="trash-outline" size={18} color="#fff" />
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>

          <BottomNav />

          {/* CATEGORY MODAL */}
          {catModalVisible && (
            <View style={styles.modalWrap}>
              <View style={styles.modalBox}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select Category</Text>
                  <TouchableOpacity onPress={() => setCatModalVisible(false)}>
                    <Ionicons name="close" size={24} />
                  </TouchableOpacity>
                </View>

                <FlatList
                  data={CATEGORIES}
                  keyExtractor={(i) => i}
                  renderItem={({ item }) => {
                    const active = categoryName === item;
                    return (
                      <TouchableOpacity
                        style={styles.catRow}
                        onPress={() => {
                          setCategoryName(item);
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
              </View>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ⭐ STYLES REMAIN EXACTLY SAME (NOT CHANGED)

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
