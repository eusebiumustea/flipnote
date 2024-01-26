import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Screen1, Screen2 } from "../screens/inbox/screens-test";

export function AppRoutingNative() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: "none" }}
      initialRouteName="screen1"
    >
      <Stack.Screen component={Screen1} name="screen1" />
      <Stack.Screen component={Screen2} name="screen2" />
    </Stack.Navigator>
  );
}
