import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { enableFreeze } from "react-native-screens";
import { useRecoilState } from "recoil";
import { Home, Inbox, NotePage, notesData } from "../screens";
import { Platform } from "react-native";
enableFreeze(true);

export function AppRouting() {
  const Stack = createNativeStackNavigator();
  const [notes] = useRecoilState(notesData);
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: Platform.OS === "android" ? "slide_from_bottom" : "default",

        gestureEnabled: false,
        navigationBarColor: "#000",
        contentStyle: { elevation: 10 },
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
