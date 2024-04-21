import { Dispatch, SetStateAction, memo, useRef } from "react";

import { TextInput, TextInputProps } from "react-native";
import { useEditNoteContent, useTheme } from "../../hooks";
import {
  contentLengthLimit,
  range,
  removeElementAtIndex,
  verticalScale,
} from "../../tools";
import { InputSelectionProps, TextNoteStyle, note } from "./types";
type NoteContentInputProps = {
  setEditNote?: Dispatch<SetStateAction<note>>;
  editNote?: note;
  setInputSelection?: Dispatch<SetStateAction<InputSelectionProps>>;
  inputProps?: TextInputProps;
  currentFocused?: TextNoteStyle;
};
export const NoteContentInput = memo(
  ({
    editNote,
    setEditNote,
    setInputSelection,
    inputProps,
    currentFocused,
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
          console.log("selection", selection);
          setInputSelection(selection);
        }}
        placeholderTextColor={theme.placeholder}
        scrollEnabled={false}
        autoCorrect={false}
        spellCheck={false}
        autoComplete="off"
        id="contentInput"
        textAlign={editNote.contentPosition}
        textContentType="none"
        allowFontScaling={false}
        onChangeText={(text) => {
          const textSelected = selectionRef.start > selectionRef.end;
          const increment = text.length > editNote.text.length;
          const decrement = text.length < editNote.text.length;
          editNote.styles.forEach((style, i) => {
            if (style.interval.start === style.interval.end) {
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
                selectionRef.start > style.interval.start &&
                selectionRef.start <= style.interval.end
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
                      style.interval.start -
                      (editNote.text.length - text.length),
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
                      style.interval.start +
                      (text.length - editNote.text.length),
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
  }
);
