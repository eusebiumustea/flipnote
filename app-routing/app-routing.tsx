import { createStackNavigator } from "@react-navigation/stack";
import { Easing } from "react-native-reanimated";
import { enableFreeze } from "react-native-screens";
import { useRecoilState } from "recoil";
import { Home, Inbox, NotePage, notesData } from "../screens";
import { NotePageRework } from "../screens/note/note-page-reworked";
enableFreeze(true);

export function AppRouting() {
  const Stack = createStackNavigator();
  const [notes] = useRecoilState(notesData);
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        freezeOnBlur: true,
        transitionSpec: {
          open: {
            animation: "timing",
            config: { duration: 180, easing: Easing.inOut(Easing.ease) },
          },
          close: {
            animation: "timing",
            config: { duration: 180, easing: Easing.inOut(Easing.ease) },
          },
        },
        cardOverlayEnabled: true,
        cardStyleInterpolator: ({ current, layouts }) => ({
          cardStyle: {
            opacity: current.progress,
            transform: [
              {
                translateX: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [layouts.screen.width, 0],
                }),
              },
            ],
          },
        }),
        gestureEnabled: false,
      }}
      initialRouteName="Home"
    >
      <Stack.Screen component={Home} name="Home" />
      <Stack.Screen
        initialParams={{
          id: notes.data.length + 1,
        }}
        component={NotePage}
        name="note"
      />
      <Stack.Screen component={Inbox} name="Inbox" />
    </Stack.Navigator>
  );
}
