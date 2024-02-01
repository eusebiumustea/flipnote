import { useNavigation, useRoute } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Easing, useWindowDimensions, Text } from "react-native";
import { enableFreeze } from "react-native-screens";
import { useRecoilValue } from "recoil";
import { useTheme } from "../hooks";
import { Inbox, elementCoordinatesValue } from "../screens";
import { Home } from "../screens/home";
import { NotePage } from "../screens/note/note-page";
import { moderateScale, verticalScale } from "../tools";
import { TransitionInterpolator } from "./transition-interpolator";

enableFreeze();
export function AppRouting() {
  const elementCoordinates = useRecoilValue(elementCoordinatesValue);
  const Stack = createStackNavigator();
  const { width, height } = useWindowDimensions();
  const theme = useTheme();
  const nav = useNavigation();
  let currentId;
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
              scale: 1,
              scaleX: (width / 2 - 16) / width,
              scaleY: verticalScale(250) / height,
              y: verticalScale(125) + elementCoordinates.relativeY,
              x: elementCoordinates.relativeX + (width / 2 - 16) / 2,
            },
          }),
        }}
        component={NotePage}
        name="note"
      />
      <Stack.Screen
        options={{
          cardStyleInterpolator: TransitionInterpolator({
            initial: {
              scale: 0,
              y: elementCoordinates.relativeY - moderateScale(20),
              x: elementCoordinates.relativeX - moderateScale(20),
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
          title: "Inbox",
          headerTitleAlign: "center",
          headerMode: "screen",
          headerStyle: { backgroundColor: theme.background, borderWidth: 0 },
          headerTintColor: theme.onBackground,
          headerShadowVisible: false,
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
    </Stack.Navigator>
  );
}
