import { useKeyboard } from "@react-native-community/hooks";
import { useEffect, useMemo, useState } from "react";
import { BackHandler, Text, TextInput, View } from "react-native";

import { NavigationProp, useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRecoilState } from "recoil";
import {
  moderateFontScale,
  removeElementAtId,
  removeElementAtIndex,
  replaceElementAtId,
  replaceElementAtIndex,
  useTheme,
  verticalScale,
} from "../../tools";
import { notesData } from "./atom";
import { NoteScreenHeader } from "./note-screen-header";
import { note } from "./types";
import { FadeView } from "../../components/fade-view";

interface ParamsProps {
  item: note;
  index: number;
}
export function NotePageEdit({ route }: any) {
  const { item }: ParamsProps = route.params;
  const [data, setData] = useRecoilState(notesData);
  const [editNote, setEditNote] = useState<note>({
    id: item.id,
    title: item.title,
    text: item.text,
    isFavorite: item.isFavorite,
    cardColor: item.cardColor,
  });
  const navigation = useNavigation<NavigationProp<any>>();
  const theme = useTheme();
  const { top } = useSafeAreaInsets();
  const keyboard = useKeyboard();
  const noteIsEmpty = editNote.text.length === 0 && editNote.title.length === 0;
  function handleBack() {
    if (noteIsEmpty) {
      setData((prev) => ({
        data: removeElementAtId(prev.data, item.id),
      }));
    } else {
      setData((prev) => ({
        data: replaceElementAtId(prev.data, item.id, editNote),
      }));
    }

    navigation.goBack();
  }
  useEffect(() => {
    const subscribe = BackHandler.addEventListener("hardwareBackPress", () => {
      if (noteIsEmpty) {
        setData((prev) => ({
          data: removeElementAtId(prev.data, item.id),
        }));
      } else {
        setData((prev) => ({
          data: replaceElementAtId(prev.data, item.id, editNote),
        }));
      }
      navigation.goBack();
      return true;
    });
    return () => subscribe.remove();
  }, [editNote]);
  useMemo(() => {
    const prevItemIndex = data.data.findLastIndex((e) => e.id < item.id);
    setEditNote((prev) => ({ ...prev, id: prevItemIndex + 2 }));
  }, [data.data]);
  return (
    <FadeView
      style={{
        flex: 1,
        backgroundColor: theme.background,
      }}
    >
      <NoteScreenHeader
        onFavoriteAdd={() =>
          setEditNote((prev) => ({
            ...prev,
            isFavorite: !prev.isFavorite,
          }))
        }
        onBack={handleBack}
        favorite={editNote.isFavorite}
      />
      <KeyboardAwareScrollView
        contentContainerStyle={{
          paddingTop: verticalScale(70) + top,
          padding: 16,
        }}
        style={{
          flex: 1,
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
          selectionColor={"#FFF3C7"}
          placeholder="Title"
          style={{
            color: theme.onBackground,
            fontSize: moderateFontScale(40),
            fontWeight: "bold",
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
          selectionColor={"#FFF3C7"}
          placeholder="Take the note"
          style={{
            color: theme.onBackground,
            fontSize: moderateFontScale(18),
            marginTop: verticalScale(20),
          }}
        >
          <Text style={{}}>{editNote.text}</Text>
        </TextInput>
      </KeyboardAwareScrollView>
    </FadeView>
  );
}
