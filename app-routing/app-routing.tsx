import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home } from "../screens/home";
import { Inbox } from "../screens/inbox";

export function AppRouting() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "none",
      }}
      initialRouteName="home"
    >
      <Stack.Screen component={Home} name="home" />
      <Stack.Screen component={Inbox} name="inbox" />
    </Stack.Navigator>
  );
}
