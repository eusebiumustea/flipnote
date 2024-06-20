import * as FileSystem from "expo-file-system";
import * as Notifications from "expo-notifications";
import { useMemo } from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useRecoilState, useRecoilValue } from "recoil";
import { NoteCard } from "../../components";
import { NOTES_PATH } from "../../constants";
import { useTheme } from "../../hooks";
import { useRequest } from "../../hooks/use-request";
import { dateTime, moderateFontScale, verticalScale } from "../../utils";
import { notesValue, receivedNotifications } from "../note";
export async function removeReceivedReminder(id: number) {
  await Notifications.cancelScheduledNotificationAsync(id.toString());
  const data = await FileSystem.readAsStringAsync(`${NOTES_PATH}/${id}`);
  const parsedNote = JSON.parse(data);
  await FileSystem.writeAsStringAsync(
    `${NOTES_PATH}/${id}`,
    JSON.stringify({ ...parsedNote, reminder: null })
  );
}
export function UpcomingReminders() {
  const [received] = useRecoilState(receivedNotifications);
  const notes = useRecoilValue(notesValue);
  const theme = useTheme();
  const upcomingNotifications = useMemo(() => {
    return notes.filter((e) => e.reminder && new Date() < new Date(e.reminder));
  }, [notes]);
  const { updateNote } = useRequest();
  const { width } = useWindowDimensions();
  const renderHeader = useMemo(() => {
    if (upcomingNotifications.length > 0) {
      <Text
        style={{
          color: theme.onPrimary,
          fontSize: moderateFontScale(18),
        }}
      >
        Upcoming
      </Text>;
    }
    if (upcomingNotifications.length === 0 && received.length === 0) {
      return (
        <Text
          style={{
            color: theme.onPrimary,
            fontSize: moderateFontScale(17),
            textAlign: "center",
            fontFamily: "OpenSans",
            paddingTop: 16,
          }}
        >
          No upcoming notifications
        </Text>
      );
    }
  }, [upcomingNotifications, received]);
  return (
    <FlatList
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingVertical: verticalScale(10),
        paddingBottom: 30,
      }}
      style={{
        backgroundColor: theme.background,
        flex: 1,
      }}
      ListHeaderComponent={renderHeader}
      data={upcomingNotifications}
      keyExtractor={(_, i) => i.toString()}
      renderItem={({ item }) => {
        const reminder = new Date(item.reminder);

        return (
          <>
            <NoteCard
              containerStyle={{ width: width - 32, height: "auto" }}
              item={item}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                alignItems: "center",
                marginVertical: 12,
              }}
            >
              <TouchableOpacity
                onPress={async () => {
                  await removeReceivedReminder(item.id);
                  await updateNote(item.id);
                }}
              >
                <Text
                  style={{
                    color: "red",
                    fontSize: moderateFontScale(16),
                    fontFamily: "OpenSans",
                    fontWeight: "bold",
                  }}
                >
                  Cencel
                </Text>
              </TouchableOpacity>
              <Text
                style={{
                  color: theme.onPrimary,

                  fontSize: moderateFontScale(15),
                }}
              >
                {dateTime(reminder)}
              </Text>
            </View>
          </>
        );
      }}
    />
  );
}
