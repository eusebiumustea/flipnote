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
        received.length > 0 && (
          <>
            <Text
              style={{
                color: theme.onPrimary,
                fontSize: moderateFontScale(20),
                paddingTop: 16,
              }}
            >
              Received notifications
            </Text>
            <View style={{ flexDirection: "row" }}>
              <Button onPress={() => setReceived([])}>Clear all</Button>
            </View>
          </>
        )
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
