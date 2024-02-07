import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationHelpers } from "@react-navigation/stack/lib/typescript/src/types";
import * as Clipboard from "expo-clipboard";
import { Image, ImageBackground } from "expo-image";
import { useState } from "react";
import {
  InputAccessoryView,
  TextStyle,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useToast } from "../../../components";
import { fontNames } from "../../../constants";
import { useNoitication } from "../../../hooks/use-notification-handler";
import { cardColors } from "../../../tools/colors";
import {
  BackgroundOptions,
  ColorOptions,
  CustomizeBar,
  FontOptions,
  FontSizeOptions,
} from "../customize-bar";
import { DateTimePickerDialog } from "../date-time-picker";
import { NoteScreenHeader } from "../note-screen-header";
import { StyleChanges } from "../style-changes";
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
  currentFocused,
  selection,
  reminderDialog,
  setReminderDialog,
  isImageBackground,
}: NoteOverlaysProps) {
  const notification = useNoitication();

  const [changes, setShowChanges] = useState(false);
  const toast = useToast();
  const currentIndex = editNote.styles.indexOf(currentFocused);
  const fontFamilyFocused = currentFocused?.style?.fontFamily;
  const noteStateIsEmpty =
    editNote.text.length === 0 && editNote.title.length === 0;
  const navigation = useNavigation<StackNavigationHelpers>();
  function setStyleEvent(key: keyof TextStyle, value: string) {
    return StyleEvent(
      currentFocused,
      key,
      value,
      selection,
      setEditNote,
      currentIndex
    );
  }
  const optionsProps: OptionProps = {
    selection,
    currentFocused,
    currentIndex,
    setEditNote,
    colors: cardColors,
    editNote,
    fontFamilyFocused,
    fonts: fontNames,
  };
  const { width, height } = useWindowDimensions();
  const { top } = useSafeAreaInsets();
  return (
    <>
      {isImageBackground && (
        <Image
          transition={{
            duration: 300,
            timing: "ease-in-out",
          }}
          source={{
            uri: editNote.background,
          }}
          style={{
            height: height + top,
            width,
            position: "absolute",
            zIndex: -2,
          }}
        />
      )}

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
        historyShown={editNote.styles.length > 0}
        // onHistoryOpen={() => setShowChanges(true)}
        onReminderOpen={onReminderOpen}
        onClipboard={async () => {
          try {
            await Clipboard.setStringAsync(
              `${editNote.title}\n${editNote.text}`
            );
            toast({
              message: "Copied",
              startPositionX: 80,
              startPositionY: 10,
              fade: true,
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
      {/* <StyleChanges
        background={editNote.background}
        text={editNote.text}
        setEditNote={setEditNote}
        styles={editNote.styles}
        opened={changes}
        onClose={() => setShowChanges(false)}
      /> */}

      <CustomizeBar
        contentPosition={editNote.contentPosition}
        setEditNote={setEditNote}
        focusedColor={currentFocused?.style?.color}
        selection={selection}
        italicFocused={currentFocused?.style?.fontStyle === "italic"}
        onItalic={() => setStyleEvent("fontStyle", "italic")}
        onBold={() => setStyleEvent("fontWeight", "bold")}
        boldFocused={currentFocused?.style?.fontWeight === "bold"}
        onUnderline={() => setStyleEvent("textDecorationLine", "underline")}
        underLinedFocused={
          currentFocused?.style?.textDecorationLine === "underline"
        }
        onFontColor={() =>
          onFontColor(currentFocused, selection, setEditNote, currentIndex)
        }
        fontSizeOptions={<FontSizeOptions {...optionsProps} />}
        fontColorOptions={<ColorOptions {...optionsProps} />}
        backgroundOptions={<BackgroundOptions {...optionsProps} />}
        fontOptions={<FontOptions {...optionsProps} />}
      />
    </>
  );
}
