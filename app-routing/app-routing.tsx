import { createStackNavigator } from "@react-navigation/stack";
import { Easing, View, useWindowDimensions } from "react-native";
import { enableFreeze } from "react-native-screens";
import { useRecoilState } from "recoil";
import { Inbox, currentElementCoordinates } from "../screens";
import { Home } from "../screens/home";
import { NotePage } from "../screens/note/note-page";
import { moderateScale, verticalScale } from "../tools";
import { TransitionInterpolator } from "./transition-interpolator";
import { BlurView } from "expo-blur";
import { StyleChanges } from "../screens/note/style-changes";

enableFreeze();
export function AppRouting() {
  const [elementCoordinates] = useRecoilState(currentElementCoordinates);
  const Stack = createStackNavigator();
  const { width } = useWindowDimensions();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardOverlayEnabled: true,
        detachPreviousScreen: true,
        transitionSpec: {
          open: {
            animation: "timing",
            config: { duration: 300, easing: Easing.inOut(Easing.ease) },
          },
          close: {
            animation: "timing",
            config: { duration: 300, easing: Easing.inOut(Easing.ease) },
          },
        },
      }}
      initialRouteName="Home"
    >
      <Stack.Screen component={Home} name="Home" />
      <Stack.Screen
        options={{
          gestureEnabled: false,
          cardStyleInterpolator: TransitionInterpolator({
            initial: {
              scale: 0.68,
              scaleX: 0.65,
              scaleY: 0.41,
              y: verticalScale(125) + elementCoordinates.relativeY,
              x: elementCoordinates.relativeX + width / 4.3,
            },
          }),
        }}
        component={NotePage}
        name="note"
      />
      <Stack.Screen
        options={{
          gestureEnabled: false,
          cardStyleInterpolator: TransitionInterpolator({
            initial: {
              scale: 0,
              y: elementCoordinates.relativeY - verticalScale(27),
              x: elementCoordinates.relativeX - moderateScale(22),
            },
          }),
        }}
        initialParams={{
          id: new Date().getTime(),
        }}
        component={NotePage}
        name="note-init"
      />

      <Stack.Screen
        component={Inbox}
        options={{
          headerShown: true,
          title: "Notifications",
          headerTitleAlign: "center",
          headerShadowVisible: true,

          cardStyleInterpolator: TransitionInterpolator({
            initial: {
              scale: 0,
              scaleX: 0.7,
              scaleY: 0.7,
              y: elementCoordinates.relativeY + 10,
              x: elementCoordinates.relativeX,
            },
          }),
        }}
        name="inbox"
      />
      <Stack.Screen
        component={StyleChanges}
        options={{
          headerShown: true,
          title: "Text design changes",
          headerTitleAlign: "center",

          cardStyleInterpolator: TransitionInterpolator({
            initial: {
              scale: 0,
              scaleX: 0.7,
              scaleY: 0.7,
              y: elementCoordinates.relativeY + 10,
              x: elementCoordinates.relativeX,
            },
          }),
        }}
        name="style-changes"
      />
    </Stack.Navigator>
  );
}
