import { Dispatch, SetStateAction } from "react";
import { Animated } from "react-native";
import { NotePreviewTypes } from "../../note";

export type NotesListProps = {
  data?: NotePreviewTypes[];
  optionsSelection?: number[];
  selected?: string[];
  setSelected?: Dispatch<SetStateAction<string[]>>;
  searchFilter?: NotePreviewTypes[];
  favorite?: boolean;
  setFavorite?: Dispatch<SetStateAction<boolean>>;
  setOptionsSelection?: Dispatch<SetStateAction<number[]>>;
  scrollY?: Animated.Value;
};
