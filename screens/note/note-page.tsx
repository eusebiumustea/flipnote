import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { useBackHandler, useKeyboard } from "@react-native-community/hooks";
import * as Clipboard from "expo-clipboard";
import * as FileSystem from "expo-file-system";
import * as Notifications from "expo-notifications";
import * as Sharing from "expo-sharing";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  Dimensions,
  Linking,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRecoilState } from "recoil";
import { ColorBox, Dialog, useToast } from "../../components";
import {
  dateTime,
  moderateFontScale,
  recalculateId,
  replaceElementAtId,
  useTheme,
  verticalScale,
  reinjectElementInArray,
} from "../../tools";
import { cardColors } from "../../tools/colors";
import { notesData } from "./atom";
import { CustomizeBar } from "./customize-bar";
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
  value?: string;
  styles?: TextNoteStyle[];
}
function RenderContent({ value, styles }: RenderContentProps) {
  const isStyled = styles.length > 0;
  const indexOfLast = styles.length - 1;
  const StyledComponents = [];
  for (let i = 0; i < styles.length; i++) {}
  if (!isStyled) {
    return <Text>{value}</Text>;
  }
  return StyledComponents;
}
export function NotePage({ route, navigation }: any) {
  useBackHandler(() => {
    navigation.popToTop();
    return true;
  });
  const theme = useTheme();
  const { id }: ParamsProps = route.params;
  const [notes, setNotes] = useRecoilState(notesData);
  console.log("data:", notes.data);
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
  // useEffect(() => {
  //   if (editNote.reminder && new Date(editNote.reminder) < new Date()) {
  //     setEditNote((prev) => ({ ...prev, reminder: null }));
  //   }
  // }, []);
  const reminderSplit = new Date(
    [
      reminder.date.toJSON().slice(0, 10),

      reminder.time.toJSON().slice(11),
    ].join("T")
  );
  const scheduleDateForNotification: Date | null =
    editNote.reminder && new Date(editNote.reminder);
  const [reminderDialog, setReminderDialog] = useState(false);
  let selection = useRef<InputSelectionProps>({
    start: 0,
    end: 0,
  });

  async function scheduleNotifications() {
    try {
      if (reminderSplit >= new Date()) {
        await Notifications.scheduleNotificationAsync({
          identifier: item.id.toString(),
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
  // const [selection, setSelection] = useState({ start: 0, end: 0 });
  const noteStateIsEmpty =
    editNote.text.length === 0 && editNote.title.length === 0;
  const { top } = useSafeAreaInsets();
  const keyboard = useKeyboard();
  const isEditing = edit && !noteStateIsEmpty;
  const isCreating = !edit && !noteStateIsEmpty;
  const indexOfPrev = notes.data.findLastIndex((e) => e.id < id);
  function handleBack() {
    try {
      // if (isCreating) {
      //   setNotes((prev) => ({
      //     ...prev,
      //     data: [...prev.data, editNote],
      //   }));
      // }
      // if (isEditing) {
      //   setNotes((prev) => ({
      //     data: replaceElementAtId(prev.data, item.id, editNote),
      //   }));
      // }
      navigation.popToTop();
    } catch (error) {}
  }
  const included = notes.data.map((e) => e.id).includes(id);
  console.log("included:", included);
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

  const toast = useToast();
  const marginBottom =
    Dimensions.get("screen").height -
    (keyboard.coordinates.end.screenY || Dimensions.get("screen").height);
  console.log("editnote:", JSON.stringify(editNote));

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.background,
      }}
    >
      <Dialog
        styles={{ width: "90%" }}
        backgroundBlur={Platform.OS === "ios"}
        animation="fade"
        action={async () => {
          let { status }: any = await Notifications.getPermissionsAsync();
          if (status !== "granted") {
            status = await Notifications.requestPermissionsAsync();
          }
          if (status !== "granted") {
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
        }}
        actionLabel="Set reminder"
        title="Schedule a reminder for task"
        onCencel={() => setReminderDialog(false)}
        visible={reminderDialog}
      >
        {Platform.OS === "ios" && (
          <View style={{ rowGap: 8, height: "100%" }}>
            <DateTimePicker
              minimumDate={new Date()}
              style={{ height: "50%" }}
              mode="date"
              value={reminder.date}
              display="spinner"
              onChange={(e, date) => {
                setReminder((prev) => ({ ...prev, date }));
              }}
            />
            <DateTimePicker
              is24Hour
              style={{ height: "50%" }}
              mode="time"
              value={reminder.time}
              display="spinner"
              onChange={(e, date) => {
                setReminder((prev) => ({ ...prev, time: date }));
              }}
            />
          </View>
        )}
        {Platform.OS === "android" && (
          <>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                paddingBottom: 10,
              }}
            >
              <Text
                style={{
                  fontSize: moderateFontScale(20),
                  fontWeight: "bold",
                  color: theme.onPrimary,
                }}
              >{`Date: ${reminder.date.getDate()}.${
                reminder.date.getMonth() + 1
              }.${reminder.date.getFullYear()}`}</Text>
              <Text
                style={{
                  fontSize: moderateFontScale(20),
                  fontWeight: "bold",
                  color: theme.onPrimary,
                }}
              >{`Hour: ${reminder.time.getHours()}:${
                reminder.time.getMinutes() < 10
                  ? `0${reminder.time.getMinutes()}`
                  : reminder.time.getMinutes()
              }`}</Text>
            </View>
            <Button
              onPress={() => {
                DateTimePickerAndroid.open({
                  minimumDate: new Date(),
                  mode: "date",
                  value: reminder.date,
                  display: "spinner",
                  onChange(event, date) {
                    if (event.type === "set") {
                      setReminder((prev) => ({ ...prev, date }));
                      DateTimePickerAndroid.open({
                        is24Hour: true,
                        mode: "time",
                        value: reminder.time,
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
                  },
                });
              }}
              title="Change"
            />
          </>
        )}
      </Dialog>
      <NoteScreenHeader
        onReminderOpen={() => {
          if (noteStateIsEmpty) {
            toast({ message: "Write something to schedule reminder" });
            return;
          }
          if (scheduleDateForNotification > new Date()) {
            toast({
              button: {
                title: "Cencel",
                onPress: async () => {
                  await Notifications.cancelScheduledNotificationAsync(
                    item.id.toString()
                  );
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
        }}
        onClipboard={async () => {
          await Clipboard.setStringAsync(`${editNote.title}\n${editNote.text}`);
          toast({
            message: "Copied",
          });
        }}
        onFavoriteAdd={() =>
          setEditNote((prev) => ({
            ...prev,
            isFavorite: !prev.isFavorite,
          }))
        }
        onBack={handleBack}
        favorite={editNote.isFavorite}
        onShare={async () => {
          if (noteStateIsEmpty) {
            toast({ message: "Can't share empty content" });
            return;
          }
          try {
            await FileSystem.writeAsStringAsync(
              `${FileSystem.documentDirectory}${editNote.title.substring(
                0,
                40
              )}.txt`,
              `${editNote.title}\n${editNote.text}`
            );
            await Sharing.shareAsync(
              `${FileSystem.documentDirectory}${editNote.title.substring(
                0,
                40
              )}.txt`,
              { mimeType: "text/plain" }
            );
            await FileSystem.deleteAsync(
              `${FileSystem.documentDirectory}${editNote.title.substring(
                0,
                40
              )}.txt`
            );
          } catch (error) {
            toast({ message: error });
          }
        }}
      />
      <ScrollView
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
            selection.current.start = e.nativeEvent.selection.start;
            selection.current.end = e.nativeEvent.selection.end;
            console.log(selection.current);
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
          <RenderContent value={editNote.text} styles={editNote.styles} />
        </TextInput>
        {/* <View style={{ height: 100, backgroundColor: "red" }}></View> */}
      </ScrollView>
      <CustomizeBar
        onItalic={() => console.log(selection.current)}
        onBold={() => {
          if (selection.current.end !== selection.current.start) {
            setEditNote((prev) => ({
              ...prev,
              styles: [
                ...prev.styles,
                {
                  interval: {
                    end: selection.current.end,
                    start: selection.current.start,
                  },
                  style: { fontWeight: "bold" },
                },
              ],
            }));
          }
        }}
        boldFocused={
          editNote.styles.findIndex((e) => selection.current === e.interval) !==
          -1
        }
        backgroundOptions={
          <>
            {cardColors.map((e, i) => (
              <ColorBox
                onPress={() =>
                  setEditNote((prev) => ({ ...prev, background: e }))
                }
                bgColor={e}
                key={i}
                checked={editNote.background === e}
              />
            ))}
          </>
        }
      />
    </View>
  );
}
