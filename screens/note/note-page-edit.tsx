import AsyncStorage from "@react-native-async-storage/async-storage";
import { useKeyboard } from "@react-native-community/hooks";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  Platform,
  Text,
  TextInput,
  ToastAndroid,
  View,
} from "react-native";
import InputScrollView from "react-native-input-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRecoilState } from "recoil";
import {
  moderateFontScale,
  removeElementAtIndex,
  replaceElementAtIndex,
  useTheme,
  verticalScale,
} from "../../tools";
import { notesData } from "./atom";
import { NoteScreenHeader } from "./note-screen-header";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { cardColors } from "../../tools/colors";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
export function NotePageEdit({ route }: any) {
  const { item, currentItem } = route.params;
  const [editedTitle, setEditedTitle] = useState<string>(item.title);
  const [editedText, setEditedText] = useState<string>(item.text);
  const [favorite, setFavorite] = useState(item.isFavorite);
  const [data, setData] = useRecoilState(notesData);

  const theme = useTheme();
  const { width, height } = Dimensions.get("window");
  const { top } = useSafeAreaInsets();
  const keyboard = useKeyboard();
  const scrollRef = useRef<KeyboardAwareScrollView>(null);
  const noteIsEmpty = editedText.length === 0 && editedTitle.length === 0;
  useEffect(() => {
    function Save() {
      if (noteIsEmpty) {
        setData((prev) => ({
          data: removeElementAtIndex(prev.data, currentItem),
        }));
      } else {
        setData((prev) => ({
          data: replaceElementAtIndex(prev.data, currentItem, {
            title: editedTitle,
            text: editedText,
            isFavorite: favorite,
            cardColor:
              cardColors[Math.floor(Math.random() * cardColors.length)],
          }),
        }));
      }
    }
    navigation.addListener("beforeRemove", () => Save());
    return navigation.removeListener("beforeRemove", Save);
  }, [editedText, editedTitle, favorite]);
  const navigation = useNavigation<NavigationProp<any>>();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.background,
      }}
    >
      <NoteScreenHeader
        onFavoriteAdd={() => setFavorite((prev) => !prev)}
        onBack={() => navigation.goBack()}
        favorite={favorite}
      />
      <KeyboardAwareScrollView
        ref={scrollRef}
        contentContainerStyle={{
          paddingTop: keyboard.keyboardShown
            ? verticalScale(180) + top
            : verticalScale(70) + top,
          padding: 16,
        }}
        style={{
          flex: 1,
        }}
      >
        <TextInput
          placeholderTextColor={theme.placeholder}
          onChangeText={setEditedTitle}
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
          <Text>{editedTitle}</Text>
        </TextInput>

        <TextInput
          placeholderTextColor={theme.placeholder}
          cursorColor={"#FFCB09"}
          selectTextOnFocus={false}
          onChangeText={setEditedText}
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
          <Text style={{}}>{editedText}</Text>
        </TextInput>
      </KeyboardAwareScrollView>
    </View>
  );
}
