import React, { Dispatch, LegacyRef, SetStateAction, forwardRef } from "react";
import { TextInput, TextInputProps } from "react-native";
import { darkCardColors } from "../../constants/colors";
import { moderateFontScale } from "../../utils";
import { Note } from "./types";
type NoteTitleProps = {
  editNote: Note;
  setEditNote: Dispatch<SetStateAction<Note>>;
  theme: any;
  inputProps?: TextInputProps;
};

export const NoteTitleInput = ({
  editNote,
  setEditNote,
  theme,
  inputProps,
}: NoteTitleProps) => {
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
        textAlign: editNote.contentPosition,
      }}
      {...inputProps}
    />
  );
};
