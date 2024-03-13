import * as Notifications from "expo-notifications";
import { Dispatch, SetStateAction, useMemo } from "react";
import { useToast } from "../components";
import { InputSelectionProps, note } from "../screens";
import { dateTime, moderateScale, range } from "../tools";
import { Dimensions, Platform } from "react-native";
import { useKeyboard } from "@react-native-community/hooks";
export function useNoteUtils(
  id: number,
  selection: InputSelectionProps,
  editNote: note,
  setEditNote: Dispatch<SetStateAction<note>>,
  setReminderDialog: Dispatch<SetStateAction<boolean>>
) {
  const keyboard = useKeyboard();
  const keyboardHeight =
    Platform.OS === "android"
      ? Dimensions.get("screen").height -
        (keyboard.coordinates.start?.screenY || Dimensions.get("screen").height)
      : Dimensions.get("screen").height -
        (keyboard.coordinates.end?.screenY || Dimensions.get("screen").height);
  const noteStateIsEmpty =
    editNote.text.length === 0 && editNote.title.length === 0;
  const toast = useToast();
  const scheduleDateForNotification =
    editNote.reminder && new Date(editNote.reminder);
  function openReminder() {
    if (noteStateIsEmpty) {
      toast({
        message: "Write something to schedule reminder",
        startPositionX: moderateScale(22),
      });
      return;
    }
    if (scheduleDateForNotification > new Date()) {
      toast({
        button: {
          title: "Cencel",
          onPress: async () => {
            await Notifications.cancelScheduledNotificationAsync(id.toString());
            setEditNote((prev) => ({ ...prev, reminder: null }));
            toast({ message: "Cenceled" });
          },
        },
        message: `Reminder already set for ${dateTime(
          scheduleDateForNotification
        )}`,
        startPositionX: moderateScale(30),
        startPositionY: -10,
      });
      return;
    }
    if (scheduleDateForNotification <= new Date()) {
      setEditNote((prev) => ({ ...prev, reminder: null }));
      setReminderDialog(true);
      return;
    }
    setReminderDialog(true);
  }
  // const currentFocused =
  //   textSelected &&
  //   editNote.styles.find(
  //     (e) =>
  //       (selection.start < e.interval.start &&
  //         selection.end > e.interval.end) ||
  //       range(e.interval.start, e.interval.end).includes(selection.start + 1) ||
  //       (range(e.interval.start, e.interval.end).includes(selection.end - 1) &&
  //         Object.keys(e.style).length > 0)
  //   );
  const currentFocused = useMemo(() => {
    if (selection.end !== selection.start) {
      return editNote.styles.find(
        (e) =>
          (selection.start < e.interval.start &&
            selection.end > e.interval.end) ||
          range(e.interval.start, e.interval.end).includes(
            selection.start + 1
          ) ||
          (range(e.interval.start, e.interval.end).includes(
            selection.end - 1
          ) &&
            Object.keys(e.style).length > 0)
      );
    }
  }, [selection, editNote.styles]);

  return { currentFocused, openReminder, keyboardHeight };
}
