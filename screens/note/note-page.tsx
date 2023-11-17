import { useBackHandler, useKeyboard } from "@react-native-community/hooks";
import * as Clipboard from "expo-clipboard";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  ScrollView,
  Text,
  TextInput,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRecoilState } from "recoil";
import { ColorBox, useToast } from "../../components";
import {
  moderateFontScale,
  replaceElementAtId,
  useTheme,
  verticalScale,
} from "../../tools";
import { notesData } from "./atom";
import { CustomizeBar } from "./customize-bar";
import { NoteScreenHeader } from "./note-screen-header";
import { InputSelectionProps, note } from "./types";
import { cardColors, darkCardColors } from "../../tools/colors";
interface ParamsProps {
  id: number;
  edit: boolean;
}

export function NotePage({ route, navigation }: any) {
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
  });
  let selection = useRef<InputSelectionProps>({
    start: 0,
    end: 0,
  });
  console.log(JSON.stringify(editNote));
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
      <NoteScreenHeader
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
          {editNote.styles.length > 0 ? (
            editNote.styles.map((e, i) => (
              <>
                <Text>{editNote.text.slice(0, e.interval.start)}</Text>
                <Text style={{ ...e.style }} key={i}>
                  {editNote.text.slice(e.interval.start, e.interval.end)}
                </Text>
                <Text>{editNote.text.slice(e.interval.end)}</Text>
              </>
            ))
          ) : (
            <Text>{editNote.text}</Text>
          )}
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
