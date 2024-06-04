import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationHelpers } from "@react-navigation/stack/lib/typescript/src/types";
import * as Clipboard from "expo-clipboard";
import { useMemo, useState } from "react";
import { TextStyle } from "react-native";
import { DateTimePickerDialog, useToast } from "../../../components";
import { fontNames } from "../../../constants";
import { cardColors, darkCardColors } from "../../../constants/colors";
import { useNoitication } from "../../../hooks/use-notification-handler";
import {
  BackgroundOptions,
  ColorOptions,
  CustomizeBar,
  FontOptions,
  FontSizeOptions,
} from "../customize-bar";
import { NoteScreenHeader } from "../note-screen-header";
import { StyleEvent, onFontColor } from "../style-events";
import { OptionProps } from "../types";
import { NoteSharingDialog } from "./note-sharing-dialog";
import { NoteOverlaysProps } from "./types";
import { NoteInfo } from "./note-info";
export function NoteOverlays({
  id,
  editNote,
  reminder,
  setReminder,
  setEditNote,
  onReminderOpen,
  currentSelectedStyle,
  selection,
  reminderDialog,

  setReminderDialog,
  shareImage,
  sharePdf,
}: NoteOverlaysProps) {
  const notification = useNoitication();
  const defaultIconsTheme = useMemo(() => {
    if (editNote.imageOpacity > 0.4) {
      return "#ffffff";
    }
    if (darkCardColors.includes(editNote.background)) {
      return "#ffffff";
    } else {
      return "#000000";
    }
  }, [editNote.imageOpacity, editNote.background]);
  const [sharingDialog, setSharingDialog] = useState(false);
  const [showNoteInfo, setShowNoteInfo] = useState<{ x: number; y: number }>(
    null
  );
  const toast = useToast();
  const currentIndex = editNote.styles.indexOf(currentSelectedStyle);
  const fontFamilyFocused = currentSelectedStyle?.style?.fontFamily;
  const noteStateIsEmpty =
    editNote.text.length === 0 && editNote.title.length === 0;
  const navigation = useNavigation<StackNavigationHelpers>();
  function setStyleEvent(key: keyof TextStyle, value: string) {
    if (selection.end === selection.start) {
      toast({ message: "Select text", duration: 400 });
      return;
    }
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
      <NoteInfo
        textLength={editNote.text.length + editNote.title.length}
        id={id}
        show={showNoteInfo !== null}
        startPositionX={showNoteInfo?.x}
        startPositionY={showNoteInfo?.y}
        onClose={() => setShowNoteInfo(null)}
      />
      <NoteSharingDialog
        visible={sharingDialog}
        shareImage={async () => {
          await shareImage();
          setSharingDialog(false);
        }}
        sharePdf={async () => {
          await sharePdf();
          setSharingDialog(false);
        }}
        onCencel={() => setSharingDialog(false)}
      />
      <DateTimePickerDialog
        action={() => {
          notification(
            editNote.title ? editNote.title : "",
            editNote.text ? editNote.text : "",
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
        onShowNoteInfo={({
          nativeEvent: { pageX, pageY, locationX, locationY },
        }) =>
          setShowNoteInfo({ x: pageX - locationX + 15, y: pageY - locationY })
        }
        iconsThemeColor={defaultIconsTheme}
        emptyNote={noteStateIsEmpty}
        onReminderOpen={onReminderOpen}
        onClipboardCopy={async ({ nativeEvent: { pageX } }) => {
          try {
            await Clipboard.setStringAsync(editNote.text);
            toast({
              message: "Copied",
              scaleAnimation: {
                x: pageX,
                y: -30,
              },
            });
          } catch (error) {
            toast({
              message: "Note is too large to copy in clipboard",
              textColor: "orange",
              scaleAnimation: { x: pageX, y: -30 },
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
        onShare={() => setSharingDialog(true)}
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
