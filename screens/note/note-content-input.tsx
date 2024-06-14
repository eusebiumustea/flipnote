import { Dispatch, LegacyRef, SetStateAction, forwardRef, useRef } from "react";

import { TextInput, TextInputProps } from "react-native";
import { contentLengthLimit } from "../../constants";
import { useTheme } from "../../hooks";
import { InputSelectionProps, Note } from "./types";
type NoteContentInputProps = {
  setEditNote: Dispatch<SetStateAction<Note>>;
  editNote: Note;
  setInputSelection: Dispatch<SetStateAction<InputSelectionProps>>;
  inputProps: TextInputProps;
  inputSelection: InputSelectionProps;
};
export const NoteContentInput = ({
  editNote,
  setEditNote,
  setInputSelection,
  inputProps,
  inputSelection,
}: NoteContentInputProps) => {
  const theme = useTheme();
  let selectionRef = useRef<InputSelectionProps>({
    start: 0,
    end: 0,
  }).current;

  return (
    <TextInput
      onSelectionChange={(e) => {
        const {
          nativeEvent: { selection },
        } = e;

        selectionRef.start = selection.start;
        selectionRef.end = selection.end;
        setInputSelection((prev) => ({
          ...prev,
          start: selection.start,
          end: selection.end,
        }));
      }}
      importantForAutofill="no"
      placeholderTextColor={theme.placeholder}
      scrollEnabled={false}
      autoCorrect={false}
      selection={inputSelection}
      style={editNote.generalStyles}
      cursorColor={"#FFCB09"}
      spellCheck={false}
      autoComplete="off"
      textAlign={editNote.contentPosition}
      textContentType="none"
      allowFontScaling={false}
      smartInsertDelete={false}
      maxLength={contentLengthLimit()}
      onChangeText={(text) => {
        const textSelected = selectionRef.end > selectionRef.start + 1;
        const increment = text.length > editNote.text.length;
        const decrement = text.length < editNote.text.length;

        setEditNote((prev) => ({
          ...prev,
          text,
          styles: prev.styles
            .map((style) => {
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
                textSelected &&
                decrement &&
                selectionRef.start > style.interval.start &&
                selectionRef.start < style.interval.end
              ) {
                return {
                  ...style,
                  interval: {
                    start: style.interval.start,
                    end:
                      style.interval.end -
                      (style.interval.end - selectionRef.start),
                  },
                };
              }
              // if (
              //   textSelected &&
              //   decrement &&
              //   selectionRef.end > style.interval.start &&
              //   selectionRef.end < style.interval.end
              // ) {
              //   return {
              //     ...style,
              //     interval: {
              //       start:
              //         style.interval.start -
              //         (editNote.text.length - text.length) +
              //         selectionRef.end -
              //         style.interval.start,

              //       end:
              //         style.interval.end - (editNote.text.length - text.length),
              //     },
              //   };
              // }
              if (selectionRef.end <= style.interval.start) {
                return {
                  ...style,
                  interval: {
                    start: increment
                      ? style.interval.start +
                        (text.length - editNote.text.length)
                      : style.interval.start -
                        (editNote.text.length - text.length),
                    end: increment
                      ? style.interval.end +
                        (text.length - editNote.text.length)
                      : style.interval.end -
                        (editNote.text.length - text.length),
                  },
                };
              }
              return style;
            })
            .filter((style) => {
              if (
                style.interval.end <= style.interval.start ||
                style.interval.start >= text.length
              ) {
                return false;
              }
              if (
                (textSelected &&
                  decrement &&
                  selectionRef.start <= style.interval.start &&
                  selectionRef.end >= style.interval.end) ||
                (textSelected &&
                  decrement &&
                  selectionRef.end > style.interval.start &&
                  selectionRef.end < style.interval.end)
              ) {
                return false;
              }
              // if (
              //   (textSelected &&
              //     decrement &&
              //     selectionRef.start <= style.interval.start &&
              //     selectionRef.end >= style.interval.end) ||
              //   (textSelected &&
              //     decrement &&
              //     selectionRef.start > style.interval.start &&
              //     selectionRef.start < style.interval.end) ||
              //   (textSelected &&
              //     decrement &&
              //     selectionRef.end > style.interval.start &&
              //     selectionRef.end < style.interval.end)
              // ) {
              //   return false;
              // }
              return true;
            }),
        }));
      }}
      multiline
      placeholder="Take the note"
      {...inputProps}
    />
  );
};
