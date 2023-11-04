import "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppRouting } from "./app-routing";
import { StatusBarController, ThemeProvider } from "./tools";
import { NavigationContainer } from "@react-navigation/native";
import { RecoilRoot } from "recoil";
import { GestureHandlerRootView } from "react-native-gesture-handler";
export default function App() {
  return (
    <RecoilRoot>
      <ThemeProvider>
        <NavigationContainer>
          <SafeAreaProvider>
            <StatusBarController />
            <AppRouting />
          </SafeAreaProvider>
        </NavigationContainer>
      </ThemeProvider>
    </RecoilRoot>
  );
}
