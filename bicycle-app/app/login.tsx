// app/login.tsx
import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { AuthContext } from "../context/AuthContext";
import Button from "../components/Button";

export default function LoginScreen() {
  const { signIn } = useContext(AuthContext);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const doLogin = async () => {
    if (!identifier.trim() || !password.trim()) {
      Alert.alert("Validation", "Please enter phone/email and password");
      return;
    }
    setLoading(true);
    try {
      await signIn(identifier.trim(), password);
      // on success AuthProvider will contain user and app can navigate to dashboard
    } catch (err: any) {
      console.error("Login error:", err?.response || err?.message || err);
      Alert.alert(
        "Login failed",
        err?.response?.data?.message || err?.message || "Check credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Animatable.View
        animation="fadeInDown"
        duration={600}
        style={styles.card}
      >
        <Animatable.Image
          animation="pulse"
          iterationCount={"infinite"}
          iterationDelay={4000}
          source={require("../assets/logo.png")}
          style={styles.logo}
        />

        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to continue to Bicycle POS</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Phone or Email</Text>
          <TextInput
            value={identifier}
            onChangeText={setIdentifier}
            placeholder="e.g. +91 98xxxx or you@domain.com"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            placeholderTextColor="#94a3b8"
          />

          <Text style={[styles.label, { marginTop: 12 }]}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
            style={styles.input}
            placeholderTextColor="#94a3b8"
          />

          <TouchableOpacity
            onPress={() => Alert.alert("Reset", "Password reset placeholder")}
            style={{ alignSelf: "flex-end", marginTop: 6 }}
          >
            <Text style={styles.resetText}>Forgot?</Text>
          </TouchableOpacity>

          <View style={{ marginTop: 14 }}>
            <Button
              title={loading ? "Signing in..." : "Sign in"}
              onPress={doLogin}
            />
            {loading && (
              <ActivityIndicator style={{ marginTop: 10 }} color="#16a34a" />
            )}
          </View>

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity
            style={[styles.socialBtn]}
            onPress={() => Alert.alert("Info", "Google sign-in placeholder")}
          >
            <Text style={styles.socialText}>Continue with Google</Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Powered by Bicycle · v1.0</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "#f7fafc",
    borderRadius: 18,
    padding: 22,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 20,
    elevation: 6,
  },
  logo: {
    width: 84,
    height: 84,
    alignSelf: "center",
    borderRadius: 12,
    marginBottom: 8,
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    color: "#0f172a",
  },
  subtitle: {
    textAlign: "center",
    color: "#64748b",
    marginBottom: 14,
    marginTop: 4,
  },
  form: {
    marginTop: 6,
  },
  label: {
    color: "#64748b",
    fontSize: 12,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#0f172a",
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#e6eef9",
  },
  resetText: {
    color: "#059669",
    fontSize: 13,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    gap: 8,
    justifyContent: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#e6eef9",
    flex: 1,
  },
  dividerText: {
    marginHorizontal: 10,
    color: "#64748b",
    fontSize: 13,
  },
  socialBtn: {
    marginTop: 12,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5eefb",
  },
  socialText: {
    color: "#0f172a",
    fontWeight: "600",
  },
  footer: {
    marginTop: 18,
  },
  footerText: {
    color: "#94a3b8",
    fontSize: 12,
  },
});
