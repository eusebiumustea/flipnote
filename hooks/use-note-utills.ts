import * as Notifications from "expo-notifications";
import { Dispatch, SetStateAction, useMemo } from "react";
import { useToast } from "../components";
import { InputSelectionProps, note } from "../screens";
import { dateTime, moderateScale, range } from "../utils";
export function useNoteUtils(
  id: number,
  selection: InputSelectionProps,
  editNote: note,
  setEditNote: Dispatch<SetStateAction<note>>,
  setReminderDialog: Dispatch<SetStateAction<boolean>>
) {
  const noteStateIsEmpty =
    editNote.text.length === 0 && editNote.title.length === 0;
  const toast = useToast();
  const scheduleDateForNotification =
    editNote.reminder && new Date(editNote.reminder);
  function openReminder() {
    if (noteStateIsEmpty) {
      toast({
        message: "Write something to schedule reminder",
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
  const currentSelectedStyle = useMemo(() => {
    if (selection.end > selection.start) {
      return editNote.styles.find(
        (e) =>
          (selection.start < e.interval.start &&
            selection.end > e.interval.end &&
            Object.keys(e.style).length > 0) ||
          (range(e.interval.start, e.interval.end).includes(
            selection.start + 1
          ) &&
            Object.keys(e.style).length > 0) ||
          (range(e.interval.start, e.interval.end).includes(
            selection.end - 1
          ) &&
            Object.keys(e.style).length > 0)
      );
    }
  }, [selection, editNote.styles]);

  return { currentSelectedStyle, openReminder };
}
