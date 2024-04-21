import { TextInput, Text } from "react-native";
import { moderateFontScale } from "../../tools";
import { useTheme } from "../../hooks";
import { note } from "./types";
import { Dispatch, SetStateAction } from "react";
import { darkCardColors } from "../../tools/colors";
type NoteTitleProps = {
  editNote: note;
  setEditNote: Dispatch<SetStateAction<note>>;
};
export function NoteTitleInput({ editNote, setEditNote }: NoteTitleProps) {
  const theme = useTheme();
  return (
    <TextInput
      maxLength={1000}
      placeholderTextColor={theme.placeholder}
      onChangeText={(editedTitle) =>
        setEditNote((prev) => ({
          ...prev,
          title: editedTitle,
        }))
      }
      underlineColorAndroid="transparent"
      cursorColor={"#FFCB09"}
      placeholder={"Title"}
      multiline
      style={{
        color:
          darkCardColors.includes(editNote.background) ||
          editNote?.imageOpacity > 0.4
            ? "#ffffff"
            : "#000000",
        fontSize: moderateFontScale(30),
        fontWeight: "bold",
        fontFamily: "OpenSans",
        textAlign: editNote.contentPosition,
      }}
    >
      <Text>{editNote.title}</Text>
    </TextInput>
  );
}
