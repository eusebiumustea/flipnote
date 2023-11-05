import { NavigationContainer } from "@react-navigation/native";
import "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RecoilRoot } from "recoil";
import { AppRouting } from "./app-routing";
import { AppStorageContext } from "./components/app-storage-context";
import { StatusBarController, ThemeProvider } from "./tools";
export default function App() {
  return (
    <RecoilRoot>
      <AppStorageContext />
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
