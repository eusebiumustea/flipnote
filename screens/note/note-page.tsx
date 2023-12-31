import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useBackHandler, useKeyboard } from "@react-native-community/hooks";
import * as Clipboard from "expo-clipboard";
import * as FileSystem from "expo-file-system";
import * as Notifications from "expo-notifications";
import * as Sharing from "expo-sharing";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  Linking,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TextStyle,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
  replaceElementAtId,
  replaceElementAtIndex,
  useTheme,
  verticalScale,
} from "../../tools";
import { cardColors } from "../../tools/colors";
import {
  BackgroundOptions,
  ColorOptions,
  CustomizeBar,
  FontOptions,
} from "./customize-bar";
import { DateTimePickerDialog } from "./date-time-picker";
import { notesData } from "./date-time-picker/atom";
import { HistoryChanges } from "./history-changes";
import { NoteScreenHeader } from "./note-screen-header";
import { StyleEvent, onFontColor } from "./style-events";
import { InputSelectionProps, ReminderProps, note } from "./types";
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
    id: item.id,
    title: item.title,
    text: item.text,
    isFavorite: item.isFavorite,
    background: item.background,
    styles: item.styles,
    reminder: item.reminder,
  });
  const [pastText, setPastText] = useState("");
  useMemo(() => {}, [editNote.text]);
  const [reminder, setReminder] = useState<ReminderProps>({
    date: new Date(),
    time: new Date(),
  });

  const [selection, setSelection] = useState<InputSelectionProps>({
    start: 0,
    end: 0,
  });
  // let selection = useRef({
  //   start: 0,
  //   end: 0,
  // }).current;
  console.log(selection);
  const [reminderDialog, setReminderDialog] = useState(false);
  const reminderSplit: Date = new Date(
    [
      reminder.date.toJSON().slice(0, 10),

      reminder.time.toJSON().slice(11),
    ].join("T")
  );
  const noteStateIsEmpty =
    editNote.text.length === 0 && editNote.title.length === 0;
  const scheduleDateForNotification =
    editNote.reminder && new Date(editNote.reminder);
  const isEditing = edit && !noteStateIsEmpty;
  const isCreating = !edit && !noteStateIsEmpty;
  const included = notes.data.map((e) => e.id).includes(id);
  useEffect(() => {
    try {
      if (noteStateIsEmpty) {
        setNotes((prev) => ({
          ...prev,
          data: prev.data.filter((e) => e.id !== id),
        }));
      }
      if (isCreating && !included) {
        setNotes((prev) => ({
          ...prev,
          data: [...prev.data, editNote],
        }));
      }
      if (isCreating && included) {
        setNotes((prev) => ({
          ...prev,
          data: replaceElementAtId(prev.data, id, editNote),
        }));
      }
      if (isEditing && included) {
        setNotes((prev) => ({
          ...prev,
          data: replaceElementAtId(prev.data, id, editNote),
        }));
      }
      if (isEditing && !included) {
        setNotes((prev) => ({
          ...prev,
          data: reinjectElementInArray(prev.data, editNote),
        }));
      }
    } catch (message) {
      toast({ message });
    }
  }, [editNote, included]);

  useEffect(() => {
    return () =>
      setNotes((prev) => ({
        ...prev,
        data: recalculateId(prev.data),
      }));
  }, []);

  const Content = useMemo(() => {
    const isStyled = editNote.styles.length > 0;
    const text = editNote.text;
    if (isStyled) {
      return (
        <>
          <Text>{text.slice(0, editNote.styles[0]?.interval?.start)}</Text>
          {editNote.styles.map((e, i, arr) => {
            const start = e?.interval?.start;
            const end = e?.interval?.end;
            const nextStart = arr[i + 1]?.interval?.start;
            const style = e?.style;
            return (
              <Fragment key={i}>
                <Text style={style}>{text.slice(start, end)}</Text>
                <Text>{text.slice(end, nextStart)}</Text>
              </Fragment>
            );
          })}
        </>
      );
    }
    return <Text>{editNote.text}</Text>;
  }, [editNote.styles, editNote.text]);
  useEffect(() => {
    if (editNote.text.length === 0) {
      setEditNote((prev) => ({ ...prev, styles: [] }));
    }
    editNote.styles.map((style, i) => {
      if (style.interval.start <= style.interval.end) {
        setEditNote((prev) => ({
          ...prev,
          styles: prev.styles.filter((e) => e !== style),
        }));
      }
      if (
        range(style.interval.start, style.interval.end).includes(selection.end)
      ) {
        setEditNote((prev) => ({
          ...prev,
          styles: replaceElementAtIndex(prev.styles, i, {
            ...style,
            interval: { ...style.interval, end: selection.end - 1 },
          }),
        }));
      }
    });
  }, [editNote.text]);
  const currentFocused =
    selection.end !== selection.start &&
    editNote.styles.find(
      (e) =>
        (selection.start < e.interval.start &&
          selection.end > e.interval.end) ||
        range(e.interval.start, e.interval.end).includes(selection.end) ||
        (range(e.interval.start, e.interval.end).includes(selection.start) &&
          Object.keys(e.style).length > 0)
    );
  console.log("currentFocused:", currentFocused);
  const currentIndex = editNote.styles.findIndex(
    (e) =>
      (selection.start < e.interval.start && selection.end > e.interval.end) ||
      range(e.interval.start, e.interval.end).includes(selection.end) ||
      (range(e.interval.start, e.interval.end).includes(selection.start) &&
        Object.keys(e.style).length > 0)
  );
  function font(fontName: string) {
    const weight = currentFocused?.style?.fontWeight === "bold";
    const italic = currentFocused?.style?.fontStyle === "italic";
    if (weight && !italic) {
      console.log("only weight");

      return fontName + "-bold";
    }
    if (italic && !weight) {
      console.log("only italic");

      return fontName + "-italic";
    }
    if (italic && weight) {
      console.log("both");

      return fontName + "-bold-italic";
    }
    return fontName;
  }
  async function scheduleNotifications() {
    try {
      if (reminderSplit >= new Date()) {
        await Notifications.scheduleNotificationAsync({
          identifier: id.toString(),
          content: {
            title: editNote.title ? editNote.title : "Flipnote",
            body: editNote.text ? editNote.text : null,
            sound: true,
          },
          trigger: {
            date: reminderSplit,
          },
        });
      }
      if (reminderSplit < new Date()) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: editNote.title ? editNote.title : "Flipnote",
            body: editNote.text ? editNote.text : null,
            sound: true,
          },
          trigger: null,
        });
      }
    } catch (error) {}
  }
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
      await FileSystem.writeAsStringAsync(
        `${FileSystem.documentDirectory}${editNote.title.substring(0, 40)}.txt`,
        `${editNote.title}\n${editNote.text}`
      );
      await Sharing.shareAsync(
        `${FileSystem.documentDirectory}${editNote.title.substring(0, 40)}.txt`,
        { mimeType: "text/plain" }
      );
      await FileSystem.deleteAsync(
        `${FileSystem.documentDirectory}${editNote.title.substring(0, 40)}.txt`
      );
    } catch (error) {
      toast({ message: error });
    }
  }
  async function setupReminder() {
    let { status: newStatus } = await Notifications.getPermissionsAsync();
    if (newStatus !== "granted") {
      toast({
        duration: 2000,
        message: "Permission denied",
        button: {
          title: "Open app settings",
          onPress() {
            Linking.openSettings();
          },
        },
        textColor: "red",
      });
      setReminderDialog(false);
      return;
    }
    await scheduleNotifications();
    if (reminderSplit >= new Date()) {
      setEditNote((prev) => ({
        ...prev,
        reminder: reminderSplit.getTime(),
      }));
      toast({
        message: `Reminder set for ${dateTime(reminderSplit)}`,
      });
    }
    setReminderDialog(false);
  }
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

  const { top } = useSafeAreaInsets();
  const keyboard = useKeyboard();

  let scrollPosition = useRef<number>(0).current;
  const toast = useToast();
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

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <DateTimePickerDialog
        action={setupReminder}
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
          await Clipboard.setStringAsync(`${editNote.title}\n${editNote.text}`);
          toast({
            message: "Copied",
            startPositionX: 80,
            startPositionY: 10,
            fade: true,
          });
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
      <ScrollView
        {...gestureConfig}
        scrollEventThrottle={16}
        onScroll={(e) => {
          scrollPosition = e.nativeEvent.contentOffset.y;
        }}
        snapToAlignment="center"
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{
          paddingTop: verticalScale(70) + top,
          padding: 16,
        }}
        style={{
          flex: 1,
          marginBottom,
          backgroundColor: editNote.background,
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
          selectTextOnFocus={false}
          multiline
          scrollEnabled={false}
          selectionColor={"#FFF3C7"}
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
          onSelectionChange={(e) => {
            const start = e.nativeEvent.selection.start;
            const end = e.nativeEvent.selection.end;
            setSelection({
              start,
              end,
            });
          }}
          placeholderTextColor={theme.placeholder}
          cursorColor={"#FFCB09"}
          selectTextOnFocus={false}
          autoCapitalize="none"
          autoCorrect={false}
          spellCheck={false}
          inputMode="text"
          keyboardType="default"
          onChangeText={(text) =>
            setEditNote((prev) => ({
              ...prev,
              text,
            }))
          }
          underlineColorAndroid="transparent"
          multiline
          // selectionColor={"#FFF3C7"}
          placeholder="Take the note"
          style={{
            marginTop: verticalScale(20),
            paddingBottom: verticalScale(200),
            backgroundColor: editNote.background,
          }}
        >
          {Content}
        </TextInput>
      </ScrollView>
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
        fontColorOptions={
          <ColorOptions
            selection={selection}
            currentFocused={currentFocused}
            currentIndex={currentIndex}
            setEditNote={setEditNote}
          />
        }
        backgroundOptions={
          <BackgroundOptions
            colors={cardColors}
            editNote={editNote}
            setEditNote={setEditNote}
          />
        }
        fontOptions={
          <FontOptions
            selection={selection}
            fonts={fontNames}
            setEditNote={setEditNote}
            fontFamilyFocused={fontFamilyFocused}
            currentIndex={currentIndex}
            currentFocused={currentFocused}
          />
        }
      />
    </View>
  );
}
