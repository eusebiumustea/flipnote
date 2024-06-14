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
  currentSelectedStyle?: TextNoteStyle;
  fontFamilyFocused?: string;
  currentIndex?: number;
  selection?: InputSelectionProps;
  defaultTextColor?: string;
}

export interface Note {
  id: number;
  title: string;
  text: string;
  isFavorite: boolean;
  background: string;
  styles: TextNoteStyle[];
  generalStyles: TextStyle;
  reminder: number | null;
  contentPosition: "center" | "left" | "right";
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
  contentPosition: "center" | "left" | "right";
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
