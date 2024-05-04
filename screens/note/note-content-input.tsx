import { Dispatch, SetStateAction, useRef } from "react";

import { TextInput, TextInputProps } from "react-native";
import { contentLengthLimit } from "../../constants";
import { useEditNoteContent, useTheme } from "../../hooks";
import { removeElementAtIndex } from "../../utils";
import { InputSelectionProps, note } from "./types";
type NoteContentInputProps = {
  setEditNote?: Dispatch<SetStateAction<note>>;
  editNote?: note;
  setInputSelection?: Dispatch<SetStateAction<InputSelectionProps>>;
  inputProps?: TextInputProps;
  inputSelection?: InputSelectionProps;
};
export const NoteContentInput = ({
  editNote,
  setEditNote,
  setInputSelection,
  inputProps,
}: NoteContentInputProps) => {
  const theme = useTheme();
  let selectionRef = useRef<InputSelectionProps>({
    start: 0,
    end: 0,
  }).current;
  const inputRef = useRef<TextInput>(null);

  return (
    <TextInput
      ref={inputRef}
      maxLength={contentLengthLimit()}
      onSelectionChange={({ nativeEvent: { selection } }) => {
        selectionRef.start = selection.start;
        selectionRef.end = selection.end;
        setInputSelection(selection);
      }}
      importantForAutofill="no"
      placeholderTextColor={theme.placeholder}
      scrollEnabled={false}
      autoCorrect={false}
      spellCheck={false}
      autoComplete="off"
      textAlign={editNote.contentPosition}
      textContentType="none"
      allowFontScaling={false}
      smartInsertDelete={false}
      onChangeText={(text) => {
        const textSelected = selectionRef.end > selectionRef.start + 1;
        const increment = text.length > editNote.text.length;
        const decrement = text.length < editNote.text.length;
        editNote.styles.forEach((style, i) => {
          if (
            (textSelected &&
              decrement &&
              selectionRef.start <= style.interval.start &&
              selectionRef.end >= style.interval.end) ||
            (textSelected &&
              decrement &&
              selectionRef.start > style.interval.start &&
              selectionRef.start < style.interval.end) ||
            (textSelected &&
              decrement &&
              selectionRef.end > style.interval.start &&
              selectionRef.end < style.interval.end) ||
            selectionRef.start >= editNote.text.length - 1
          ) {
            setEditNote((prev) => ({
              ...prev,
              text,
              styles: removeElementAtIndex(prev.styles, i),
            }));
            return;
          }
          if (style.interval.end <= style.interval.start) {
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
              increment &&
              selectionRef.end > style.interval.start &&
              selectionRef.end < style.interval.end
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
              selectionRef.start > style.interval.start &&
              selectionRef.end <= style.interval.end
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
              decrement &&
              selectionRef.start <= style.interval.start
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
              selectionRef.end <= style.interval.start
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
      {useEditNoteContent(
        editNote.styles,
        editNote.text,
        editNote.background,
        editNote.imageOpacity
      )}
    </TextInput>
  );
};
