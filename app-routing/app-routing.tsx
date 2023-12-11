import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { enableFreeze } from "react-native-screens";
import { useRecoilState } from "recoil";
import { Home, Inbox, NotePage, notesData } from "../screens";
enableFreeze(true);

export function AppRouting() {
  const Stack = createNativeStackNavigator();
  const [notes] = useRecoilState(notesData);
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "default",
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
