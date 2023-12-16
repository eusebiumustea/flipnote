// import { LinkingOptions, NavigationContainer } from "@react-navigation/native";
import "react-native-gesture-handler";
import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect } from "react";
import { Linking, Platform, View } from "react-native";
import "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RecoilRoot } from "recoil";
import { AppRouting } from "./app-routing";
import { LoadingProvider, ToastProvider } from "./components";
import { AppStorageContext } from "./components/app-storage-context";
import { StatusBarController, ThemeProvider } from "./tools";
import { NavigationContainer } from "@react-navigation/native";
SplashScreen.preventAutoHideAsync();
export default function App() {
  useEffect(() => {
    async function registerNotifications() {
      let { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
    }
    registerNotifications();
  }, []);
  const [fontLoaded, error] = useFonts({
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

  return (
    <RecoilRoot>
      <SafeAreaProvider onLayout={onLayoutRootView}>
        <ToastProvider>
          <LoadingProvider>
            <AppStorageContext>
              <ThemeProvider>
                <NavigationContainer>
                  <StatusBarController />
                  <AppRouting />
                </NavigationContainer>
              </ThemeProvider>
            </AppStorageContext>
          </LoadingProvider>
        </ToastProvider>
      </SafeAreaProvider>
    </RecoilRoot>
  );
}
function toast(arg0: {
  message: string;
  button: { title: string; onPress(): void };
}) {
  throw new Error("Function not implemented.");
}
