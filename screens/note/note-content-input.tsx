import { Dispatch, SetStateAction } from "react";
import { TextInput } from "react-native";
import { useEditNoteContent, useTheme } from "../../hooks";
import { InputSelectionProps, note } from "./types";
import { verticalScale } from "../../tools";
type NoteContentInputProps = {
  setEditNote?: Dispatch<SetStateAction<note>>;
  editNote?: note;
  selection?: InputSelectionProps;
  setSelection?: Dispatch<SetStateAction<InputSelectionProps>>;
};
export function NoteContentInput({
  editNote,
  setEditNote,
  selection,
  setSelection,
}: NoteContentInputProps) {
  const theme = useTheme();
  return (
    <TextInput
      maxLength={200000}
      onSelectionChange={({ nativeEvent: { selection } }) => {
        setSelection(selection);
      }}
      placeholderTextColor={theme.placeholder}
      cursorColor={"#FFCB09"}
      selectionColor={"#FFF3C7"}
      autoCapitalize="sentences"
      autoCorrect={false}
      spellCheck={false}
      inputMode="text"
      style={{
        textAlign: editNote.contentPosition,
      }}
      onChangeText={(text) => {
        if (text.length > editNote.text.length) {
          setEditNote((prev) => ({
            ...prev,
            text,
            styles: prev.styles.map((style, i) => {
              if (selection.end <= style.interval.start) {
                return {
                  ...style,
                  interval: {
                    start: style.interval.start + 1,
                    end: style.interval.end + 1,
                  },
                };
              }
              return style;
            }),
          }));
          return;
        }
        if (text.length < editNote.text.length) {
          setEditNote((prev) => ({
            ...prev,
            text,
            styles: prev.styles.map((style, i) => {
              if (selection.end <= style.interval.start) {
                return {
                  ...style,
                  interval: {
                    start: style.interval.start - 1,
                    end: style.interval.end - 1,
                  },
                };
              }
              return style;
            }),
          }));
          return;
        }
        setEditNote((prev) => ({
          ...prev,
          text,
        }));
      }}
      multiline
      placeholder="Take the note"
    >
      {useEditNoteContent(editNote.styles, editNote.text)}
    </TextInput>
  );
}
