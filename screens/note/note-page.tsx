import { useBackHandler, useKeyboard } from "@react-native-community/hooks";
import { Dimensions, ScrollView, Text, TextInput, View } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRecoilState } from "recoil";
import {
  moderateFontScale,
  replaceElementAtId,
  useTheme,
  verticalScale,
} from "../../tools";
import { notesData } from "./atom";
import { CustomizeBar } from "./customize-bar";
import { NoteScreenHeader } from "./note-screen-header";
import { note } from "./types";
import { useMemo, useState } from "react";
import { cardColors } from "../../tools/colors";
import * as Clipboard from "expo-clipboard";
import { ColorBox, useToast } from "../../components";
interface ParamsProps {
  id: number;
  edit: boolean;
}
export function NotePage({ route, navigation }: any) {
  const { id, edit }: ParamsProps = route.params;
  const [notes, setNotes] = useRecoilState(notesData);
  const item = useMemo(() => {
    if (!edit) {
      return {
        id: id,
        title: "",
        text: "",
        isFavorite: false,
        background: "#fff",
      };
    }
    return notes.data.find((e) => e.id === id);
  }, [id]);
  const [editNote, setEditNote] = useState<note>({
    id: item.id,
    title: item.title,
    text: item.text,
    isFavorite: item.isFavorite,
    background: item.background,
  });
  const empty = item.text.length === 0 && item.title.length === 0;
  const noteStateIsEmpty =
    editNote.text.length === 0 && editNote.title.length === 0;
  const theme = useTheme();
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
    } catch (error) {}
    return false;
  });
  const toast = useToast();
  const marginBottom =
    Dimensions.get("screen").height -
    (keyboard.coordinates.start?.screenY || Dimensions.get("screen").height);

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
            color: theme.onBackground,
            fontSize: moderateFontScale(28),
            fontWeight: "bold",
            fontFamily: "google-sans",
          }}
        >
          <Text>{editNote.title}</Text>
        </TextInput>

        <TextInput
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
            color: theme.onBackground,
            fontSize: moderateFontScale(16),
            marginTop: verticalScale(20),
            fontFamily: "google-sans",
            paddingBottom: verticalScale(200),
          }}
        >
          <Text style={{}}>{editNote.text}</Text>
        </TextInput>
        {/* <View style={{ height: 100, backgroundColor: "red" }}></View> */}
      </ScrollView>
      <CustomizeBar
        backgroundItems={
          <>
            {cardColors.map((e) => (
              <ColorBox
                key={e}
                onPress={() =>
                  setEditNote((prev) => ({ ...prev, background: e }))
                }
                bgColor={e}
                checked={editNote.background === e}
              />
            ))}
          </>
        }
      />
    </View>
  );
}
