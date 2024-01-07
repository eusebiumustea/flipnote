// import { LinkingOptions, NavigationContainer } from "@react-navigation/native";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect } from "react";
import "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RecoilRoot } from "recoil";
import { AppRouting } from "./app-routing";
import { LoadingProvider, ToastProvider } from "./components";
import { AppStorageContext } from "./components/app-storage-context";
import { StatusBarController } from "./tools";
import { ThemeProvider } from "./hooks";
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
    OpenSans: require("./assets/fonts/OpenSans-VariableFont_wdthwght.ttf"),
    "OpenSans-bold": require("./assets/fonts/OpenSans-Bold.ttf"),
    "OpenSans-italic": require("./assets/fonts/OpenSans-Italic.ttf"),
    "OpenSans-bold-italic": require("./assets/fonts/OpenSans-BoldItalic.ttf"),
    Tinos: require("./assets/fonts/Tinos-Regular.ttf"),
    "Tinos-bold": require("./assets/fonts/Tinos-Bold.ttf"),
    "Tinos-italic": require("./assets/fonts/Tinos-Italic.ttf"),
    "Tinos-bold-italic": require("./assets/fonts/Tinos-BoldItalic.ttf"),
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
