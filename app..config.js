export default {
  expo: {
    name: "Flipnote",
    slug: "flipnote",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    plugins: [
      [
        "expo-notifications",
        {
          color: "red",
          icon: "./assets/icon.png",
        },
      ],
    ],
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FEFFEF",
      },
    },
  },
};
