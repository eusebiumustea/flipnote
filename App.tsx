import { NavigationContainer } from "@react-navigation/native";
import { Dimensions, View } from "react-native";
import "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RecoilRoot } from "recoil";
import { AppRouting } from "./app-routing";
import { AppStorageContext } from "./components/app-storage-context";
import { StatusBarController, ThemeProvider } from "./tools";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useCallback } from "react";
import { ToastProvider } from "./components";
const initialScreenSize = JSON.stringify(Dimensions.get("screen"));
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
  // useEffect(() => {
  //   const subscription = Dimensions.addEventListener("change", ({ screen }) => {
  //     setState(JSON.stringify(screen));
  //     console.log(JSON.stringify(screen));
  //   });
  //   return () => {
  //     subscription.remove();
  //   };
  // }, []);

  return (
    <RecoilRoot>
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <AppStorageContext>
          <ThemeProvider>
            <NavigationContainer>
              <SafeAreaProvider>
                <StatusBarController />
                <ToastProvider>
                  <AppRouting />
                </ToastProvider>
              </SafeAreaProvider>
            </NavigationContainer>
          </ThemeProvider>
        </AppStorageContext>
      </View>
    </RecoilRoot>
  );
}
