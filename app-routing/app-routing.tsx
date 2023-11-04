import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home } from "../screens/home";
import { Inbox } from "../screens/inbox";
import { NotePageEdit } from "../screens/note/note-page-edit";
import { NotePageCreate } from "../screens/note";

export function AppRouting() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={
        {
          // headerShown: false,
          // header: () => null,
          // headerShown: false,
          // headerTransparent: true,
          // animation: "none",
        }
      }
      initialRouteName="Home"
    >
      <Stack.Screen component={NotePageEdit} name="Edit-note" />
      <Stack.Screen component={NotePageCreate} name="Create-note" />
      <Stack.Screen component={Home} name="Home" />

      <Stack.Screen component={Inbox} name="Inbox" />
    </Stack.Navigator>
  );
}
