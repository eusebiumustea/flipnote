import { Dispatch, SetStateAction } from "react";
import { ElementPositionTypes, note } from "../../note";
import { Animated } from "react-native";

export type NotesListProps = {
  data?: note[];
  optionsSelection?: number[];
  setOptionsSelection?: Dispatch<SetStateAction<number[]>>;
  scrollY?: Animated.Value;
  setElementPosition?: Dispatch<SetStateAction<ElementPositionTypes>>;
};
