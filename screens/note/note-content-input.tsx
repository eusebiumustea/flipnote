import { Dispatch, SetStateAction, memo, useRef } from "react";

import { TextInput, TextInputProps } from "react-native";
import { useEditNoteContent, useTheme } from "../../hooks";
import {
  contentLengthLimit,
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
    console.log(editNote.styles);

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
        textAlign={editNote.contentPosition}
        textContentType="none"
        allowFontScaling={false}
        onChangeText={(text) => {
          const textSelected = selectionRef.start !== selectionRef.end;
          const increment = text.length > editNote.text.length;
          const decrement = text.length < editNote.text.length;
          editNote.styles.map((style, i) => {
            if (style.interval.start === style.interval.end) {
              setEditNote((prev) => ({
                ...prev,
                text,
                styles: removeElementAtIndex(prev.styles, i),
              }));
              return;
            }
          });
          // editNote.styles.map((style, i) => {
          // if (text.slice(style.interval.start).length === 0) {
          //   setEditNote((prev) => ({
          //     ...prev,
          //     text,
          //     styles: removeElementAtIndex(prev.styles, i),
          //   }));
          //   return;
          // }
          // if (style.interval.start === style.interval.end) {
          //   setEditNote((prev) => ({
          //     ...prev,
          //     text,
          //     styles: removeElementAtIndex(prev.styles, i),
          //   }));
          //   return;
          // }
          //   if (decrement && style.interval.end - style.interval.start === 1) {
          //     setEditNote((prev) => ({
          //       ...prev,
          //       text,
          //       styles: removeElementAtIndex(prev.styles, i),
          //     }));
          //     return;
          //   }
          // });
          console.log(editNote.text.length - text.length);
          setEditNote((prev) => ({
            ...prev,
            text,
            styles: prev.styles.map((style, i) => {
              if (
                decrement &&
                textSelected &&
                selectionRef.end >= style.interval.start &&
                selectionRef.end <= style.interval.end &&
                selectionRef.start < style.interval.start
              ) {
                return {
                  ...style,
                  interval: {
                    start:
                      selectionRef.end === style.interval.end
                        ? 0
                        : style.interval.start -
                          (editNote.text.length - text.length) +
                          selectionRef.end -
                          style.interval.start,
                    end:
                      selectionRef.end === style.interval.end
                        ? 0
                        : style.interval.end -
                          (editNote.text.length - text.length),
                  },
                };
              }
              // if (
              //   textSelected &&
              //   decrement &&
              //   selectionRef.start >= style.interval.start &&
              //   selectionRef.end >= style.interval.end
              // ) {
              //   return {
              //     ...style,
              //     interval: {
              //       start:
              //         selectionRef.start === style.interval.start
              //           ? 0
              //           : style.interval.start,
              //       end:
              //         selectionRef.start === style.interval.start
              //           ? 0
              //           : style.interval.end -
              //             (style.interval.end - selectionRef.start),
              //     },
              //   };
              // }
              // if (
              //   textSelected &&
              //   decrement &&
              //   selectionRef === style.interval
              // ) {
              //   return {
              //     ...style,
              //     interval: {
              //       start: 0,
              //       end: 0,
              //     },
              //   };
              // }

              // if (
              //   !textSelected &&
              //   decrement &&
              //   range(style.interval.start + 1, style.interval.end).includes(
              //     selectionRef.end
              //   )
              // ) {
              //   return {
              //     ...style,
              //     interval: {
              //       ...style.interval,
              //       end:
              //         style.interval.end - (editNote.text.length - text.length),
              //     },
              //   };
              // }
              // if (
              //   !textSelected &&
              //   increment &&
              //   range(
              //     style.interval.start + 1,
              //     style.interval.end - 1
              //   ).includes(selectionRef.end)
              // ) {
              //   return {
              //     ...style,
              //     interval: {
              //       ...style.interval,
              //       end:
              //         style.interval.end + (text.length - editNote.text.length),
              //     },
              //   };
              // }
              if (
                !textSelected &&
                selectionRef.end <= style.interval.start &&
                decrement
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
                selectionRef.end <= style.interval.start &&
                increment
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
