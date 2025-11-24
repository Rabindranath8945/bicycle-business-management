// theme/banking.ts
export const bankingTheme = {
  colors: {
    gradientFrom: "#4A90E2",
    gradientTo: "#357ABD",

    background: "#F5F7FB",
    card: "#FFFFFF",
    cardGlass: "rgba(255,255,255,0.25)",

    textPrimary: "#1A1A1A",
    textSecondary: "#6B7280",
    textWhite: "#ffffff",

    success: "#22C55E",
    danger: "#EF4444",
    info: "#3B82F6",

    // ⭐ ADD THESE — FIX YOUR ERROR
    primary: "#1A6DFF",
    secondary: "#EAF3FF",
    borderLight: "#E5E7EB",
  },

  shadow: {
    card: {
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 3,
    },
  },
};
