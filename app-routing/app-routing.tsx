import { NavigationContainer } from "@react-navigation/native";
import {
  CardStyleInterpolators,
  TransitionPresets,
  createStackNavigator,
} from "@react-navigation/stack";
import { Platform, useWindowDimensions } from "react-native";
import { enableFreeze } from "react-native-screens";
import { useTheme } from "../hooks";
import { Home } from "../screens/home";
import { Inbox } from "../screens/inbox";
import { NotePage } from "../screens/note/note-page";
import { note_options } from "./route-options";
enableFreeze(true);
const Stack = createStackNavigator();
export function AppRouting() {
  const { width, height } = useWindowDimensions();
  const theme = useTheme();
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={(e: any) => ({
          headerShown: false,
          detachPreviousScreen: true,
          cardOverlayEnabled: true,
          animationEnabled:
            e.route.params?.animationEnabled === false ? false : true,
        })}
        initialRouteName="home"
      >
        <Stack.Screen component={Home} name="home" />

        <Stack.Screen
          options={note_options(width, height, theme)}
          component={NotePage}
          name="note"
        />
        <Stack.Screen
          component={Inbox}
          options={{
            headerShown: true,
            title: "Inbox",
            headerTitleAlign: "center",
            headerMode: "screen",
            detachPreviousScreen: false,
            headerBackTitleVisible: false,
            headerStyle: {
              backgroundColor: theme.background,
              borderWidth: 0,
            },

            headerTintColor: theme.onBackground,
            headerShadowVisible: false,
            gestureDirection: Platform.OS === "ios" ? "vertical" : "horizontal",
            gestureEnabled: true,
            transitionSpec:
              TransitionPresets.ModalPresentationIOS.transitionSpec,
            cardStyleInterpolator:
              Platform.OS === "ios"
                ? CardStyleInterpolators.forModalPresentationIOS
                : CardStyleInterpolators.forHorizontalIOS,
          }}
          name="inbox"
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
