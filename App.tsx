import "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppRouting } from "./app-routing";
import { StatusBarController, ThemeProvider } from "./tools";
import { NavigationContainer } from "@react-navigation/native";
import { RecoilRoot } from "recoil";
export default function App() {
  return (
    <RecoilRoot>
      <NavigationContainer>
        <ThemeProvider>
          <SafeAreaProvider>
            <StatusBarController />
            <AppRouting />
          </SafeAreaProvider>
        </ThemeProvider>
      </NavigationContainer>
    </RecoilRoot>
  );
}
