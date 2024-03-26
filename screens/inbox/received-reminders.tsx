import { Text, View } from "react-native";
import { useRecoilState } from "recoil";
import { Button, NoteCard } from "../../components";
import { useTheme } from "../../hooks";
import { moderateFontScale, verticalScale } from "../../tools";
import { EMPTY_NOTE_STATE, receivedNotifications } from "../note";

export function ReceivedReminders() {
  const theme = useTheme();
  const [received, setReceived] = useRecoilState(receivedNotifications);
  return (
    <>
      {received.length > 0 && (
        <Text
          style={{
            color: theme.onPrimary,
            fontSize: moderateFontScale(20),
            paddingTop: 16,
          }}
        >
          Received notifications
        </Text>
      )}
      {received.length > 0 && (
        <View style={{ flexDirection: "row" }}>
          <Button onPress={() => setReceived([])}>Clear all</Button>
        </View>
      )}

      {received.map((item, i) => {
        return (
          <NoteCard
            key={i}
            containerStyle={{ width: "100%", height: verticalScale(125) }}
            item={{
              ...EMPTY_NOTE_STATE,
              title: item.title,
              text: item.content,
            }}
          />
        );
      })}
    </>
  );
}
