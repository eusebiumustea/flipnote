import React, {
  Dispatch,
  LegacyRef,
  SetStateAction,
  forwardRef,
  useRef,
} from "react";
import { Button, TextInput, TextInputProps } from "react-native";
import { darkCardColors } from "../../constants/colors";
import { moderateFontScale } from "../../utils";
import { Note } from "./types";
import { useTheme } from "../../hooks";
type NoteTitleProps = {
  editNote: Note;
  setEditNote: Dispatch<SetStateAction<Note>>;
  inputProps?: TextInputProps;
};

export const NoteTitleInput = ({
  editNote,
  setEditNote,
  inputProps,
}: NoteTitleProps) => {
  const inputRef = useRef(null);
  const theme = useTheme();
  return (
    <TextInput
      ref={inputRef}
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
      value={editNote.title}
      style={{
        color:
          darkCardColors.includes(editNote.background) ||
          editNote.imageOpacity > 0.4
            ? "#ffffff"
            : "#000000",
        fontSize: moderateFontScale(30),
        fontWeight: "bold",
        fontFamily: "OpenSans",
        marginHorizontal: 8,
      }}
      {...inputProps}
    />
  );
};
