import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMemo, useState } from "react";
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
import { cardColors } from "../../tools/colors";
import { notesData } from "./atom";
import { NoteScreenHeader } from "./note-screen-header";
interface NotePageProps {
  onBack?: () => void;
  open: boolean;
}
export function NotePage({ onBack = () => handleBack(), open }: NotePageProps) {
  useMemo(() => {
    const back = BackHandler.addEventListener("hardwareBackPress", () => {
      onBack();
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
  const [title, setTitle] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [data, setData] = useRecoilState(notesData);
  const [favorite, setFavorite] = useState(false);
  const theme = useTheme();
  const { width } = Dimensions.get("window");
  const { top } = useSafeAreaInsets();
  function handleBack() {
    try {
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
          loading: false,
        }));
      }
      onBack();
    } catch (error) {
      ToastAndroid.show(`Failed to save note: ${error}`, 300);
      onBack();
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
          onChangeText={setTitle}
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
          {title?.split("").map((e, i) => (
            <Text key={i}>{e}</Text>
          ))}
        </TextInput>
        <TextInput
          placeholderTextColor={theme.placeholder}
          cursorColor={"#FFCB09"}
          scrollEnabled={false}
          clearTextOnFocus
          selectTextOnFocus={false}
          onChangeText={setText}
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
          {text?.split("").map((e, i) => (
            <Text style={{}} key={i}>
              {e}
            </Text>
          ))}
        </TextInput>
      </InputScrollView>
    </>
  );
}
