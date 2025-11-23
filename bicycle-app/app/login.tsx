// app/login.tsx
import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import * as Animatable from "react-native-animatable";
import {
  useTheme,
  TextInput,
  Button,
  Snackbar,
  MD3LightTheme,
} from "react-native-paper";
import { AuthContext } from "../context/AuthContext";

const LOGO = require("../assets/logo.png");

export default function LoginScreen() {
  const theme = useTheme();
  // If your AuthContext has types, replace `any` below with the proper interface
  const { signIn } = useContext(AuthContext) as {
    signIn: (identifier: string, password: string) => Promise<any>;
  };

  const [identifier, setIdentifier] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [secure, setSecure] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [snackVisible, setSnackVisible] = useState<boolean>(false);

  const onLogin = async () => {
    console.log("👉 Login button pressed");
    if (!identifier.trim() || !password.trim()) {
      setError("Please enter phone/email and password");
      setSnackVisible(true);
      return;
    }

    try {
      setLoading(true);
      await signIn(identifier.trim(), password);
      console.log("Identifier:", identifier);
      console.log("Password:", password);
      console.log("Calling signIn now...");

      // On success, AuthContext should update and your app will navigate to home.
      // If you prefer, you can navigate here: router.replace("/");
    } catch (err: any) {
      console.error("Login error:", err?.response || err?.message || err);
      setError(err?.response?.data?.message || err?.message || "Login failed");
      setSnackVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.colors.background }]}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Animatable.View
          animation="fadeInDown"
          duration={700}
          style={styles.cardWrap}
        >
          <BlurView intensity={60} tint="light" style={styles.headerGlass}>
            <Image source={LOGO} style={styles.logo} resizeMode="contain" />
          </BlurView>

          <Animatable.View animation="fadeInUp" delay={200} style={styles.card}>
            <Text style={[styles.title, { color: theme.colors.onSurface }]}>
              Welcome back
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.onSurface }]}>
              Sign in to continue to Bicycle POS
            </Text>

            <View style={styles.form}>
              <TextInput
                mode="outlined"
                label="Phone or Email"
                value={identifier}
                onChangeText={setIdentifier}
                autoCapitalize="none"
                keyboardType="email-address"
                left={<TextInput.Icon icon="account" />}
                style={styles.input}
                outlineColor="rgba(124,58,237,0.08)"
                activeOutlineColor={theme.colors.primary}
                placeholder="e.g. +91 98xxxx or you@domain.com"
              />

              <TextInput
                mode="outlined"
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={secure}
                right={
                  <TextInput.Icon
                    icon={secure ? "eye-off" : "eye"}
                    onPress={() => setSecure((s) => !s)}
                  />
                }
                style={[styles.input, { marginTop: 12 }]}
                outlineColor="rgba(124,58,237,0.08)"
                activeOutlineColor={theme.colors.primary}
                placeholder="••••••••"
              />

              <View style={styles.rowBetween}>
                <TouchableOpacity
                  onPress={() =>
                    Alert.alert(
                      "Forgot password",
                      "Password reset is not set up in mobile yet. Open web panel or contact admin."
                    )
                  }
                >
                  <Text
                    style={[styles.forgot, { color: theme.colors.primary }]}
                  >
                    Forgot?
                  </Text>
                </TouchableOpacity>

                <View style={styles.loginBtnWrap}>
                  {loading && (
                    <ActivityIndicator
                      size="small"
                      color={theme.colors.primary}
                      style={{ marginRight: 8 }}
                    />
                  )}
                  <Button
                    mode="contained"
                    onPress={onLogin}
                    contentStyle={{ paddingVertical: 6 }}
                    disabled={loading}
                    buttonColor={theme.colors.primary}
                    style={{ elevation: 2 }}
                  >
                    {loading ? "Signing in..." : "Sign in"}
                  </Button>
                </View>
              </View>

              <View style={styles.dividerRow}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.divider} />
              </View>

              <Button
                mode="outlined"
                onPress={() =>
                  Alert.alert("Info", "Google sign-in placeholder")
                }
                style={styles.googleBtn}
                contentStyle={{ paddingVertical: 6 }}
                icon="google"
              >
                Continue with Google
              </Button>
            </View>
          </Animatable.View>
        </Animatable.View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.colors.onSurface }]}>
            Powered by Bicycle · v1.0
          </Text>
        </View>

        <Snackbar
          visible={snackVisible}
          onDismiss={() => setSnackVisible(false)}
          action={{
            label: "OK",
            onPress: () => setSnackVisible(false),
          }}
          duration={3500}
        >
          {error}
        </Snackbar>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1, padding: 20, justifyContent: "center" },
  cardWrap: {
    alignItems: "center",
  },
  headerGlass: {
    width: 110,
    height: 110,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.6)",
  },
  logo: { width: 84, height: 84 },
  card: {
    width: "100%",
    backgroundColor: "rgba(247,250,252,0.92)",
    borderRadius: 18,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 20,
    elevation: 6,
  },
  title: { textAlign: "center", fontSize: 20, fontWeight: "700" },
  subtitle: {
    textAlign: "center",
    marginTop: 6,
    marginBottom: 12,
    color: "#64748b",
  },
  form: { marginTop: 6 },
  input: { backgroundColor: "white" },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  forgot: { fontSize: 13, fontWeight: "600" },
  loginBtnWrap: { flexDirection: "row", alignItems: "center" },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    justifyContent: "center" as any,
  },
  divider: { height: 1, backgroundColor: "#e6eef9", flex: 1 },
  dividerText: { marginHorizontal: 10, color: "#64748b", fontSize: 13 },
  googleBtn: { marginTop: 12, borderRadius: 12, borderColor: "#e5eefb" },
  footer: { marginTop: 18, alignItems: "center" },
  footerText: { color: "#94a3b8", fontSize: 12 },
});
