import {
  Dispatch,
  LegacyRef,
  SetStateAction,
  forwardRef,
  memo,
  useRef,
} from "react";

import { TextInput, TextInputProps } from "react-native";
import { useToast } from "../../components";
import { useEditNoteContent, useTheme } from "../../hooks";
import { contentLengthLimit, range } from "../../tools";
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
    const toast = useToast();
    return (
      <TextInput
        maxLength={contentLengthLimit()}
        onSelectionChange={({ nativeEvent: { selection } }) => {
          selectionRef.start = selection.start;
          selectionRef.end = selection.end;
          setInputSelection(selection);
        }}
        placeholderTextColor={theme.placeholder}
        cursorColor={"#FFCB09"}
        contextMenuHidden
        scrollEnabled={false}
        selectionColor={"#FFF3C7"}
        autoCorrect={false}
        spellCheck={false}
        autoComplete="off"
        secureTextEntry={false}
        textAlign={editNote.contentPosition}
        textContentType="none"
        onChangeText={(text) => {
          if (text.length >= contentLengthLimit()) {
            toast({
              message: "You reached max limit. Start a new note",
              textColor: "orange",
            });
          }

          const textSelected = selectionRef.start !== selectionRef.end;
          const increment = text.length > editNote.text.length;
          const decrement = text.length < editNote.text.length;
          // editNote.styles.map((style, i) => {
          //   if (text.slice(style.interval.start).length === 0) {
          //     setEditNote((prev) => ({
          //       ...prev,
          //       text,
          //       styles: removeElementAtIndex(prev.styles, i),
          //     }));
          //     return;
          //   }
          //   if (style.interval.start === style.interval.end) {
          //     setEditNote((prev) => ({
          //       ...prev,
          //       text,
          //       styles: removeElementAtIndex(prev.styles, i),
          //     }));
          //     return;
          //   }
          //   if (decrement && style.interval.end - style.interval.start === 1) {
          //     setEditNote((prev) => ({
          //       ...prev,
          //       text,
          //       styles: removeElementAtIndex(prev.styles, i),
          //     }));
          //     return;
          //   }
          // });
          setEditNote((prev) => ({
            ...prev,
            text,
            styles: prev.styles.map((style, i) => {
              if (
                !textSelected &&
                decrement &&
                range(style.interval.start + 1, style.interval.end).includes(
                  selectionRef.end
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
                range(
                  style.interval.start + 1,
                  style.interval.end - 1
                ).includes(selectionRef.end)
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
                selectionRef.end <= style.interval.start
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
        clearButtonMode="always"
        smartInsertDelete={false}
        {...inputProps}
      >
        {useEditNoteContent(
          editNote.styles,
          editNote.text,
          editNote.background
        )}
      </TextInput>
    );
  }
);
