import { useKeyboard } from "@react-native-community/hooks";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  AppState,
  BackHandler,
  Dimensions,
  Text,
  TextInput,
  View,
} from "react-native";
import InputScrollView from "react-native-input-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRecoilState } from "recoil";
import { moderateFontScale, useTheme, verticalScale } from "../../tools";
import { cardColors } from "../../tools/colors";
import { notesData } from "./atom";
import { NoteScreenHeader } from "./note-screen-header";
export function NotePageCreate() {
  const navigation = useNavigation<NavigationProp<any>>();
  const [, setData] = useRecoilState(notesData);
  const [title, setTitle] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [favorite, setFavorite] = useState(false);
  const noteIsEmpty = title.length === 0 && title.length === 0;
  const theme = useTheme();
  const { width } = Dimensions.get("window");
  const { top } = useSafeAreaInsets();
  const keyboard = useKeyboard();
  function handleBack() {
    if (!noteIsEmpty) {
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
    navigation.goBack();
  }
  useEffect(() => {
    const subscribe = BackHandler.addEventListener("hardwareBackPress", () => {
      if (!noteIsEmpty) {
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
        navigation.goBack();
      } else {
        navigation.goBack();
      }

      return true;
    });
    return () => subscribe.remove();
  }, [title, text, favorite]);
  useEffect(() => {
    function createNote() {
      if (!noteIsEmpty) {
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

    return () => {
      if (AppState.currentState === "unknown") {
        createNote();
      }
    };
  }, [AppState.currentState]);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.background,
      }}
    >
      <NoteScreenHeader
        onFavoriteAdd={() => setFavorite((prev) => !prev)}
        onBack={handleBack}
        favorite={favorite}
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
        </View>
        <View
          style={{
            marginTop: verticalScale(20),
          }}
        >
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
            }}
          >
            <Text>{text}</Text>
          </TextInput>
        </View>
      </InputScrollView>
    </View>
  );
}
