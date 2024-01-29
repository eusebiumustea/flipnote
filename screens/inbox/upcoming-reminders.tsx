import * as FileSystem from "expo-file-system";
import * as Notifications from "expo-notifications";
import { Fragment, useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useRecoilState } from "recoil";
import { NoteCard } from "../../components";
import { NOTES_PATH } from "../../constants";
import { useTheme } from "../../hooks";
import { useRequest } from "../../hooks/use-request";
import { dateTime, moderateFontScale, verticalScale } from "../../tools";
import { notesData, receivedNotifications } from "../note";
export function UpcomingReminders() {
  const [received] = useRecoilState(receivedNotifications);
  const [notes] = useRecoilState(notesData);
  const theme = useTheme();
  const upcomingNotifications = useMemo(() => {
    return notes.filter((e) => e.reminder && new Date() < new Date(e.reminder));
  }, [notes]);
  const { request } = useRequest();
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
            <NoteCard
              containerStyle={{ width: "100%", height: verticalScale(125) }}
              item={note}
            />
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
                  await Notifications.cancelScheduledNotificationAsync(
                    note.id.toString()
                  );
                  await FileSystem.writeAsStringAsync(
                    `${NOTES_PATH}/${note.id}`,
                    JSON.stringify({ ...note, reminder: null })
                  );
                  await request();
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
