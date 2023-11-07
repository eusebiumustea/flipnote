import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NotePageCreate, NotePageEdit, Home, Inbox } from "../screens";

export function AppRouting() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        // headerShown: false,
        // header: () => null,
        headerShown: false,
        // headerTransparent: true,
        animation: "none",
      }}
      initialRouteName="Home"
    >
      <Stack.Screen component={Home} name="Home" />
      <Stack.Screen component={NotePageEdit} name="Edit-note" />
      <Stack.Screen component={NotePageCreate} name="Create-note" />
      <Stack.Screen component={Inbox} name="Inbox" />
    </Stack.Navigator>
  );
}
