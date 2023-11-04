import AsyncStorage from "@react-native-async-storage/async-storage";
import { useKeyboard } from "@react-native-community/hooks";
import { useEffect, useMemo, useState } from "react";
import { Dimensions, Text, TextInput, ToastAndroid, View } from "react-native";
import InputScrollView from "react-native-input-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRecoilState } from "recoil";
import { moderateFontScale, useTheme, verticalScale } from "../../tools";
import { notesData } from "./atom";
import { NoteScreenHeader } from "./note-screen-header";
import { NavigationProp, useNavigation } from "@react-navigation/native";

export function NotePageEdit({ route }: any) {
  const { item, currentItem } = route.params;
  const [editedTitle, setEditedTitle] = useState<string>(item.title);
  const [editedText, setEditedText] = useState<string>(item.text);
  const [data, setData] = useRecoilState(notesData);
  const [favorite, setFavorite] = useState(false);
  const theme = useTheme();
  const { width } = Dimensions.get("window");
  const { top } = useSafeAreaInsets();
  const keyboard = useKeyboard();
  const noteIsEmpty =
    favorite === false && editedText.length === 0 && editedTitle.length === 0;
  useEffect(() => {
    function Save() {
      try {
        if (noteIsEmpty) {
          setData((prev) => {
            const newData = [...prev.data];
            return {
              ...prev,
              data: newData.filter((e) => e !== newData[currentItem]),
            };
          });
        }
        if (editedTitle.length > 0 || editedTitle.length > 0) {
          setData((prev) => {
            const newData = [...prev.data];
            if (currentItem >= 0 && currentItem < newData.length) {
              const updatedItem = {
                title: editedTitle,
                text: editedText,
                isFavorite: favorite,
                cardColor: newData[currentItem].cardColor,
              };
              newData.splice(currentItem, 1, updatedItem);
            }
            return {
              ...prev,
              data: newData,
            };
          });
        }
      } catch (error) {
        ToastAndroid.show(`Failed to save note: ${error}`, 300);
      }
    }
    return () => Save();
  }, [editedText, editedTitle, favorite]);
  useEffect(() => {
    const storeData = async (value: any) => {
      try {
        await AsyncStorage.setItem("userdata", JSON.stringify(value));
      } catch (e) {
        console.log(e);
      }
    };
    storeData(data.data);
    return () => {
      storeData(data.data);
    };
  }, [data]);
  const navigation = useNavigation<NavigationProp<any>>();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.background,
      }}
    >
      <NoteScreenHeader
        onFavoriteAdd={() => setFavorite(true)}
        onBack={() => navigation.goBack()}
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
    </View>
  );
}
