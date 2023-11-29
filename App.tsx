import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";
import { Dimensions, View } from "react-native";
import "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RecoilRoot } from "recoil";
import { AppRouting } from "./app-routing";
import { ToastProvider } from "./components";
import { StatusBarController, ThemeProvider } from "./tools";
import { NotificationReceivedProvider } from "./components/notification-received-provider";
import { AppStorageContext } from "./components/app-storage-context";
SplashScreen.preventAutoHideAsync();
export default function App() {
  const [fontLoaded] = useFonts({
    "google-sans": require("./assets/fonts/OpenSans-VariableFont_wdthwght.ttf"),
  });
  const onLayoutRootView = useCallback(async () => {
    if (fontLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontLoaded]);
  if (!fontLoaded) {
    return null;
  }
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      priority: Notifications.AndroidNotificationPriority.MAX,
    }),
  });

  return (
    <RecoilRoot>
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <AppStorageContext>
          <ThemeProvider>
            <NotificationReceivedProvider>
              <NavigationContainer>
                <SafeAreaProvider>
                  <StatusBarController />
                  <ToastProvider>
                    <AppRouting />
                  </ToastProvider>
                </SafeAreaProvider>
              </NavigationContainer>
            </NotificationReceivedProvider>
          </ThemeProvider>
        </AppStorageContext>
      </View>
    </RecoilRoot>
  );
}
