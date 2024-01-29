import { Dispatch, SetStateAction, useRef } from "react";
import { TextInput, TextInputProps } from "react-native";
import { useEditNoteContent, useTheme } from "../../hooks";
import { range, removeElementAtIndex } from "../../tools";
import { InputSelectionProps, note } from "./types";
type NoteContentInputProps = {
  setEditNote?: Dispatch<SetStateAction<note>>;
  editNote?: note;
  inputSelection?: InputSelectionProps;
  setInputSelection?: Dispatch<SetStateAction<InputSelectionProps>>;
  inputProps?: TextInputProps;
};
export function NoteContentInput({
  editNote,
  setEditNote,
  inputSelection,
  setInputSelection,
  inputProps,
}: NoteContentInputProps) {
  const inputRef = useRef<TextInput>(null);
  const theme = useTheme();
  console.log(editNote.styles);
  const textSelected = inputSelection.start !== inputSelection.end;
  return (
    <TextInput
      ref={inputRef}
      selection={inputSelection}
      maxLength={100000}
      onSelectionChange={({ nativeEvent: { selection } }) => {
        setInputSelection(selection);
      }}
      placeholderTextColor={theme.placeholder}
      cursorColor={"#FFCB09"}
      scrollEnabled={false}
      selectionColor={"#FFF3C7"}
      autoCorrect={false}
      spellCheck={false}
      style={{
        textAlign: editNote.contentPosition,
      }}
      onChangeText={(text) => {
        const increment = text.length > editNote.text.length;
        const decrement = text.length < editNote.text.length;
        editNote.styles.map((style, i) => {
          if (text.slice(style.interval.start).length === 0) {
            setEditNote((prev) => ({
              ...prev,
              text,
              styles: removeElementAtIndex(prev.styles, i),
            }));

            return;
          }
          if (style.interval.start === style.interval.end) {
            setEditNote((prev) => ({
              ...prev,
              text,
              styles: removeElementAtIndex(prev.styles, i),
            }));
            return;
          }
          if (decrement && style.interval.end - style.interval.start === 1) {
            setEditNote((prev) => ({
              ...prev,
              text,
              styles: removeElementAtIndex(prev.styles, i),
            }));
            return;
          }
        });
        setEditNote((prev) => ({
          ...prev,
          text,
          styles: prev.styles.map((style, i) => {
            if (
              !textSelected &&
              decrement &&
              range(style.interval.start + 1, style.interval.end).includes(
                inputSelection.end
              )
            ) {
              return {
                ...style,
                interval: {
                  ...style.interval,
                  end:
                    style.interval.end - (editNote.text.length - text.length),
                },
              };
            }
            if (
              !textSelected &&
              increment &&
              range(style.interval.start + 1, style.interval.end - 1).includes(
                inputSelection.start
              )
            ) {
              return {
                ...style,
                interval: {
                  ...style.interval,
                  end:
                    style.interval.end + (text.length - editNote.text.length),
                },
              };
            }
            if (
              !textSelected &&
              decrement &&
              inputSelection.end <= style.interval.start
            ) {
              return {
                ...style,
                interval: {
                  start:
                    style.interval.start - (editNote.text.length - text.length),
                  end:
                    style.interval.end - (editNote.text.length - text.length),
                },
              };
            }
            if (
              !textSelected &&
              increment &&
              inputSelection.end <= style.interval.start
            ) {
              return {
                ...style,
                interval: {
                  start:
                    style.interval.start + (text.length - editNote.text.length),
                  end:
                    style.interval.end + (text.length - editNote.text.length),
                },
              };
            }
            return style;
          }),
        }));
      }}
      multiline
      placeholder="Take the note"
      {...inputProps}
    >
      {useEditNoteContent(editNote.styles, editNote.text)}
    </TextInput>
  );
}
