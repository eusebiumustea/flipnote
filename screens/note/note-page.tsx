import { useBackHandler, useKeyboard } from "@react-native-community/hooks";
import * as Clipboard from "expo-clipboard";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as Notifications from "expo-notifications";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  Dimensions,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRecoilState } from "recoil";
import { ColorBox, Dialog, useToast } from "../../components";
import {
  moderateFontScale,
  replaceElementAtId,
  useTheme,
  verticalScale,
} from "../../tools";
import { notesData } from "./atom";
import { CustomizeBar } from "./customize-bar";
import { NoteScreenHeader } from "./note-screen-header";
import { InputSelectionProps, ReminderProps, note } from "./types";
import { cardColors, darkCardColors } from "../../tools/colors";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
interface ParamsProps {
  id: number;
  edit: boolean;
}

export function NotePage({ route, navigation }: any) {
  const [showOption, setShowOption] = useState(false);

  const theme = useTheme();
  const { id, edit }: ParamsProps = route.params;
  const [notes, setNotes] = useRecoilState(notesData);
  const item = useMemo(() => {
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
  }, [id, edit]);
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
  const [reminderDialog, setReminderDialog] = useState(false);
  let selection = useRef<InputSelectionProps>({
    start: 0,
    end: 0,
  });
  async function registerNotifications() {
    let { status }: any = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
      status = await Notifications.requestPermissionsAsync();
    }
    if (status !== "granted") {
      toast({ message: "Permission denied" });
      return;
    }
  }
  async function scheduleNotifications() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: editNote.title ? editNote.title : "Flipnote",
        body: editNote.text ? editNote.text : editNote.title,
      },
      trigger: null,
    });
  }
  async function setupNotifications() {
    if (Platform.OS === "ios") {
      await registerNotifications();
    }
    await scheduleNotifications();
  }
  // const [selection, setSelection] = useState({ start: 0, end: 0 });
  const empty = item.text.length === 0 && item.title.length === 0;
  const noteStateIsEmpty =
    editNote.text.length === 0 && editNote.title.length === 0;
  const { top } = useSafeAreaInsets();
  const keyboard = useKeyboard();
  const isEditing = !empty && !noteStateIsEmpty;
  const isCreating = empty && !noteStateIsEmpty;
  function handleBack() {
    try {
      if (isCreating) {
        setNotes((prev) => ({
          ...prev,
          data: [...prev.data, editNote],
        }));
      }
      if (isEditing) {
        setNotes((prev) => ({
          data: replaceElementAtId(prev.data, item.id, editNote),
        }));
      }
      navigation.popToTop();
    } catch (error) {}
  }
  useBackHandler(() => {
    handleBack();
    return true;
  });
  const toast = useToast();
  const marginBottom =
    Dimensions.get("screen").height -
    (keyboard.coordinates.start?.screenY || Dimensions.get("screen").height);
  function renderText(text: string, selection: InputSelectionProps) {
    let TextComponents = [<Text>{text}</Text>];
    if (selection.end !== selection.start) {
      TextComponents = [
        <Text key={0}>{text.slice(0, selection.start)}</Text>,
        <Text key={1}>{text.slice(selection.start, selection.end)}</Text>,
        <Text key={2}>{text.slice(selection.end)}</Text>,
      ];
    }
    console.log(TextComponents);
    return TextComponents;
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.background,
      }}
    >
      <Dialog
        styles={{ width: "90%" }}
        animation="fade"
        action={async () => {
          await setupNotifications();
          if (reminder.date >= new Date()) {
            setEditNote((prev) => ({
              ...prev,
              reminder: {
                date: reminder.date,
                time: reminder.time,
              },
            }));
            toast({
              message: `Reminder set for ${reminder.date.getDate()}.${
                reminder.date.getMonth() + 1
              }.${reminder.date.getFullYear()}  ${reminder.time.getHours()}:${reminder.time.getMinutes()}`,
            });
          }
          if (reminder.date < new Date()) {
            setEditNote((prev) => ({
              ...prev,
              reminder: {
                date: new Date(),
                time: new Date(),
              },
            }));
            toast({
              message: `Reminder set for ${new Date().getDate()}.${
                new Date().getMonth() + 1
              }.${new Date().getFullYear()}  ${new Date().getHours()}:${new Date().getMinutes()}`,
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
          <>
            <DateTimePicker
              mode="date"
              value={reminder.date}
              display="spinner"
              onChange={(e, date) => {
                setReminder((prev) => ({ ...prev, date }));
              }}
            />
            <DateTimePicker
              value={reminder.date}
              display="spinner"
              onChange={(e, date) => {
                setReminder((prev) => ({ ...prev, time: date }));
              }}
            />
          </>
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
                style={{ fontSize: moderateFontScale(20), fontWeight: "bold" }}
              >{`Date: ${reminder.date.getDate()}.${
                reminder.date.getMonth() + 1
              }.${reminder.date.getFullYear()}`}</Text>
              <Text
                style={{ fontSize: moderateFontScale(20), fontWeight: "bold" }}
              >{`Hour: ${reminder.time.getHours()}:${reminder.time.getMinutes()}`}</Text>
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
          if (reminder.time.getTime() <= new Date().getTime()) {
            setEditNote((prev) => ({ ...prev, reminder: null }));
            setReminderDialog(true);
            return;
          }
          if (editNote.reminder) {
            toast({
              message: `Reminder already set for ${reminder.date.getDate()}.${
                reminder.date.getMonth() + 1
              }.${reminder.date.getFullYear()}  ${reminder.time.getHours()}:${reminder.time.getMinutes()}`,
            });
            return;
          }

          if (empty) {
            toast({ message: "Write something to schedule reminder" });
            return;
          }
          setReminderDialog(true);
        }}
        onClipboard={async () => {
          await Clipboard.setStringAsync(`${editNote.title}\n${editNote.text}`);
          toast({ message: "Copied" });
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
        keyboardShouldPersistTaps="handled"
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
            fontSize: moderateFontScale(16),
            marginTop: verticalScale(20),
            fontFamily: "google-sans",
            paddingBottom: verticalScale(200),
          }}
        >
          <Text>{editNote.text}</Text>
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
                { interval: selection.current, style: { fontWeight: "bold" } },
              ],
            }));
          }
        }}
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
