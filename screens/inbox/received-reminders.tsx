import { FlatList, Text, View } from "react-native";
import { useRecoilState } from "recoil";
import { Button, NoteCard } from "../../components";
import { useTheme } from "../../hooks";
import { moderateFontScale, verticalScale } from "../../utils";
import { EMPTY_NOTE_STATE, receivedNotifications } from "../note";

export function ReceivedReminders() {
  const theme = useTheme();
  const [received, setReceived] = useRecoilState(receivedNotifications);
  return (
    <FlatList
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingVertical: verticalScale(10),
        rowGap: 8,
        paddingBottom: 30,
      }}
      style={{
        backgroundColor: theme.background,
        flex: 1,
      }}
      ListHeaderComponent={
        <>
          <Text
            style={{
              color: theme.onPrimary,
              fontSize: moderateFontScale(17),
              fontFamily: "OpenSans",
            }}
          >
            Recent notifications:
          </Text>
          {received.length > 0 && (
            <View style={{ flexDirection: "row" }}>
              <Button onPress={() => setReceived([])}>Clear all</Button>
            </View>
          )}
        </>
      }
      data={received}
      keyExtractor={(_, i) => i.toString()}
      renderItem={({ item }) => (
        <NoteCard
          containerStyle={{ width: "100%", height: verticalScale(170) }}
          item={{
            ...EMPTY_NOTE_STATE,
            title: item.title,
            text: item.content,
          }}
        />
      )}
    />
  );
}
