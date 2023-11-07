import { NavigationContainer } from "@react-navigation/native";
import "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RecoilRoot } from "recoil";
import { AppRouting } from "./app-routing";
import { AppStorageContext } from "./components/app-storage-context";
import { StatusBarController, ThemeProvider } from "./tools";
import { Dimensions, LayoutAnimation } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { useDimensionsChange } from "react-native-responsive-dimensions";
const initialScreenSize = JSON.stringify(Dimensions.get("screen"));
export default function App() {
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
      <AppStorageContext>
        <ThemeProvider>
          <NavigationContainer>
            <SafeAreaProvider>
              <StatusBarController />
              <AppRouting />
            </SafeAreaProvider>
          </NavigationContainer>
        </ThemeProvider>
      </AppStorageContext>
    </RecoilRoot>
  );
}
