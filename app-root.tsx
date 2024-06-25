import { loadAsync } from "expo-font";
import * as Notifications from "expo-notifications";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { AppRouting } from "./app-routing";
import { AppStorageContext } from "./contexts";
import { StatusBarController } from "./utils";
export function AppRoot() {
  const [appIsReady, setAppIsReady] = useState(false);
  async function registerNotifications() {
    let { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
  }
  async function loadFonts() {
    await loadAsync({
      OpenSans: require("./assets/fonts/OpenSans.ttf"),
    });
  }
  async function getAppReady() {
    try {
      await loadFonts();
      setAppIsReady(true);
      setTimeout(async () => {
        await SplashScreen.hideAsync();
      }, 200);
    } catch {}
  }
  useEffect(() => {
    getAppReady();
    registerNotifications();
  }, []);
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      priority: Notifications.AndroidNotificationPriority.MAX,
    }),
  });
  if (appIsReady) {
    return (
      <AppStorageContext>
        <StatusBarController />
        <AppRouting />
      </AppStorageContext>
    );
  }
}
