import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Profiler } from "react";
import { enableFreeze } from "react-native-screens";
import { Home, Inbox, NotePage, notesData } from "../screens";
import { useRecoilState } from "recoil";
enableFreeze();
export function AppRouting() {
  const Stack = createNativeStackNavigator();
  function HomePageRenderInfo() {
    return (
      <Profiler
        id="render"
        onRender={(actualDuration, baseDuration, startTime, commitTime) =>
          console.log(startTime)
        }
      >
        <Home />
      </Profiler>
    );
  }
  function NotePageRenderInfo({ route }: any) {
    const { item }: any = route.params;
    return (
      <Profiler
        id="render"
        onRender={(actualDuration, baseDuration, startTime, commitTime) =>
          console.log(baseDuration, commitTime)
        }
      >
        <NotePage route={{ params: { item } }} />
      </Profiler>
    );
  }
  const [notes, setNotes] = useRecoilState(notesData);
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
          edit: false,
        }}
        component={NotePage}
        name="note"
      />
      <Stack.Screen component={Inbox} name="Inbox" />
    </Stack.Navigator>
  );
}
