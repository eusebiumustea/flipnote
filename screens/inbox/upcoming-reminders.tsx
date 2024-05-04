import * as FileSystem from "expo-file-system";
import * as Notifications from "expo-notifications";
import { Fragment, useMemo } from "react";
import {
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
import { dateTime, moderateFontScale } from "../../utils";
import { notesValue, receivedNotifications } from "../note";
export async function removeReceivedReminder(id: number) {
  await Notifications.cancelScheduledNotificationAsync(id.toString());
  const data = await FileSystem.readAsStringAsync(`${NOTES_PATH}/${id}`);
  const parsedNote = await JSON.parse(data);
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
  const { syncState } = useRequest();
  const { width } = useWindowDimensions();
  return (
    <>
      {upcomingNotifications.length === 0 && received.length === 0 && (
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
      )}
      {upcomingNotifications.length > 0 && (
        <Text
          style={{
            color: theme.onPrimary,
            fontSize: moderateFontScale(18),
          }}
        >
          Upcoming
        </Text>
      )}
      {upcomingNotifications.map((note, i) => {
        const reminder = new Date(note.reminder);

        return (
          <Fragment key={i}>
            <NoteCard containerStyle={{ width: width - 32 }} item={note} />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                onPress={async () => {
                  removeReceivedReminder(note.id);
                  await syncState();
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
          </Fragment>
        );
      })}
    </>
  );
}
