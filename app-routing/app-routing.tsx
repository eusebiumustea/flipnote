import { TransitionSpecs, createStackNavigator } from "@react-navigation/stack";
import { useRecoilState } from "recoil";
import { Home, Inbox, NotePage, currentPosition, notesData } from "../screens";
import { moderateScale, verticalScale } from "../tools";
import { enableFreeze } from "react-native-screens";
enableFreeze();
export function AppRouting() {
  const [position, setPosition] = useRecoilState(currentPosition);
  const Stack = createStackNavigator();
  const [notes, setNotes] = useRecoilState(notesData);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardOverlayEnabled: true,
        detachPreviousScreen: true,
        transitionSpec: {
          open: TransitionSpecs.TransitionIOSSpec,
          close: TransitionSpecs.TransitionIOSSpec,
        },
      }}
      initialRouteName="Home"
    >
      <Stack.Screen component={Home} name="Home" />
      <Stack.Screen
        options={{
          cardStyleInterpolator: ({
            current,
            layouts: {
              screen: { width, height },
            },
          }) => ({
            overlayStyle: {
              opacity: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.7],
              }),
            },

            cardStyle: {
              // opacity: current.progress,
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [
                      -width / 2 + width / 4.3 + position.relativeX,
                      0,
                    ],
                  }),
                },
                {
                  translateY: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [
                      -height / 2 + verticalScale(125) + position.relativeY,
                      0,
                    ],
                  }),
                },
                {
                  scale: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.7, 1],
                  }),
                },
                {
                  scaleX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.57, 1],
                  }),
                },
                {
                  scaleY: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.4, 1],
                  }),
                },
              ],
            },
          }),
        }}
        initialParams={{
          id: notes.data.length + 1,
        }}
        component={NotePage}
        name="note"
      />
      <Stack.Screen
        options={{
          cardStyleInterpolator: ({
            current,
            layouts: {
              screen: { width, height },
            },
          }) => ({
            overlayStyle: {
              opacity: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.7],
              }),
            },
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [
                      -width / 2 + position.relativeX - moderateScale(22),
                      0,
                    ],
                  }),
                },
                {
                  translateY: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [
                      -height / 2 + position.relativeY - verticalScale(27),
                      0,
                    ],
                  }),
                },
                {
                  scale: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                  }),
                },
              ],
            },
          }),
        }}
        component={NotePage}
        name="note-init"
      />

      <Stack.Screen
        component={Inbox}
        options={{
          cardStyleInterpolator: ({
            current,
            layouts: {
              screen: { width, height },
            },
          }) => ({
            overlayStyle: {
              opacity: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.6],
              }),
            },
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-width / 2 + position.relativeX, 0],
                  }),
                },
                {
                  translateY: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-height / 2 + position.relativeY + 10, 0],
                  }),
                },
                {
                  scale: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                  }),
                },
              ],
            },
          }),
        }}
        name="inbox"
      />
    </Stack.Navigator>
  );
}
