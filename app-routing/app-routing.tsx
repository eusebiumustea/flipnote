import {
  CardStyleInterpolators,
  TransitionPresets,
  createStackNavigator,
} from "@react-navigation/stack";
import { Easing, Platform, useWindowDimensions } from "react-native";
import { enableFreeze } from "react-native-screens";
import { useTheme } from "../hooks";
import { ImagePreview } from "../screens";
import { Home } from "../screens/home";
import { Inbox } from "../screens/inbox";
import { NotePage } from "../screens/note/note-page";
import { moderateScale, verticalScale } from "../utils";
import { TransitionInterpolator } from "./transition-interpolator";
enableFreeze(true);
export function AppRouting() {
  const Stack = createStackNavigator();
  const { width, height } = useWindowDimensions();
  const theme = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardOverlayEnabled: true,
        detachPreviousScreen: true,
        transitionSpec: {
          open: TransitionPresets.DefaultTransition.transitionSpec.open,
          close: {
            animation: "timing",
            config: { duration: 120, easing: Easing.out(Easing.linear) },
          },
        },
      }}
      initialRouteName="Home"
    >
      <Stack.Screen component={Home} name="Home" />
      <Stack.Screen
        component={ImagePreview}
        name="image-preview"
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
        }}
      />

      <Stack.Screen
        options={({ route }: any) =>
          ({
            cardStyleInterpolator: TransitionInterpolator({
              initial: {
                scale: 1,
                scaleX: (width / 2 - 16) / width,
                scaleY: verticalScale(250) / height,
                y: verticalScale(125) + route.params.relativeY,
                x: (width / 2 - 16) / 2 + route.params.relativeX,
              },
            }),
          } as unknown)
        }
        component={NotePage}
        name="note"
      />
      <Stack.Screen
        options={({ route }: any) =>
          ({
            cardStyleInterpolator: TransitionInterpolator({
              initial: {
                scale: 0,
                y: route.params.relativeY + verticalScale(40),
                x: route.params.relativeX + moderateScale(40),
              },
            }),
          } as unknown)
        }
        component={NotePage}
        name="note-init"
      />

      <Stack.Screen
        component={Inbox}
        options={{
          headerShown: true,
          detachPreviousScreen: Platform.OS === "android",
          title: "Inbox",
          headerTitleAlign: "center",
          headerMode: "screen",
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: theme.background,
            borderWidth: 0,
          },
          headerTintColor: theme.onBackground,
          headerShadowVisible: false,
          gestureDirection: "vertical",
          gestureEnabled: true,
          cardStyleInterpolator:
            Platform.OS === "ios"
              ? CardStyleInterpolators.forModalPresentationIOS
              : CardStyleInterpolators.forVerticalIOS,
        }}
        name="inbox"
      />
    </Stack.Navigator>
  );
}
