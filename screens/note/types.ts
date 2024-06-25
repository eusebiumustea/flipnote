import { Dispatch, SetStateAction } from "react";
import { TextStyle } from "react-native";
export interface TextNoteStyle {
  interval?: InputSelectionProps;
  style?: TextStyle;
}
export interface ReminderProps {
  date: Date;
  time: Date;
}
export interface OptionProps {
  setEditNote?: Dispatch<SetStateAction<Note>>;
  colors?: string[];
  editNote?: Note;
  fonts?: string[];
  defaultTextColor?: string;
  onColorChange?: (value: string, type: string) => void;
}

export interface Note {
  id: number;
  title: string;
  text: string;
  isFavorite: boolean;
  background: string;
  reminder: number | null;
  imageOpacity: number;
  imageData: string;
}
export interface NotePreviewTypes {
  id: number;
  title: string;
  text: string;
  isFavorite: boolean;
  background: string;
  reminder: number | null;
  imageOpacity: number;
}
export interface InputSelectionProps {
  start: number;
  end: number;
}
export interface UserdataState {
  loading: boolean;
  data: NotePreviewTypes[];
  loaded: boolean;
}
export type NotificationProp = {
  title: string;
  content: string;
  time: Date;
};
export interface NotificationState {
  data: NotificationProp[];
}
