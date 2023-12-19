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
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRecoilState } from "recoil";
import { ColorBox, Swipe, useToast } from "../../components";
import {
  dateTime,
  excludeArrayElements,
  excludeNotes,
  moderateFontScale,
  moderateScale,
  recalculateId,
  reinjectElementInArray,
  replaceElementAtId,
  useTheme,
  verticalScale,
} from "../../tools";
import { cardColors } from "../../tools/colors";
import { notesData } from "./date-time-picker/atom";
import { CustomizeBar } from "./customize-bar";
import { DateTimePickerDialog } from "./date-time-picker";
import { NoteScreenHeader } from "./note-screen-header";
import {
  InputSelectionProps,
  ReminderProps,
  TextNoteStyle,
  note,
} from "./types";
interface ParamsProps {
  id: number;
  edit: boolean;
}
interface RenderContentProps {
  value: string;
  styles: TextNoteStyle[];
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

  const [reminder, setReminder] = useState<ReminderProps>({
    date: new Date(),
    time: new Date(),
  });

  const [selection, setSelection] = useState<InputSelectionProps>({
    start: 0,
    end: 0,
  });
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
  useMemo(() => {
    editNote.styles.map((e, i, arr) => {
      if (e.interval.end > editNote.text.length) {
        setEditNote((prev) => ({
          ...prev,
          styles: prev.styles.filter((style) => style !== e),
        }));
      }
    });
  }, [editNote.text]);
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
  const RenderContent = useMemo(() => {
    const isStyled = editNote.styles.length > 0;
    const text = editNote.text;
    const sortedStyles = editNote.styles.sort(
      (a, b) => a?.interval?.end - b?.interval?.start
    );
    if (isStyled) {
      console.log(
        sortedStyles.map((e, i, arr) => {
          return (
            <Fragment key={i}>
              <Text style={e?.style}>
                {text.slice(e?.interval?.start, e?.interval?.end)}
              </Text>
              <Text>
                {text.slice(e?.interval?.end, arr[i + 1]?.interval?.start)}
              </Text>
            </Fragment>
          );
        })
      );
      return (
        <>
          <Text>{text.slice(0, editNote?.styles[0]?.interval?.start)}</Text>
          {sortedStyles.map((e, i, arr) => {
            return (
              <Fragment key={i}>
                <Text style={e?.style}>
                  {text.slice(e?.interval?.start, e?.interval?.end)}
                </Text>
                <Text>
                  {text.slice(e?.interval?.end, arr[i + 1]?.interval?.start)}
                </Text>
              </Fragment>
            );
          })}

          {/* <Text>
              {text.slice(
                editNote.styles[editNote.styles.length - 1]?.interval?.end
              )}
            </Text> */}
        </>
      );
    }
    return <Text>{editNote.text}</Text>;
  }, [editNote.styles]);

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
    Dimensions.get("screen").height -
    (keyboard.coordinates.start?.screenY || Dimensions.get("screen").height);

  console.log("editnote:", JSON.stringify(editNote));
  const boldFocused: boolean =
    editNote.styles.findIndex(
      (e) =>
        e?.interval?.end === selection?.end ||
        (e?.interval.start === selection.start && e?.style?.fontWeight)
    ) > -1 && selection?.end !== selection?.start;
  const boldIndex = editNote.styles.findIndex(
    (e) =>
      e?.interval?.end === selection.end ||
      (e?.interval?.start === selection.start && e.style.fontWeight)
  );

  const config =
    Platform.OS === "ios" &&
    Swipe({
      onMove(e, state) {},
      onRelease: (e, state) => {
        const x = state.dx;
        const pageX = e.nativeEvent.pageX;
        if (x > 0 && pageX < 200) {
          navigation.popToTop();
        }
      },
    });

  return (
    <View
      {...config}
      style={{
        flex: 1,
        // backgroundColor: theme.background,
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

      <ScrollView
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
          keyboardType="default"
          selectTextOnFocus={false}
          multiline
          scrollEnabled={false}
          selectionColor={"#FFF3C7"}
          placeholder="Title"
          style={{
            color: "#000",
            fontSize: moderateFontScale(28),
            fontWeight: "bold",
            fontFamily: "google-sans",
          }}
        >
          <Text>{editNote.title}</Text>
        </TextInput>

        <TextInput
          onSelectionChange={(e) => {
            setSelection({
              start: e.nativeEvent.selection.start,
              end: e.nativeEvent.selection.end,
            });
            console.log(selection);
          }}
          placeholderTextColor={theme.placeholder}
          cursorColor={"#FFCB09"}
          selectTextOnFocus={false}
          onChangeText={(editedText) =>
            setEditNote((prev) => ({
              ...prev,
              text: editedText,
            }))
          }
          underlineColorAndroid="transparent"
          keyboardType="default"
          multiline
          scrollEnabled={false}
          selectionColor={"#FFF3C7"}
          placeholder="Take the note"
          style={{
            color: "#000",
            marginTop: verticalScale(20),
            paddingBottom: verticalScale(200),
          }}
        >
          {RenderContent}
        </TextInput>
        {/* <View style={{ height: 100, backgroundColor: "red" }}></View> */}
      </ScrollView>
      <CustomizeBar
        onItalic={() => console.log(selection)}
        onBold={() => {
          if (!boldFocused && selection.end !== selection.start) {
            setEditNote((prev) => ({
              ...prev,
              styles: [
                ...prev.styles,
                { interval: selection, style: { fontWeight: "bold" } },
              ],
            }));
          }
          if (boldFocused) {
            setEditNote((prev) => ({
              ...prev,
              styles: prev.styles.filter((e) => e !== prev.styles[boldIndex]),
            }));
          }
        }}
        boldFocused={boldFocused}
        backgroundOptions={
          <>
            {cardColors.map((e, i) => {
              return (
                <ColorBox
                  onPress={() =>
                    setEditNote((prev) => ({ ...prev, background: e }))
                  }
                  bgColor={e}
                  key={i}
                  checked={editNote.background === e}
                />
              );
            })}
          </>
        }
      />
    </View>
  );
}
