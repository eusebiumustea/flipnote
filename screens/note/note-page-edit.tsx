import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useMemo, useState } from "react";
import {
  BackHandler,
  Dimensions,
  Text,
  TextInput,
  ToastAndroid,
} from "react-native";
import InputScrollView from "react-native-input-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRecoilState } from "recoil";
import { moderateFontScale, useTheme, verticalScale } from "../../tools";
import { notesData } from "./atom";
import { NoteScreenHeader } from "./note-screen-header";
import { note } from "./types";
import { KeyboardState } from "react-native-reanimated";
import { useKeyboard } from "@react-native-community/hooks";
interface EditNotePageProps {
  item: note;
  onAnimationClose?: any;
  open?: boolean;
  currentItem: number;
}
export function NotePageEdit({
  onAnimationClose,
  open,
  item,
  currentItem,
}: EditNotePageProps) {
  useMemo(() => {
    const back = BackHandler.addEventListener("hardwareBackPress", () => {
      handleBack();
      return true;
    });
    if (open === false) {
      back.remove();
      BackHandler.addEventListener("hardwareBackPress", () => {
        BackHandler.exitApp();
        return false;
      });
    }
  }, [open]);
  const [editedTitle, setEditedTitle] = useState<string>(item.title);
  const [editedText, setEditedText] = useState<string>(item.text);
  const [data, setData] = useRecoilState(notesData);
  const [favorite, setFavorite] = useState(false);
  const theme = useTheme();
  const { width } = Dimensions.get("window");
  const { top } = useSafeAreaInsets();
  const keyboard = useKeyboard();

  function handleBack() {
    try {
      if (item.title.length > 0 || item.text.length > 0) {
        setData((prev) => ({
          ...prev,
          data: [
            ...prev.data.filter((e) => e !== prev.data[currentItem]),
            {
              id: prev.data[currentItem].id,
              title: editedTitle,
              text: editedText,
              isFavorite: favorite,
              cardColor: prev.data[currentItem].cardColor,
            },
          ],
          loading: false,
        }));
      }
    } catch (error) {
      ToastAndroid.show(`Failed to save note: ${error}`, 300);
      onAnimationClose();
    } finally {
      onAnimationClose();
    }
  }

  useMemo(() => {
    const storeData = async (value: any) => {
      try {
        await AsyncStorage.setItem("userdata", JSON.stringify(value));
      } catch (e) {
        console.log(e);
      }
    };
    storeData(data.data);
  }, [data.data]);
  return (
    <>
      <NoteScreenHeader
        onFavoriteAdd={() => setFavorite(true)}
        onBack={handleBack}
      />
      <InputScrollView
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
          onSelectionChange={(e) => {
            const start = e.nativeEvent.selection.start;
            const end = e.nativeEvent.selection.end;
          }}
          scrollEnabled={false}
          onChangeText={setEditedTitle}
          underlineColorAndroid="transparent"
          keyboardType="default"
          selectTextOnFocus={false}
          multiline
          selectionColor={"#FFF3C7"}
          placeholder="Title"
          style={{
            width: "100%",
            height: "auto",
            color: theme.onBackground,
            fontSize: moderateFontScale(40),
            fontWeight: "bold",
          }}
        >
          <Text>{editedTitle}</Text>
        </TextInput>
        <TextInput
          placeholderTextColor={theme.placeholder}
          cursorColor={"#FFCB09"}
          scrollEnabled={false}
          clearTextOnFocus
          selectTextOnFocus={false}
          onChangeText={setEditedText}
          underlineColorAndroid="transparent"
          keyboardType="default"
          multiline
          selectionColor={"#FFF3C7"}
          placeholder="Take the note"
          style={{
            width: "100%",
            height: "auto",
            color: theme.onBackground,
            fontSize: moderateFontScale(18),
            marginTop: verticalScale(20),
          }}
        >
          <Text style={{}}>{editedText}</Text>
        </TextInput>
      </InputScrollView>
    </>
  );
}
