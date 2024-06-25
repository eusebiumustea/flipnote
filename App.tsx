import "react-native-gesture-handler";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RecoilRoot } from "recoil";
import { AppRoot } from "./app-root";
import { ToastProvider } from "./components";
import { LoadingDialog } from "./contexts/loading-dialog";
import { ThemeProvider } from "./hooks";
SplashScreen.preventAutoHideAsync();

export default function App() {
  return (
    <RecoilRoot>
      <ThemeProvider>
        <SafeAreaProvider>
          <ToastProvider>
            <LoadingDialog>
              <AppRoot />
            </LoadingDialog>
          </ToastProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </RecoilRoot>
  );
}
