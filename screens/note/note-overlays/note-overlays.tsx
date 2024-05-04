import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationHelpers } from "@react-navigation/stack/lib/typescript/src/types";
import * as Clipboard from "expo-clipboard";
import { TextStyle } from "react-native";
import { useToast } from "../../../components";
import { fontNames } from "../../../constants";
import { useNoitication } from "../../../hooks/use-notification-handler";
import { cardColors } from "../../../constants/colors";
import {
  BackgroundOptions,
  ColorOptions,
  CustomizeBar,
  FontOptions,
  FontSizeOptions,
} from "../customize-bar";
import { DateTimePickerDialog } from "../date-time-picker";
import { NoteScreenHeader } from "../note-screen-header";
import { StyleEvent, onFontColor } from "../style-events";
import { OptionProps } from "../types";
import { NoteOverlaysProps } from "./types";
export function NoteOverlays({
  id,
  editNote,
  reminder,
  setReminder,
  setEditNote,
  onReminderOpen,
  onShare,
  currentSelectedStyle,
  selection,
  reminderDialog,
  setReminderDialog,
}: NoteOverlaysProps) {
  const notification = useNoitication();
  const toast = useToast();
  const currentIndex = editNote.styles.indexOf(currentSelectedStyle);
  const fontFamilyFocused = currentSelectedStyle?.style?.fontFamily;
  const noteStateIsEmpty =
    editNote.text.length === 0 && editNote.title.length === 0;
  const navigation = useNavigation<StackNavigationHelpers>();
  function setStyleEvent(key: keyof TextStyle, value: string) {
    return StyleEvent(
      currentSelectedStyle,
      key,
      value,
      selection,
      setEditNote,
      currentIndex
    );
  }
  const optionsProps: OptionProps = {
    selection,
    currentSelectedStyle,
    currentIndex,
    setEditNote,
    colors: cardColors,
    editNote,
    fontFamilyFocused,
    fonts: fontNames,
  };
  return (
    <>
      <DateTimePickerDialog
        action={() => {
          notification(
            editNote.title ? editNote.title : null,
            editNote.text ? editNote.text : null,
            id,
            reminder,
            setEditNote
          );
          setReminderDialog(false);
        }}
        onChangeTime={(_, date) =>
          setReminder((prev) => ({ ...prev, time: date }))
        }
        onChangeDate={(_, date) => {
          setReminder((prev) => ({ ...prev, date }));
        }}
        onChangeDateAndroid={(event, date) => {
          if (event.type === "set") {
            setReminder((prev) => ({ ...prev, date }));
            DateTimePickerAndroid.open({
              is24Hour: true,
              mode: "time",
              value: reminder.time,
              positiveButton: { label: "Finish" },
              onError(arg) {
                toast({ message: arg.message });
              },
              display: "spinner",
              onChange(event, date) {
                if (event.type === "set") {
                  setReminder((prev) => ({ ...prev, time: date }));
                }
              },
            });
          }
        }}
        show={reminderDialog}
        time={reminder.time}
        date={reminder.date}
        onCencel={() => setReminderDialog(false)}
      />

      <NoteScreenHeader
        textLength={editNote.text.length + editNote.title.length}
        emptyNote={noteStateIsEmpty}
        onReminderOpen={onReminderOpen}
        onClipboard={async () => {
          try {
            await Clipboard.setStringAsync(editNote.text);
            toast({
              message: "Copied",
            });
          } catch (error) {
            toast({
              message: "Note is too large to copy in clipboard",
              textColor: "orange",
            });
          }
        }}
        onFavoriteAdd={() =>
          setEditNote((prev) => ({
            ...prev,
            isFavorite: !prev.isFavorite,
          }))
        }
        onBack={() => navigation.goBack()}
        favorite={editNote.isFavorite}
        onShare={onShare}
      />

      <CustomizeBar
        currentIndex={currentIndex}
        isImgBg={editNote.background.includes("/")}
        contentPosition={editNote.contentPosition}
        setEditNote={setEditNote}
        focusedColor={currentSelectedStyle?.style?.color}
        selection={selection}
        italicFocused={currentSelectedStyle?.style?.fontStyle === "italic"}
        onItalic={() => setStyleEvent("fontStyle", "italic")}
        onBold={() => setStyleEvent("fontWeight", "bold")}
        boldFocused={currentSelectedStyle?.style?.fontWeight === "bold"}
        onUnderline={() => setStyleEvent("textDecorationLine", "underline")}
        underLinedFocused={
          currentSelectedStyle?.style?.textDecorationLine === "underline"
        }
        onFontColor={() =>
          onFontColor(
            currentSelectedStyle,
            selection,
            setEditNote,
            currentIndex
          )
        }
        fontSizeOptions={<FontSizeOptions {...optionsProps} />}
        fontColorOptions={<ColorOptions {...optionsProps} />}
        backgroundOptions={<BackgroundOptions {...optionsProps} />}
        fontOptions={<FontOptions {...optionsProps} />}
      />
    </>
  );
}
