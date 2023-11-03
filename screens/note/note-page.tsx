import { useState } from "react";
import { Dimensions, Text, TextInput, View } from "react-native";
import InputScrollView from "react-native-input-scroll-view";
import { useTheme, verticalScale } from "../../tools";
import { NoteScreenHeader } from "./note-screen-header";
import { useSafeAreaInsets } from "react-native-safe-area-context";
interface NotePageProps {
  // titleValue?: string;
  // onTitleChange?: (e: string) => void;
  // textValue?: string;
  // onTextChange?: (e: string) => void;
  onBack?: () => void;
}
export function NotePage({
  // titleValue,
  // onTitleChange,
  // textValue,
  // onTextChange,
  onBack,
}: NotePageProps) {
  const [title, setTitle] = useState<string>("");
  const [text, setText] = useState<string>("");
  const theme = useTheme();
  const { width } = Dimensions.get("window");
  const { top } = useSafeAreaInsets();
  return (
    <View
      style={{ flex: 1, backgroundColor: theme.background, paddingTop: top }}
    >
      <NoteScreenHeader onBack={onBack} />
      <InputScrollView
        contentContainerStyle={{ paddingTop: verticalScale(60), padding: 16 }}
        style={{
          flex: 1,
        }}
      >
        <TextInput
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
          }}
        >
          {title?.split("").map((e, i) => (
            <Text key={i}>{e}</Text>
          ))}
        </TextInput>
        <TextInput
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
          }}
        >
          {text?.split("").map((e, i) => (
            <Text style={{}} key={i}>
              {e}
            </Text>
          ))}
        </TextInput>
      </InputScrollView>
    </View>
  );
}
