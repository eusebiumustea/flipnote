import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useBackHandler, useKeyboard } from "@react-native-community/hooks";
import * as Clipboard from "expo-clipboard";
import * as Notifications from "expo-notifications";
import * as Sharing from "expo-sharing";
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Dimensions,
  Linking,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TextStyle,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { captureRef } from "react-native-view-shot";
import { useRecoilState } from "recoil";
import { Swipe, useToast } from "../../components";
import { fontNames } from "../../constants";
import {
  dateTime,
  moderateFontScale,
  moderateScale,
  range,
  recalculateId,
  reinjectElementInArray,
  removeEmptySpace,
  replaceElementAtId,
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
import { notesData } from "./atom";
import { HistoryChanges } from "./history-changes";
import { NoteScreenHeader } from "./note-screen-header";
import { StyleEvent, onFontColor } from "./style-events";
import { InputSelectionProps, OptionProps, ReminderProps, note } from "./types";
import { useEditNoteContent, useNoteContent, useTheme } from "../../hooks";
import { useNoitication } from "../../hooks/use-notification-handler";
import { useNoteManager } from "../../hooks/use-note-manager";
import Animated, { Keyframe, SharedTransition } from "react-native-reanimated";
import { useIsFocused } from "@react-navigation/native";
import { AnimatePresence } from "moti";
interface ParamsProps {
  id: number;
  edit: boolean;
}

export function NotePage({ route, navigation }: any) {
  const { width, height } = useWindowDimensions();
  useBackHandler(() => {
    navigation.popToTop();
    return true;
  });
  const inputRef = useRef<TextInput | null>(null);
  const theme = useTheme();
  const { id }: ParamsProps = route.params;
  const [notes, setNotes] = useRecoilState(notesData);
  const edit: boolean = id < notes.data.length + 1;
  const item: note = useMemo(() => {
    if (!edit) {
      return {
        id,
        title: "",
        text: "",
        isFavorite: false,
        background: "#fff",
        styles: [],
        reminder: null,
      };
    }
    return notes.data.find((e) => e.id === id);
  }, []);

  const [editNote, setEditNote] = useState<note>({
    id,
    title: item.title,
    text: item.text,
    isFavorite: item.isFavorite,
    background: item.background,
    styles: item.styles,
    reminder: item.reminder,
  });
  const noteStateIsEmpty =
    editNote.text.length === 0 && editNote.title.length === 0;
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
  // console.log(notes.data);
  useNoteManager(setNotes, editNote, notes.data, id);
  // useEffect(() => {
  //   return () => {
  //     setNotes((prev) => ({
  //       ...prev,
  //       data: recalculateId(prev.data),
  //     }));
  //   };
  // }, []);
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
  // }, [selection, editNote.styles]);
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

  console.log("currentFocused:", currentFocused);
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
  const imageRef = useRef<ScrollView>();
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
        format: "jpg",
        snapshotContentContainer: true,
        handleGLSurfaceViewOnAndroid: true,
        result: "tmpfile",
        useRenderInContext: true,
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

  console.log("editnote:", JSON.stringify(editNote));

  const gestureConfig =
    Platform.OS === "ios" &&
    Swipe({
      onRelease: (e, state) => {
        const x = state.dx;
        const pageX = e.nativeEvent.pageX;
        if (x > 0 && pageX < 200) {
          navigation.popToTop();
        }
      },
    });
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
      <DateTimePickerDialog
        action={() => {
          notification(
            editNote.title ? editNote.title : "Flipnote",
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
            toast({ message: "Note is too large to copy in clipboard" });
          }
        }}
        onFavoriteAdd={() =>
          setEditNote((prev) => ({
            ...prev,
            isFavorite: !prev.isFavorite,
          }))
        }
        onBack={() => navigation.popToTop()}
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
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        sharedTransitionTag={
          id < notes.data.length + 1 ? id.toString() : "note-init"
        }
        {...gestureConfig}
        scrollEventThrottle={16}
        collapsable={false}
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{
          paddingTop: verticalScale(70) + top,
          padding: 16,
          elevation: 5,
          shadowColor: "#000000",
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.17,
          shadowRadius: 3.05,
        }}
        style={{
          flex: 1,
          marginBottom,
          backgroundColor: editNote.background,
        }}
      >
        {/* <TextInput
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
          onSelectionChange={(e) => console.log(e.nativeEvent.selection)}
          multiline
          scrollEnabled={false}
          placeholder="Title"
          style={{
            color: "#000",
            fontSize: moderateFontScale(28),
            fontWeight: "bold",
            fontFamily: "OpenSans",
            backgroundColor: editNote.background,
          }}
        >
          <Text>{editNote.title}</Text>
        </TextInput> */}
        <TextInput
          ref={inputRef}
          onSelectionChange={({ nativeEvent }) => {
            // selection = e.nativeEvent.selection;

            setSelection(nativeEvent.selection);
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
            // marginTop: verticalScale(20),
            paddingBottom: verticalScale(200),
            backgroundColor: editNote.background,
          }}
        >
          {useEditNoteContent(editNote.styles, editNote.text)}
        </TextInput>
      </Animated.ScrollView>

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
}
