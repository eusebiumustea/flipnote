import SegmentedControl from "@react-native-segmented-control/segmented-control";
import React, { useState } from "react";
import { View } from "react-native";
import { useTheme } from "../../hooks";
import { ReceivedReminders } from "./received-reminders";
import { UpcomingReminders } from "./upcoming-reminders";
export function Inbox() {
  const theme = useTheme();
  const [selected, setSelected] = useState(0);
  return (
    <View style={{ flex: 1, backgroundColor: theme.primary }}>
      <SegmentedControl
        values={["Upcoming", "Recent"]}
        selectedIndex={selected}
        style={{ margin: 16 }}
        onChange={(event) => {
          setSelected(event.nativeEvent.selectedSegmentIndex);
        }}
      />
      {selected === 0 && <UpcomingReminders />}
      {selected === 1 && <ReceivedReminders />}
    </View>
  );
}
