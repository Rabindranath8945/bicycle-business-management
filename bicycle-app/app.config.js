export default {
  expo: {
    name: "bicycle-app",
    slug: "bicycle-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",

    scheme: "bicycleapp",
    userInterfaceStyle: "automatic",

    newArchEnabled: false,

    android: {
      package: "com.bicycle.app",
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/android-icon-foreground.png",
      },
    },

    web: { favicon: "./assets/images/favicon.png" },

    plugins: ["expo-router"],

    experiments: {
      typedRoutes: true,
    },

    /* ✅ REQUIRED FOR EAS BUILD */
    extra: {
      eas: {
        projectId: "73d73d7c-a021-4c89-b102-ac733a8ec304",
      },
    },
  },
};
