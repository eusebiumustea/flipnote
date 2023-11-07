import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { BackHandler, Text, TextInput, View } from "react-native";
import InputScrollView from "react-native-input-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRecoilState } from "recoil";
import { moderateFontScale, useTheme, verticalScale } from "../../tools";
import { cardColors } from "../../tools/colors";
import { notesData } from "./atom";
import { NoteScreenHeader } from "./note-screen-header";
import { note } from "./types";
export function NotePageCreate() {
  const navigation = useNavigation<NavigationProp<any>>();
  const [notes, setNotes] = useRecoilState(notesData);
  const [newNote, setNewNote] = useState<note>({
    id: notes.data.length + 1,
    title: "",
    text: "",
    isFavorite: false,
    cardColor: cardColors[Math.floor(Math.random() * cardColors.length)],
  });
  const noteIsEmpty = newNote.text.length === 0 && newNote.title.length === 0;
  const theme = useTheme();
  const { top } = useSafeAreaInsets();
  function handleBack() {
    if (noteIsEmpty === false) {
      setNotes((prev) => ({
        ...prev,
        data: [...prev.data, newNote],
      }));
    }
    navigation.goBack();
  }
  useEffect(() => {
    const subscribe = BackHandler.addEventListener("hardwareBackPress", () => {
      if (!noteIsEmpty) {
        setNotes((prev) => ({
          data: [...prev.data, newNote],
        }));
        navigation.goBack();
      } else {
        navigation.goBack();
      }
      return true;
    });
    return () => subscribe.remove();
  }, [newNote]);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.background,
      }}
    >
      <NoteScreenHeader
        onFavoriteAdd={() =>
          setNewNote((prev) => ({
            ...prev,
            isFavorite: !prev.isFavorite,
          }))
        }
        onBack={handleBack}
        favorite={newNote.isFavorite}
      />
      <InputScrollView
        keyboardAvoidingViewProps={{ behavior: "height" }}
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{
          paddingTop: verticalScale(70) + top,
          padding: 16,
        }}
        style={{
          flex: 1,
        }}
      >
        <View style={{}}>
          <TextInput
            placeholderTextColor={theme.placeholder}
            onChangeText={(title) =>
              setNewNote((prev) => ({
                ...prev,
                title,
              }))
            }
            multiline
            selectionColor={"#FFF3C7"}
            cursorColor={"#FFCB09"}
            placeholder="Title"
            style={{
              color: theme.onBackground,
              fontSize: moderateFontScale(40),
              fontWeight: "bold",
            }}
          >
            <Text>{newNote.title}</Text>
          </TextInput>
        </View>
        <View
          style={{
            marginTop: verticalScale(20),
          }}
        >
          <TextInput
            placeholderTextColor={theme.placeholder}
            cursorColor={"#FFCB09"}
            onChangeText={(text) =>
              setNewNote((prev) => ({
                ...prev,
                text,
              }))
            }
            multiline
            selectionColor={"#FFF3C7"}
            placeholder="Take the note"
            style={{
              color: theme.onBackground,
              fontSize: moderateFontScale(18),
            }}
          >
            <Text>{newNote.text}</Text>
          </TextInput>
        </View>
      </InputScrollView>
    </View>
  );
}
