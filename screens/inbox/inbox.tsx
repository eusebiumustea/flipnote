import React from "react";
import { ScrollView } from "react-native";
import { useTheme } from "../../hooks";
import { verticalScale } from "../../utils";
import { ReceivedReminders } from "./received-reminders";
import { UpcomingReminders } from "./upcoming-reminders";
import { Text } from "react-native-fast-text";

export function Inbox() {
  const theme = useTheme();
  return (
    <ScrollView
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
    >
      <UpcomingReminders />
      <ReceivedReminders />
    </ScrollView>
  );
}
