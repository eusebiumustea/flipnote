import { Dispatch, SetStateAction } from "react";
import { TextNoteStyle, note } from "../types";
import { ColorValue } from "react-native";

export interface HistoryChangesProps {
  styles: TextNoteStyle[];
  setEditNote: Dispatch<SetStateAction<note>>;
  opened: boolean;
  onClose: () => void;
  text: string;
  background: ColorValue | string;
}
