import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useKeyboard } from "@react-native-community/hooks";
import * as Clipboard from "expo-clipboard";
import * as FileSystem from "expo-file-system";
import * as Notifications from "expo-notifications";
import * as Sharing from "expo-sharing";
import { memo, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  PixelRatio,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TextStyle,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ViewShot, { captureRef } from "react-native-view-shot";
import { useToast } from "../../components/toast";
import { NOTES_PATH, fontNames } from "../../constants";
import { useEditNoteContent, useTheme } from "../../hooks";
import { useLoading } from "../../hooks/use-loading-dialog";
import { useStoreNote } from "../../hooks/use-note-manager";
import { useNoitication } from "../../hooks/use-notification-handler";
import {
  dateTime,
  moderateFontScale,
  moderateScale,
  range,
  replaceElementAtIndex,
  verticalScale,
} from "../../tools";
import { cardColors } from "../../tools/colors";
import {
  BackgroundOptions,
  ColorOptions,
  CustomizeBar,
  FontOptions,
  FontSizeOptions,
} from "./customize-bar";
import { DateTimePickerDialog } from "./date-time-picker";
import { HistoryChanges } from "./history-changes";
import { NoteScreenHeader } from "./note-screen-header";
import { StyleEvent, onFontColor } from "./style-events";
import { InputSelectionProps, OptionProps, ReminderProps, note } from "./types";
import { useRequest } from "../../hooks/use-request";
import { MotiScrollView } from "moti";
interface ParamsProps {
  id: number;
}
export const NotePage = memo(({ route, navigation }: any) => {
  const { id }: ParamsProps = route.params;
  const { width, height } = useWindowDimensions();
  const inputRef = useRef<TextInput | null>(null);
  const theme = useTheme();
  // const [notes, setNotes] = useRecoilState(notesData);
  // const edit: boolean = id < notes.data.length + 1;
  // const item: note = useMemo(() => {
  //   if (!edit) {
  // return {
  //   id,
  //   title: "",
  //   text: "",
  //   isFavorite: false,
  //   background: "#fff",
  //   styles: [],
  //   reminder: null,
  // };
  //   }
  //   return notes.data.find((e) => e.id === id);
  // }, []);
  const { readNotes } = useRequest();
  const fileName = `${id}.json`;
  const notePath = `${NOTES_PATH}/${fileName}`;
  const [editNote, setEditNote] = useState<note>({
    id,
    title: "",
    text: "",
    isFavorite: false,
    background: "#fff",
    styles: [],
    reminder: null,
  });
  const noteStateIsEmpty =
    editNote.text.length === 0 && editNote.title.length === 0;
  useEffect(() => {
    async function getData() {
      FileSystem.readAsStringAsync(notePath)
        .then((data) => {
          const content: note = JSON.parse(data);
          setTimeout(() => setEditNote(content), 180);
        })
        .catch(() => null);
    }
    getData();
  }, []);
  useEffect(() => {
    async function storeDataConditional() {
      try {
        if (noteStateIsEmpty) {
          await FileSystem.deleteAsync(notePath, { idempotent: true });
        } else {
          await FileSystem.writeAsStringAsync(
            notePath,
            JSON.stringify(editNote)
          );
          console.log("edited");
        }
      } catch (_) {
        toast({ message: "Failed to save note", textColor: "red" });
      }
    }
    storeDataConditional();
  }, [editNote]);
  const loading = useLoading();
  const [reminder, setReminder] = useState<ReminderProps>({
    date: new Date(),
    time: new Date(),
  });

  const [selection, setSelection] = useState<InputSelectionProps>({
    start: 0,
    end: 0,
  });
  // let selection = useRef({ start: 0, end: 0 }).current;
  const [reminderDialog, setReminderDialog] = useState(false);
  const scheduleDateForNotification =
    editNote.reminder && new Date(editNote.reminder);
  const textSelected = selection.end !== selection.start;
  // useNoteManager(setNotes, editNote, notes.data, id);
  // useStoreNote(id, editNote);

  // const currentFocused = useMemo(() => {
  //   if (textSelected) {
  //     return editNote.styles.find(
  //       (e) =>
  //         (selection.start < e.interval.start &&
  //           selection.end > e.interval.end) ||
  //         range(e.interval.start, e.interval.end).includes(
  //           selection.start + 1
  //         ) ||
  //         (range(e.interval.start, e.interval.end).includes(
  //           selection.end - 1
  //         ) &&
  //           Object.keys(e.style).length > 0)
  //     );
  //   }
  // }, [selection, editNote.styles, id]);
  const currentFocused =
    textSelected &&
    editNote.styles.find(
      (e) =>
        (selection.start < e.interval.start &&
          selection.end > e.interval.end) ||
        range(e.interval.start, e.interval.end).includes(selection.start + 1) ||
        (range(e.interval.start, e.interval.end).includes(selection.end - 1) &&
          Object.keys(e.style).length > 0)
    );

  const currentIndex = editNote.styles.indexOf(currentFocused);

  // function font(fontName: string) {
  //   const weight = currentFocused?.style?.fontWeight === "bold";
  //   const italic = currentFocused?.style?.fontStyle === "italic";
  //   if (weight && !italic) {
  //     console.log("only weight");

  //     return fontName + "-bold";
  //   }
  //   if (italic && !weight) {
  //     console.log("only italic");

  //     return fontName + "-italic";
  //   }
  //   if (italic && weight) {
  //     console.log("both");

  //     return fontName + "-bold-italic";
  //   }
  //   return fontName;
  // }

  const [imageUri, setImageUri] = useState<string>("");
  const imageRef = useRef<ScrollView>(null);
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

  const { top, bottom } = useSafeAreaInsets();
  const keyboard = useKeyboard();
  const toast = useToast();

  async function Share() {
    if (noteStateIsEmpty) {
      toast({
        message: "Can't share empty content",
        startPositionX: moderateScale(170),
        startPositionY: 10,
        fade: true,
      });
      return;
    }
    try {
      await captureRef(imageRef, {
        snapshotContentContainer: true,
        fileName: `${id}-screenshot`,
        result: "tmpfile",
      }).then(async (uri) => {
        await Sharing.shareAsync(uri);
      });
      // await Sharing.shareAsync(imageUri, { mimeType: "image/jpg" });
      // await FileSystem.writeAsStringAsync(
      //   `${FileSystem.documentDirectory}${editNote.title.substring(0, 40)}.txt`,
      //   `${editNote.title}\n${editNote.text}`
      // );
      // await Sharing.shareAsync(
      //   `${FileSystem.documentDirectory}${editNote.title.substring(0, 40)}.txt`,
      //   { mimeType: "text/plain" }
      // );
      // await FileSystem.deleteAsync(
      //   `${FileSystem.documentDirectory}${editNote.title.substring(0, 40)}.txt`
      // );
    } catch (_) {
      toast({ message: "Error" });
    }
  }
  const marginBottom =
    Platform.OS === "android"
      ? Dimensions.get("screen").height -
        (keyboard.coordinates.start?.screenY || Dimensions.get("screen").height)
      : Dimensions.get("screen").height -
        (keyboard.coordinates.end?.screenY || Dimensions.get("screen").height);

  // const gestureConfig =
  //   Platform.OS === "ios" &&
  //   Swipe({
  //     onRelease: (e, state) => {
  //       const x = state.dx;
  //       const pageX = e.nativeEvent.pageX;
  //       if (x > 0 && pageX < 200) {
  //         navigation.goBack();
  //       }
  //     },
  //   });
  const fontFamilyFocused = currentFocused?.style?.fontFamily;
  const [changes, setShowChanges] = useState(false);
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

  const notification = useNoitication();

  return (
    <>
      <MotiScrollView
        transition={{
          type: "timing",
          duration: 500,
          backgroundColor: { duration: 200 },
        }}
        from={{ opacity: 0 }}
        animate={{ backgroundColor: editNote.background, opacity: 1 }}
        ref={imageRef}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{
          paddingTop: verticalScale(70) + top,
          padding: 16,
        }}
        style={{
          flex: 1,
          marginBottom,
        }}
      >
        <TextInput
          placeholderTextColor={theme.placeholder}
          onChangeText={(editedTitle) =>
            setEditNote((prev) => ({
              ...prev,
              title: editedTitle,
            }))
          }
          underlineColorAndroid="transparent"
          cursorColor={"#FFCB09"}
          selectTextOnFocus={true}
          multiline
          scrollEnabled={false}
          placeholder="Title"
          style={{
            color: "#000",
            fontSize: moderateFontScale(28),
            fontWeight: "bold",
            fontFamily: "OpenSans",
          }}
        >
          <Text>{editNote.title}</Text>
        </TextInput>

        <TextInput
          onFocus={(e) => console.log(e.nativeEvent.text)}
          onSelectionChange={({ nativeEvent: { selection } }) => {
            // selection = e.nativeEvent.selection;

            setSelection(selection);
          }}
          placeholderTextColor={theme.placeholder}
          cursorColor={"#FFCB09"}
          selectTextOnFocus={false}
          autoCapitalize="none"
          autoCorrect={false}
          spellCheck={false}
          inputMode="text"
          onChangeText={(text) => {
            setEditNote((prev) => ({
              ...prev,
              text,
            }));
          }}
          underlineColorAndroid="transparent"
          multiline
          // selectionColor={"#FFF3C7"}
          placeholder="Take the note"
          style={{
            marginTop: verticalScale(20),
            paddingBottom: verticalScale(200),
          }}
        >
          {useEditNoteContent(editNote.styles, editNote.text)}
        </TextInput>
      </MotiScrollView>
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
        historyShown={editNote.styles.length > 0}
        onHistoryOpen={() => setShowChanges(true)}
        onReminderOpen={openReminder}
        onClipboard={async () => {
          if (noteStateIsEmpty) {
            return;
          }
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
        onShare={Share}
      />
      <HistoryChanges
        background={editNote.background}
        text={editNote.text}
        setEditNote={setEditNote}
        styles={editNote.styles}
        opened={changes}
        onClose={() => setShowChanges(false)}
      />
      <CustomizeBar
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
});
