import {
  CardStyleInterpolators,
  TransitionPresets,
  TransitionSpecs,
  createStackNavigator,
} from "@react-navigation/stack";
import { Easing, useWindowDimensions } from "react-native";
import { enableFreeze } from "react-native-screens";
import { useTheme } from "../hooks";
import { ImagePreview, Inbox } from "../screens";
import { Home } from "../screens/home";
import { NotePage } from "../screens/note/note-page";
import { moderateScale, verticalScale } from "../utils";
import { TransitionInterpolator } from "./transition-interpolator";
interface OptionsRoute {
  route: {
    params: {
      id: number;
      relativeX: number;
      relativeY: number;
    };
  };
}
enableFreeze();
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
        gestureVelocityImpact: 0.5,
        transitionSpec: {
          open: TransitionPresets.DefaultTransition.transitionSpec.open,
          close: {
            animation: "timing",
            config: { duration: 160, easing: Easing.out(Easing.linear) },
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
        options={({ route }: any) =>
          ({
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
                y: route.params.relativeY,
                x: route.params.relativeX + 15,
              },
            }),
          } as unknown)
        }
        name="inbox"
      />
    </Stack.Navigator>
  );
}
