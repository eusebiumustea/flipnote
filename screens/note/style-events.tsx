import React, { Dispatch, SetStateAction } from "react";
import { TextStyle } from "react-native";
import {
  removeObjectKey,
  replaceElementAtIndex,
  sortStyles,
} from "../../tools";
import { InputSelectionProps, TextNoteStyle, note } from "./types";

export function FontColorEvent(
  currentFocused: TextNoteStyle | undefined,
  hex: string,
  selection: InputSelectionProps,
  setEditNote: Dispatch<SetStateAction<note>>,
  currentIndex: number
) {
  if (!currentFocused && selection.end !== selection.start) {
    setEditNote((prev) => ({
      ...prev,
      styles: [
        ...prev.styles,
        {
          interval: selection,
          style: { color: hex },
        },
      ],
    }));
  }
  if (
    currentFocused &&
    currentFocused?.style?.color === undefined &&
    Object.keys(currentFocused.style).length >= 1
  ) {
    setEditNote((prev) => ({
      ...prev,
      styles: replaceElementAtIndex(prev.styles, currentIndex, {
        ...currentFocused,
        style: {
          ...currentFocused.style,
          color: hex,
        },
      }),
    }));
  }

  if (
    currentFocused &&
    currentFocused?.style?.color !== undefined &&
    Object.keys(currentFocused.style).length >= 1
  ) {
    setEditNote((prev) => ({
      ...prev,
      styles: replaceElementAtIndex(prev.styles, currentIndex, {
        ...currentFocused,
        style: { ...currentFocused.style, color: hex },
      }),
    }));
  }
}
export function StyleEvent(
  currentFocused: TextNoteStyle | undefined,
  keyStyle: keyof TextStyle,
  value: string,
  selection: InputSelectionProps,
  setEditNote: React.Dispatch<React.SetStateAction<note>>,
  currentIndex: number
) {
  if (!currentFocused && selection.end !== selection.start) {
    setEditNote((prev) => ({
      ...prev,
      styles: sortStyles([
        ...prev.styles,
        { interval: selection, style: { [keyStyle]: value } },
      ]),
    }));
  }
  if (
    currentFocused &&
    !Object.keys(currentFocused.style).includes(keyStyle) &&
    Object.keys(currentFocused.style).length >= 1
  ) {
    setEditNote((prev) => ({
      ...prev,
      styles: replaceElementAtIndex(prev.styles, currentIndex, {
        ...currentFocused,
        style: { ...currentFocused.style, [keyStyle]: value },
      }),
    }));
  }

  if (currentFocused && Object.keys(currentFocused.style).includes(keyStyle)) {
    setEditNote((prev) => ({
      ...prev,
      styles:
        Object.keys(currentFocused.style).length === 1
          ? prev.styles.filter((e) => e !== currentFocused)
          : replaceElementAtIndex(prev.styles, currentIndex, {
              ...currentFocused,
              style: removeObjectKey(currentFocused.style, keyStyle),
            }),
    }));
  }
}
export function FontFamilyEvent(
  currentFocused: TextNoteStyle | undefined,

  e: string,
  selection: InputSelectionProps,
  setEditNote: React.Dispatch<React.SetStateAction<note>>,
  currentIndex: number
) {
  if (!currentFocused && selection.end !== selection.start) {
    setEditNote((prev) => ({
      ...prev,
      styles: sortStyles([
        ...prev.styles,
        {
          interval: selection,
          style: { fontFamily: e },
        },
      ]),
    }));
  }
  if (currentFocused?.style?.fontFamily === e) {
    return;
  }
  if (
    currentFocused &&
    currentFocused?.style?.fontFamily !== undefined &&
    Object.keys(currentFocused.style).length >= 1
  ) {
    setEditNote((prev) => ({
      ...prev,
      styles: replaceElementAtIndex(prev.styles, currentIndex, {
        ...currentFocused,
        style: {
          ...currentFocused.style,
          fontFamily: e,
        },
      }),
    }));
  }
  if (
    currentFocused &&
    currentFocused?.style?.fontFamily === undefined &&
    Object.keys(currentFocused.style).length >= 1
  ) {
    setEditNote((prev) => ({
      ...prev,
      styles: replaceElementAtIndex(prev.styles, currentIndex, {
        ...currentFocused,
        style: {
          ...currentFocused.style,
          fontFamily: e,
        },
      }),
    }));
  }

  // if (
  //   currentFocused &&
  //   currentFocused?.style?.fontFamily !== undefined &&
  //   Object.keys(currentFocused.style).length >= 1
  // ) {
  //   setEditNote((prev) => ({
  //     ...prev,
  //     styles:
  //       Object.keys(currentFocused.style).length === 1
  //         ? prev.styles.filter((e) => e !== currentFocused)
  //         : replaceElementAtIndex(prev.styles, currentIndex, {
  //             ...currentFocused,
  //             style: removeObjectKey(
  //               currentFocused.style,
  //               "fontFamily"
  //             ),
  //           }),
  //   }));
  // }
}
export function onFontColor(
  currentFocused: TextNoteStyle | undefined,
  selection: InputSelectionProps,
  setEditNote: React.Dispatch<React.SetStateAction<note>>,
  currentIndex: number
) {
  if (!currentFocused && selection.end !== selection.start) {
    setEditNote((prev) => ({
      ...prev,
      styles: sortStyles([
        ...prev.styles,
        {
          interval: selection,
          style: { color: "#0213f5" },
        },
      ]),
    }));
  }
  if (
    currentFocused &&
    !Object.keys(currentFocused.style).includes("color") &&
    Object.keys(currentFocused.style).length >= 1
  ) {
    setEditNote((prev) => ({
      ...prev,
      styles: replaceElementAtIndex(prev.styles, currentIndex, {
        ...currentFocused,
        style: {
          ...currentFocused.style,
          color: "#0213f5",
        },
      }),
    }));
  }
}
