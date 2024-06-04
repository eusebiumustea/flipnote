export default {
  name: "Flipnote",
  slug: "flipnote",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.jpg",
  plugins: [
    [
      "expo-notifications",
      {
        icon: "./assets/notification-icon.png",
        color: "#ffffff",
      },
    ],
    [
      "expo-image-picker",
      {
        photosPermission:
          "The app accesses your photos to let you set background in flipnote",
      },
    ],
    [
      "expo-document-picker",
      {
        iCloudContainerEnvironment: "Production",
      },
    ],
    "expo-font",
  ],
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.eusebiu.flipnote",
  },
  android: {
    package: "com.eusebiu.flipnote",
    // intentFilters: [
    //   {
    //     action: "VIEW",
    //     data: [
    //       {
    //         scheme: "flipnote",
    //         host: "note",
    //         pathPrefix: "/",
    //       },
    //     ],
    //     category: ["BROWSABLE", "DEFAULT"],
    //   },
    // ],
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#FEFFEF",
    },
  },
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  extra: {
    eas: {
      projectId: "a675bde6-7808-4412-8a6a-a2733a9f2f2f",
    },
  },
  owner: "eusebiu365",
  build: {
    preview: {
      android: {
        buildType: "apk",
      },
    },
    preview2: {
      android: {
        gradleCommand: ":app:assembleRelease",
      },
    },
    preview3: {
      developmentClient: true,
    },
    production: {},
  },
};
