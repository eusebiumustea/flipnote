import { loadAsync } from "expo-font";
import * as Notifications from "expo-notifications";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppRouting } from "./app-routing";
import { ToastProvider } from "./components";
import { AppStorageContext } from "./contexts";
import { LoadingDialog } from "./contexts/loading-dialog";
import { ThemeProvider } from "./hooks";
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
      "OpenSans-Bold": require("./assets/fonts/OpenSans-Bold.ttf"),
      "OpenSans-Italic": require("./assets/fonts/OpenSans-Italic.ttf"),
      "OpenSans-BoldItalic": require("./assets/fonts/OpenSans-BoldItalic.ttf"),
      Tinos: require("./assets/fonts/Tinos.ttf"),
      "Tinos-Bold": require("./assets/fonts/Tinos-Bold.ttf"),
      "Tinos-Italic": require("./assets/fonts/Tinos-Italic.ttf"),
      "Tinos-BoldItalic": require("./assets/fonts/Tinos-BoldItalic.ttf"),
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
      <ThemeProvider>
        <SafeAreaProvider>
          <ToastProvider>
            <LoadingDialog>
              <AppStorageContext>
                <StatusBarController />
                <AppRouting />
              </AppStorageContext>
            </LoadingDialog>
          </ToastProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    );
  }
}
