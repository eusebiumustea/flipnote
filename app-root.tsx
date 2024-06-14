import * as Notifications from "expo-notifications";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { AppRouting } from "./app-routing";
import { ToastProvider } from "./components";
import { LoadingDialog } from "./contexts/loading-dialog";
import { ThemeProvider } from "./hooks";
import { useRequest } from "./hooks/use-request";
import { StatusBarController } from "./utils";
import { loadAsync } from "expo-font";
import { SafeAreaProvider } from "react-native-safe-area-context";
export function AppRoot() {
  const { syncState } = useRequest();
  const [appIsReady, setAppIsReady] = useState(false);
  async function registerNotifications() {
    let { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
  }
  async function getAppResources() {
    try {
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
      setAppIsReady(true);

      await syncState();
    } catch (error) {
    } finally {
      await SplashScreen.hideAsync();
    }
  }
  useEffect(() => {
    getAppResources();
    registerNotifications();
  }, []);
  // useEffect(() => {
  //   syncState();
  // }, []);
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
              <StatusBarController />
              <AppRouting />
            </LoadingDialog>
          </ToastProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    );
  }
}
