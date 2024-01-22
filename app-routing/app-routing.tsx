import { createStackNavigator } from "@react-navigation/stack";
import { Easing } from "react-native-reanimated";
import { enableFreeze } from "react-native-screens";
import { useRecoilState } from "recoil";
import { Inbox, currentElementCoordinates } from "../screens";
import { Home } from "../screens/home";
import { NotePage } from "../screens/note/note-page";
import { moderateScale, verticalScale } from "../tools";
import { TransitionInterpolator } from "./transition-interpolator";
import { useWindowDimensions } from "react-native";

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
        initialParams={{
          id: new Date().getTime(),
        }}
        component={NotePage}
        name="note"
      />
      <Stack.Screen
        options={{
          cardStyleInterpolator: TransitionInterpolator({
            initial: {
              scale: 0,
              // scaleX: 0.65,
              // scaleY: 0.41,
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
          cardStyleInterpolator: TransitionInterpolator({
            initial: {
              scale: 0,
              scaleX: 0.6,
              scaleY: 0.6,
              y: elementCoordinates.relativeY + 10,
              x: elementCoordinates.relativeX,
            },
          }),
        }}
        name="inbox"
      />
    </Stack.Navigator>
  );
}
