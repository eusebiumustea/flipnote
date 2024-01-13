import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useRecoilState } from "recoil";
import { Home, NotePage, notesData } from "../screens";
import { Screen1, Screen2 } from "../screens/inbox/screens";
import { useTheme } from "../hooks";
export function AppRouting() {
  const Stack = createNativeStackNavigator();
  const [notes, setNotes] = useRecoilState(notesData);
  const theme = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        freezeOnBlur: true,
        gestureEnabled: false,
        animation: "none",
        presentation: "containedTransparentModal",
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

      <Stack.Screen component={Screen1} name="screen1" />
      <Stack.Screen component={Screen2} name="screen2" />
    </Stack.Navigator>
  );
}
