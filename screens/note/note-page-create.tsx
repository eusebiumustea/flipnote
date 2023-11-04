import { useKeyboard } from "@react-native-community/hooks";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Dimensions, Text, TextInput, View } from "react-native";
import InputScrollView from "react-native-input-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRecoilState } from "recoil";
import { moderateFontScale, useTheme, verticalScale } from "../../tools";
import { cardColors } from "../../tools/colors";
import { notesData } from "./atom";
import { NoteScreenHeader } from "./note-screen-header";
export function NotePageCreate() {
  const navigation = useNavigation<NavigationProp<any>>();
  const [data, setData] = useRecoilState(notesData);
  const [title, setTitle] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [favorite, setFavorite] = useState(false);
  const theme = useTheme();
  const { width } = Dimensions.get("window");
  const { top } = useSafeAreaInsets();
  const keyboard = useKeyboard();
  useEffect(() => {
    function createNote() {
      if (title.length > 0 || text.length > 0) {
        setData((prev) => ({
          ...prev,
          data: [
            ...prev.data,
            {
              title: title,
              text: text,
              isFavorite: favorite,
              cardColor:
                cardColors[Math.floor(Math.random() * cardColors.length)],
            },
          ],
        }));
      }
    }

    navigation.addListener("beforeRemove", () => {
      console.log("closing");
      createNote();
    });
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <NoteScreenHeader
        onFavoriteAdd={() => setFavorite(true)}
        onBack={() => navigation.goBack()}
      />
      <InputScrollView
        keyboardOffset={keyboard.keyboardHeight}
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
          onChangeText={(e) => setTitle(e)}
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
          <Text>{title}</Text>
        </TextInput>
        <TextInput
          placeholderTextColor={theme.placeholder}
          cursorColor={"#FFCB09"}
          onChangeText={(e) => setText(e)}
          multiline
          selectionColor={"#FFF3C7"}
          placeholder="Take the note"
          style={{
            color: theme.onBackground,
            fontSize: moderateFontScale(18),
            marginTop: verticalScale(20),
          }}
        >
          <Text>{text}</Text>
        </TextInput>
      </InputScrollView>
    </View>
  );
}
