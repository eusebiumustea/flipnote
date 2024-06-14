import * as SplashScreen from "expo-splash-screen";
import "react-native-gesture-handler";
import { RecoilRoot } from "recoil";
import { AppRoot } from "./app-root";
SplashScreen.preventAutoHideAsync();

export default function App() {
  // const [fontsLoaded, fontError] = useFonts({
  //   OpenSans: require("./assets/fonts/OpenSans.ttf"),
  //   "OpenSans-Bold": require("./assets/fonts/OpenSans-Bold.ttf"),
  //   "OpenSans-Italic": require("./assets/fonts/OpenSans-Italic.ttf"),
  //   "OpenSans-BoldItalic": require("./assets/fonts/OpenSans-BoldItalic.ttf"),
  //   Tinos: require("./assets/fonts/Tinos.ttf"),
  //   "Tinos-Bold": require("./assets/fonts/Tinos-Bold.ttf"),
  //   "Tinos-Italic": require("./assets/fonts/Tinos-Italic.ttf"),
  //   "Tinos-BoldItalic": require("./assets/fonts/Tinos-BoldItalic.ttf"),
  // });

  // const onLayoutRootView = useCallback(async () => {
  //   if (!fontsLoaded && !fontError) {
  //   console.log('error');

  // }
  //   if (fontsLoaded || fontError) {
  //     await SplashScreen.hideAsync();
  //   }
  // }, [fontsLoaded, fontError]);

  return (
    <RecoilRoot>
      <AppRoot />
    </RecoilRoot>
  );
}
